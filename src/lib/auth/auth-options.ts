import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "./42-provider";

// Étendre le type JWT pour inclure les propriétés personnalisées
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login: string;
    };
  }
}

// Étendre le type Session pour inclure les propriétés personnalisées
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      login?: string;
    };
  }
}

// Définir le type pour l'utilisateur 42
interface FortyTwoUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider()
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and user data to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.user = user as FortyTwoUser;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user data
      session.accessToken = token.accessToken;
      
      // S'assurer que toutes les informations utilisateur sont disponibles dans la session
      if (token.user) {
        session.user = {
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
        };
        
        // Ajouter des propriétés personnalisées à l'objet session
        session.user.id = token.user.id;
        session.user.login = token.user.login;
      }
      
      return session;
    },
  }
}; 