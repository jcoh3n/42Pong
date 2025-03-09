"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Client component that uses useSearchParams
function LoginContent() {
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
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-70 border border-gray-200 shadow-sm"
      >
        {isLoading ? (
          "Connexion en cours..."
        ) : (
          <>
            Login with
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
              alt="42 Logo"
              className="h-6 w-6"
            />
          </>
        )}
      </button>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}

// Loading fallback for Suspense
function LoginLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Bienvenue sur 42Pong</h1>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Login() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
} 