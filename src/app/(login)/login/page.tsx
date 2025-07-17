"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LavaLamp } from "@/components/ui/fluid-blob";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'erreur des paramètres d'URL
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        OAuthSignin: "Erreur lors de la connexion avec 42. Veuillez réessayer.",
        OAuthCallback: "Erreur lors de la réponse de 42. Veuillez réessayer.",
        OAuthCreateAccount: "Erreur lors de la création du compte. Veuillez réessayer.",
        Callback: "Erreur de connexion avec 42. Veuillez réessayer.",
        AccessDenied: "Accès refusé par 42.",
        default: "Une erreur s'est produite. Veuillez réessayer."
      };
      
      toast.error(errorMessages[errorParam] || errorMessages.default);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      
      const result = await signIn("42-school", {
        redirect: true,
        callbackUrl: callbackUrl
      });

      // Si la connexion échoue sans redirection
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center relative">
      {/* Arrière-plan fluid-blob */}
      <LavaLamp />
      
      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo 42 */}
        <div className="mix-blend-exclusion">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
            alt="42 Logo"
            className="w-32 h-32 filter brightness-0 invert"
          />
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mix-blend-exclusion text-white whitespace-nowrap">
          42Pong
        </h1>

        {/* Phrase d'accroche */}
        <p className="text-base md:text-lg text-center text-white mix-blend-exclusion max-w-md leading-relaxed opacity-80 font-light italic -mt-4">
          parce que coder, c'est trop mainstream.
        </p>

        {/* Bouton de connexion design */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`
            relative px-8 py-3 bg-white text-black font-medium rounded-full
            mix-blend-exclusion hover:bg-gray-100 transition-all duration-300
            transform hover:scale-105 active:scale-95
            ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
            shadow-lg hover:shadow-xl
          `}
        >
          <span>
            {isLoading ? "Connexion..." : "Connexion"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default LoginContent; 
