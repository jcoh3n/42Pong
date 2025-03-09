import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

export function FortyTwoProvider(options?: Partial<OAuthUserConfig<any>>): OAuthConfig<any> {
  // Utiliser FT_REDIRECT_URI s'il est défini, sinon utiliser NEXTAUTH_URL
  const redirectUri = process.env.FT_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/callback/42-school`;
  
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
      // Simplification du profil pour ne garder que l'essentiel
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