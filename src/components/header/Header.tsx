"use client";

import { Flex, Box, Avatar } from "@radix-ui/themes";
import { SearchBar } from "./SearchBar";
import { NotificationBell } from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import Link from "next/link";
import { type User } from "@/services/types";
import useCurrentUser from "@/hooks/useCurrentUser";

export function Header() {
	const { data: user, isLoading } = useCurrentUser();

  return (
    <Box 
      style={{ 
        borderBottom: '1px solid var(--gray-5)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Flex 
        align="center" 
        justify="between" 
        px="5" 
        py="3"
        style={{ height: '64px' }}
      >
        {/* Left side - User Profile Picture */}
        <Flex align="center" gap="2">
          <Link href="/profile" prefetch style={{ textDecoration: 'none', color: 'inherit' }}>
            <Flex align="center" gap="2">
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}>
                {user && (
                  <Avatar
                    size="2"
                    src={user.avatar_url || undefined}
                    fallback={user.name?.[0] || "U"}
                    radius="full"
                  />
                )}
              </Box>
            </Flex>
          </Link>
        </Flex>

        {/* Center - Search Bar */}
        {/* <Box style={{ flexGrow: 1, maxWidth: '600px', margin: '0 24px' }}>
          <SearchBar />
        </Box> */}

        {/* Right side - Notifications and User Profile */}
        <Flex align="center" gap="4">
          <NotificationBell count={2} />
          {user && <UserProfile user={user} />}
        </Flex>
      </Flex>
    </Box>
  );
} 