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
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Container size="3" py="9">
          <Flex align="center" justify="center" style={{ minHeight: "70vh" }}>
            <Text size="3">Loading...</Text>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return <>{children}</>;
}

export default Protected;