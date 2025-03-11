import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "./42-provider";
import { userService } from "@/services";
import { v4 as uuidv4 } from 'uuid';

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
      try {
        console.log("[Auth] Starting sign in process for user:", user.login);
        
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await userService.getUserByLogin(user.login);
        if (existingUser) {
          console.log("[Auth] Existing user found:", existingUser.login);
          return true;
        }

        console.log("[Auth] Creating new user:", user.login);
        // Créer le nouvel utilisateur
        await userService.createUser({
          id: uuidv4(),
          login: user.login,
          avatar_url: user.image || "",
          elo_score: 1000,
        });
        console.log("[Auth] Successfully created user:", user.login);

        return true;
      } catch (error) {
        console.error("[Auth] User creation error:", error);
        console.error("[Auth] Error details:", {
          user: user.login,
          errorMessage: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
        return true; // Permettre la connexion même en cas d'erreur
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.user = user as FortyTwoUser;
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