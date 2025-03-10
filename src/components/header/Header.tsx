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
        {/* Left side - Logo */}
        <Flex align="center" gap="2">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Flex align="center" gap="2">
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="black" />
                  <path d="M7 13L10 10M10 10L7 7M10 10H16.5M14 7L17 10M17 10L14 13M17 10H10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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