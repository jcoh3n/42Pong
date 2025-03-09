import type { OAuthConfig } from "next-auth/providers/oauth";

export function FortyTwoProvider(): OAuthConfig<any> {
  return {
    id: "42-school",
    name: "42",
    type: "oauth",
    authorization: {
      url: "https://api.intra.42.fr/oauth/authorize",
      params: { 
        scope: "public",
        client_id: process.env.NEXT_PUBLIC_42_CLIENT_ID,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/42-school`
      }
    },
    token: {
      url: "https://api.intra.42.fr/oauth/token",
      params: {
        client_id: process.env.NEXT_PUBLIC_42_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/42-school`
      }
    },
    userinfo: "https://api.intra.42.fr/v2/me",
    clientId: process.env.NEXT_PUBLIC_42_CLIENT_ID,
    clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.displayname || profile.login,
        email: profile.email,
        image: profile.image?.link
      };
    }
  };
} 