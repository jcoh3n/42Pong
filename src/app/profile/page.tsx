"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      {userData ? (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          {userData.image && (
            <div className="flex justify-center mb-6">
              <Image
                src={userData.image}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{userData.displayname || userData.login}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>

            {userData.campus && (
              <div>
                <h3 className="font-medium">Campus</h3>
                <p>{userData.campus[0]?.name || "Unknown"}</p>
              </div>
            )}

            {userData.cursus_users && (
              <div>
                <h3 className="font-medium">Level</h3>
                <p>
                  {userData.cursus_users[0]?.level.toFixed(2) || "Unknown"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <p>Failed to load user data</p>
      )}
    </div>
  );
} 