"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Récupérer l'erreur des paramètres d'URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        OAuthSignin: "Erreur lors de la connexion avec 42. Veuillez réessayer.",
        OAuthCallback: "Erreur lors de la réponse de 42. Veuillez réessayer.",
        OAuthCreateAccount: "Erreur lors de la création du compte. Veuillez réessayer.",
      };
      
      setError(errorMessages[errorParam] || `Erreur d'authentification: ${errorParam}`);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn("42-school", { 
        callbackUrl: "/profile"
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Bienvenue sur 42Pong</h1>
          <p className="mt-2 text-gray-600">Connectez-vous pour continuer</p>
        </div>
        
        {error && (
          <div className="p-4 mt-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-8">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter avec 42"}
          </button>
        </div>
      </div>
    </div>
  );
} 