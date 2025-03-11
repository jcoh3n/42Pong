import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "./42-provider";
import { userService } from "@/services";

// Types pour l'authentification
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    login: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: FortyTwoUser;
  }
}

// Type pour l'utilisateur 42
interface FortyTwoUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login: string;
}

export const authOptions: NextAuthOptions = {
  providers: [FortyTwoProvider()],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.login || !user?.id) {
        console.error("[Auth] Missing required user data:", user);
        return false;
      }

      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await userService.getUserByLogin(user.login);
        if (existingUser) {
          // Mettre à jour les informations de l'utilisateur si nécessaire
          if (existingUser.avatar_url !== user.image) {
            await userService.updateUser(existingUser.id, {
              avatar_url: user.image || "",
            });
          }
          return true;
        }

        // Créer le nouvel utilisateur avec l'ID 42
        await userService.createUser({
          id: user.id, // Utiliser l'ID 42 au lieu d'un UUID
          login: user.login,
          avatar_url: user.image || "",
          elo_score: 1000,
          created_at: new Date().toISOString(),
          theme: "dark",
          language: "fr",
          notifications: true,
          wins: 0,
          total_games: 0,
        });

        return true;
      } catch (error) {
        console.error("[Auth] User creation/update error:", error);
        return false; // Ne pas permettre la connexion en cas d'erreur
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.user = user as FortyTwoUser;
      }

      // Vérifier si le token est expiré
      if (token.expiresAt && Date.now() >= token.expiresAt * 1000) {
        // Token expiré, déconnecter l'utilisateur
        return {};
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.accessToken = token.accessToken;
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
          login: token.user.login,
        };
      }
      return session;
    },
  },
}; 