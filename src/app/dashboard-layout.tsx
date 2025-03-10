"use client";

import { Box, Flex } from "@radix-ui/themes";
import Sidebar from "@/components/sidebar/Sidebar";
import { Header } from "@/components/header/Header";
import useCurrentUser from "@/hooks/useCurrentUser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <Flex style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Box style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />
        <Box style={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
} 