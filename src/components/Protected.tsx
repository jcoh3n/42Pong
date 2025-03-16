'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Box } from '@radix-ui/themes';
import Loading from './Loading';
import WinPopup from './match/WinPopup';
import LoginContent from '@/app/(login)/login/page';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: currentUser, isLoading, error } = useCurrentUser();

  // Pendant le chargement initial
  if (isLoading) {
    return (
      <Box style={{ 
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Loading />
      </Box>
    );
  }

  // Si l'utilisateur n'est pas authentifié, ne rien afficher (la redirection est gérée par useEffect)
  if (!currentUser) {
    router.push('/login');
  }

  // Afficher le contenu protégé
  return <>{children}</>;
};

export default Protected;