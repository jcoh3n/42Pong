"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Button, Text, Card, Flex } from "@radix-ui/themes";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      
      setError(errorMessages[errorParam] || errorMessages.default);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      
      const result = await signIn("42-school", {
        redirect: true,
        callbackUrl: callbackUrl
      });

      // Si la connexion échoue sans redirection
      if (result?.error) {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Card size="3" style={{ 
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)"
        }}>
          <Flex direction="column" gap="4" align="center" p="6">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg"
              alt="42 Logo"
              className="w-16 h-16 mb-4"
            />
            
            <Text size="5" weight="bold" align="center" style={{ color: "white" }}>
              Bienvenue sur 42Pong
            </Text>
            
            <Text size="2" align="center" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Connectez-vous avec votre compte 42
            </Text>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              size="3"
              style={{ 
                width: "100%",
                background: "white",
                color: "black",
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter avec 42"}
            </Button>

            {error && (
              <Text color="red" size="2" align="center">
                {error}
              </Text>
            )}
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}

export default LoginContent; 