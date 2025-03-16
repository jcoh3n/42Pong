import React from 'react';
import { Box, Container, Flex } from "@radix-ui/themes";
import PongPaddle from '@/components/PongPaddle/PongPaddle';

const LoadingState: React.FC = () => {
  return (
    <Box className="min-h-screen">
      <Container size="3" py="9">
        <Flex align="center" justify="center" className="min-h-[70vh]" direction="column" gap="4">
          <PongPaddle />
        </Flex>
      </Container>
    </Box>
  );
};

export default LoadingState; 