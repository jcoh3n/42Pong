import type { NextAuthOptions } from "next-auth";
import { FortyTwoProvider } from "./42-provider";
import { userService } from "@/services";
import { v4 as uuidv4 } from "uuid";

// Type definitions for NextAuth
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

// Extended 42 user type with internal database ID
interface FortyTwoUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login: string;
  dbId?: string;
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
        const existingUser = await userService.getUserByLogin(user.login);
        
        if (existingUser) {
          // Update avatar if changed
          if (existingUser.avatar_url !== user.image) {
            await userService.updateUser(existingUser.id, {
              avatar_url: user.image || "",
            });
          }
          (user as FortyTwoUser).dbId = existingUser.id;
          return true;
        }

        // Create new user with generated UUID
        const dbId = uuidv4();
        await userService.createUser({
          id: dbId,
          login: user.login,
          avatar_url: user.image || "",
          elo_score: 1000,
          created_at: new Date().toISOString(),
          theme: "dark",
          language: "fr",
          notifications: true
        });

        (user as FortyTwoUser).dbId = dbId;
        return true;
      } catch (error) {
        console.error("[Auth] User creation/update error:", error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      if (account && user) {
        const ft_user = user as FortyTwoUser;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.user = {
          ...ft_user,
          id: ft_user.dbId || ft_user.id
        };
      }

      if (token.expiresAt && Date.now() >= token.expiresAt * 1000) {
        return {};
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.accessToken = token.accessToken;
        session.user = {
          id: token.user.dbId || token.user.id,
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