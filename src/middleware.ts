import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/login',
  '/auth',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/static',
];

// Vérifie si une route est publique
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les routes publiques
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Récupérer le token depuis les cookies
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    const url = new URL('/login', request.url);
    // Stocker l'URL de redirection seulement si ce n'est pas la page de login
    if (pathname !== '/login') {
      url.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(url);
  }

  // Vérifier si le token est expiré
  if (token.expiresAt && Date.now() >= token.expiresAt * 1000) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configurer les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}; 