import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "@/lib/auth/42-provider";

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
        token.user = user;
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
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 