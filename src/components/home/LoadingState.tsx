import React from 'react';
import { Box, Container, Flex, Text } from "@radix-ui/themes";

const LoadingState: React.FC = () => {
  return (
    <Box className="min-h-screen">
      <Container size="3" py="9">
        <Flex align="center" justify="center" className="min-h-[70vh]" direction="column" gap="4">
          <Text size="5" weight="bold">Chargement...</Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default LoadingState; 