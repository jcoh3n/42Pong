"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

// Définir le type pour les données utilisateur
interface UserData {
  id: string;
  login: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
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
        <div className="animate-spin h-6 w-6 border-2 border-gray-900 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-6">
        {userData?.image && (
          <div className="relative h-24 w-24 rounded-full overflow-hidden">
            <Image
              src={userData.image}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="text-center">
          <h2 className="text-xl font-medium">{userData?.name}</h2>
          <p className="text-gray-600">@{userData?.login}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 