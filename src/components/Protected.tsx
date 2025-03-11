'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Box } from '@radix-ui/themes';
import Loading from './Loading';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: currentUser, isLoading, error } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (!currentUser || error)) {
      // Stocker le chemin actuel dans le localStorage pour la redirection après login
      if (typeof window !== 'undefined' && pathname !== '/login') {
        localStorage.setItem('loginRedirect', pathname);
      }
      router.replace(`/login`);
    } else if (currentUser && pathname === '/login') {
      // Si l'utilisateur est connecté et sur la page de login, rediriger vers la page d'accueil
      router.replace('/');
    }
  }, [currentUser, isLoading, error, router, pathname]);

  // Pendant le chargement initial
  if (isLoading) {
    return (
      <Box style={{ 
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)'
      }}>
        <Loading />
      </Box>
    );
  }

  // Si l'utilisateur n'est pas authentifié, ne rien afficher (la redirection est gérée par useEffect)
  if (!currentUser) {
    return null;
  }

  // Afficher le contenu protégé
  return <>{children}</>;
};

export default Protected;