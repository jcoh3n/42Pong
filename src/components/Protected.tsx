'use client';

import React, { ReactNode } from 'react';
import Login from '@/app/login/page';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Box, Text } from '@radix-ui/themes';
import { Container } from '@radix-ui/themes';
import { Flex } from '@radix-ui/themes';

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { data: currentUser, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
          <Flex align="center" justify="center" style={{ height: "100%", width: "100%" }}>
            <Text size="3">Loading...</Text>
          </Flex>
    );
  }

  if (!currentUser) {
    return (
          <Flex align="center" justify="center" style={{ height: "100%", width: "100%" }}>
            <Login />
          </Flex>
	);
  }

  return <>{children}</>;
}

export default Protected;