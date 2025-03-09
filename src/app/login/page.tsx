"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const handleLogin = () => {
    // Utilisation de l'URL de redirection configurée dans l'API 42
    signIn("42-school", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to 42Pong</h1>
      
      <button
        onClick={handleLogin}
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <span>Login with 42</span>
      </button>
    </div>
  );
} 