import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Récupérer le token depuis les cookies
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;
  
  // Récupérer le chemin demandé
  const { pathname } = request.nextUrl;
  
  // Routes protégées qui nécessitent une authentification
  const protectedRoutes = ['/profile'];
  
  // Vérifier si la route actuelle est protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Si la route est protégée et que l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Si l'utilisateur est déjà authentifié et qu'il essaie d'accéder à la page de login, rediriger vers la page de profil
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  // Sinon, continuer normalement
  return NextResponse.next();
}

// Configurer les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: ['/profile/:path*', '/login']
}; 