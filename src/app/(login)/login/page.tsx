"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Button, Text, Card, Flex } from "@radix-ui/themes";
import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import PongPaddle from "@/components/PongPaddle/PongPaddle";

function LoginContent() {
	return (
		<PongPaddle />
	)
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
    <Box className="min-h-screen">
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Card size="3" style={{ 
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.1)",
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
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
}

export default LoginContent; 
