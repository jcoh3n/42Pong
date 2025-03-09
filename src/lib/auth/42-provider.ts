import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

export function FortyTwoProvider(options?: Partial<OAuthUserConfig<any>>): OAuthConfig<any> {
  return {
    id: "42-school",
    name: "42",
    type: "oauth",
    authorization: {
      url: "https://api.intra.42.fr/oauth/authorize",
      params: { 
        scope: "public",
        response_type: "code"
      }
    },
    token: {
      url: "https://api.intra.42.fr/oauth/token",
      params: { 
        grant_type: "authorization_code"
      }
    },
    userinfo: {
      url: "https://api.intra.42.fr/v2/me"
    },
    clientId: process.env.NEXT_PUBLIC_42_CLIENT_ID,
    clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.displayname || profile.login,
        email: profile.email,
        image: profile.image?.link,
        login: profile.login
      };
    },
    ...options
  };
} 