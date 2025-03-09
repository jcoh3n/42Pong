"use client";

import { Box, Flex, Separator, Text } from "@radix-ui/themes";
import { 
  HomeIcon, 
  DashboardIcon, 
  ListBulletIcon,
  PersonIcon,
  GearIcon,
  InfoCircledIcon,
  ExitIcon
} from "@radix-ui/react-icons";
import { SidebarNavItem } from "./SidebarNavItem";
import Link from "next/link";

export default function Sidebar() {
  return (
    <Box
      style={{ 
        width: '220px', 
        height: '100vh',
        borderRight: '1px solid var(--gray-5)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Logo */}
      <Flex align="center" py="4" px="4">
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
            <Text weight="bold" size="3">42Pong</Text>
          </Flex>
        </Link>
      </Flex>
      
      <Separator size="4" />
      
      {/* Main Navigation */}
      <Box py="2" style={{ flex: 1 }}>
        <Flex direction="column" gap="1">
          <SidebarNavItem 
            icon={<HomeIcon width="16" height="16" />} 
            label="Home" 
            href="/" 
          />
          <SidebarNavItem 
            icon={<DashboardIcon width="16" height="16" />} 
            label="Dashboard" 
            href="/dashboard" 
            hasAddButton 
            onAddClick={() => console.log("Add dashboard")} 
          />
          <SidebarNavItem 
            icon={<ListBulletIcon width="16" height="16" />} 
            label="Games" 
            href="/games" 
            hasAddButton 
            onAddClick={() => console.log("Add game")} 
          />
          <SidebarNavItem 
            icon={<PersonIcon width="16" height="16" />} 
            label="Leaderboard" 
            href="/leaderboard" 
          />
          <SidebarNavItem 
            icon={<GearIcon width="16" height="16" />} 
            label="Settings" 
            href="/settings" 
          />
        </Flex>
      </Box>
      
      {/* Bottom Navigation */}
      <Box py="2">
        <Separator size="4" mb="2" />
        <Flex direction="column" gap="1">
          <SidebarNavItem 
            icon={<InfoCircledIcon width="16" height="16" />} 
            label="Help & Information" 
            href="/help" 
          />
          <SidebarNavItem 
            icon={<ExitIcon width="16" height="16" />} 
            label="Log out" 
            href="/api/auth/signout" 
          />
        </Flex>
      </Box>
    </Box>
  );
}
