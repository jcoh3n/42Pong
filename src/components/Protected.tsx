'use client';

import React, { ReactNode, Suspense } from 'react';
import Login from '@/app/login/page';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Box, Text } from '@radix-ui/themes';
import { Container } from '@radix-ui/themes';
import { Flex } from '@radix-ui/themes';
import Loading from './Loading';
import WinPopup from './match/WinPopup';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { data: currentUser, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (<Loading />);
  }

  if (error || !currentUser) {
    return (
		<Flex align="center" justify="center" style={{ height: "100%", width: "100%" }}>
    		<Suspense fallback={<Loading />}>
				<Login />
			</Suspense>
		</Flex>
	);
  }

  return(
    <Suspense fallback={<Loading />}>
		{children}
    </Suspense>
  );
}

export default Protected;