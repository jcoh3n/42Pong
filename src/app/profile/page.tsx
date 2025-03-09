"use client";

import { useSession, signOut } from "next-auth/react";
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

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Votre Profil</h1>

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
            <div className="text-center">
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-gray-600">@{userData.login}</p>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Retour à l'accueil
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      ) : (
        <p>Impossible de charger les données utilisateur</p>
      )}
    </div>
  );
} 