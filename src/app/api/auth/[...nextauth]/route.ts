import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "@/lib/auth/42-provider";

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider()
  ],
  debug: true, // Activer le mode debug pour voir plus d'informations
  pages: {
    signIn: "/login",
    error: "/login", // Page à afficher en cas d'erreur
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 