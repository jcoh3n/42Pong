"use client";

import { Box, Flex } from "@radix-ui/themes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex style={{ minHeight: '100vh' }}>
      <Box style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </Box>
    </Flex>
  );
} 