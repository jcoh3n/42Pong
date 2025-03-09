"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-3xl font-bold">Welcome to 42Pong</h1>
        
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="User profile"
            width={100}
            height={100}
            className="rounded-full"
          />
        )}
        
        <div className="text-center">
          <p className="text-xl mb-2">Hello, {session?.user?.name || "User"}!</p>
          <p className="text-sm text-gray-600 mb-6">
            {session?.user?.email || "No email available"}
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              View Profile
            </button>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
