"use client";

import { Box, Flex, Separator, Text } from "@radix-ui/themes";
import { 
  HomeIcon, 
  ListBulletIcon,
  PersonIcon,
  GearIcon,
  ExitIcon
} from "@radix-ui/react-icons";
import { SidebarNavItem } from "./SidebarNavItem";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(usePathname());

  useEffect(() => {
	setActiveItem(pathname);
  }, [pathname])


  
  return (
    <Box
      style={{ 
        width: '300px', 
        height: '100vh',
        borderRight: '1px solid var(--gray-5)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* <Separator size="4" /> */}

      {/* Logo and Title */}
		<div onClick={() => router.push('/')} className="cursor-pointer flex flex-row items-center gap-2 px-5 ml-6 py-4">
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
			<Text size="5" weight="bold">42Pong</Text>
		</div>
      <Separator size="4" />
      
      {/* Main Navigation */}
      <Box py="3" style={{ flex: 1 }}>
        <Flex direction="column" gap="2">
          <SidebarNavItem 
            icon={<HomeIcon width="20" height="20" />} 
            label="Home" 
            href="/"
            isActive={activeItem === '/'}
            onItemClick={() => setActiveItem('/')}
          />
          <SidebarNavItem 
            icon={<PersonIcon width="20" height="20" />} 
            label="Profile" 
            href="/profile"
            isActive={activeItem === '/profile'}
            onItemClick={() => setActiveItem('/profile')}
          />
          <SidebarNavItem 
            icon={<ListBulletIcon width="20" height="20" />} 
            label="Games" 
            href="/games"
            isActive={activeItem === '/games'}
            onItemClick={() => setActiveItem('/games')}
          />
          <SidebarNavItem 
            icon={<ListBulletIcon width="20" height="20" />} 
            label="Leaderboard" 
            href="/leaderboard"
            isActive={activeItem === '/leaderboard'}
            onItemClick={() => setActiveItem('/leaderboard')}
          />
          <SidebarNavItem 
            icon={<GearIcon width="20" height="20" />} 
            label="Settings" 
            href="/settings"
            isActive={activeItem === '/settings'}
            onItemClick={() => setActiveItem('/settings')}
          />
        </Flex>
      </Box>
      
      {/* Bottom Navigation */}
      <Box py="3">
        <Separator size="4" mb="3" />
        <Flex direction="column" gap="2">
          <SidebarNavItem 
		  	onItemClick={signOut}
            icon={<ExitIcon width="20" height="20" />} 
            label="Log out"
          />
        </Flex>
      </Box>
    </Box>
  );
}
