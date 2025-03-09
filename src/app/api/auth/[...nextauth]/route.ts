import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "@/lib/auth/42-provider";

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider()
  ],
  debug: true, // Activer le mode debug pour voir plus d'informations
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error", // Page to display in case of errors
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and user data to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.user = user;
      }
      
      // Check if the token is expired and needs to be refreshed
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now > token.expiresAt) {
        try {
          // Implement token refresh logic here if needed
          console.log("Token expired, should refresh");
        } catch (error) {
          console.error("Error refreshing access token", error);
          // On error, return the existing token
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user data
      session.accessToken = token.accessToken;
      
      // S'assurer que toutes les informations utilisateur sont disponibles dans la session
      if (token.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
          login: token.user.login
        };
      }
      
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("User signed in:", message);
    },
    async signOut(message) {
      console.log("User signed out:", message);
    },
    async error(message) {
      console.error("Auth error:", message);
    }
  },
  logger: {
    error(code, metadata) {
      console.error("NextAuth error:", { code, metadata });
    },
    warn(code) {
      console.warn("NextAuth warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth debug:", { code, metadata });
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 