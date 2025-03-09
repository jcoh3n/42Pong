'use client';

import React, { ReactNode } from 'react';
import Login from '@/app/login/page';
import useCurrentUser from '@/hooks/useCurrentUser';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) {
    return <Login />;
  }

  return <>{children}</>;
}

export default Protected;