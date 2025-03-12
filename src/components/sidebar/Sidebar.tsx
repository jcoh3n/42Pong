"use client";

import { Box, Flex, Separator, Text } from "@radix-ui/themes";
import { 
  HomeIcon, 
  ListBulletIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
  Cross2Icon
} from "@radix-ui/react-icons";
import { SidebarNavItem } from "./SidebarNavItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(usePathname());
  const { data: currentUser } = useCurrentUser();
  const isDesktop = useMediaQuery(MEDIA_QUERIES.lg);

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  // Gérer la navigation et fermer le sidebar sur mobile
  const handleNavigation = (path: string) => {
    setActiveItem(path);
    if (!isDesktop && onClose) {
      onClose();
    }
  };

  return (
    <Box
      className={`
        h-full flex flex-col bg-background border-r border-gray-200 dark:border-gray-800
        transition-opacity duration-300 ease-in-out
        ${!isDesktop && !isOpen ? 'opacity-0' : 'opacity-100'}
        ${!isDesktop && !isOpen ? 'hidden' : 'block'}
      `}
      style={{ 
        width: '100%',
        height: '100%'
      }}
    >
      {/* Logo and Title with Close button on mobile */}
      <Flex align="center" justify="between" px="5" py="4">
        <div onClick={() => router.push('/')} className="cursor-pointer flex flex-row items-center gap-2 ml-6">
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
        
        {/* Close button - visible only on mobile */}
        {!isDesktop && (
          <Box 
            onClick={onClose} 
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Cross2Icon width="20" height="20" />
          </Box>
        )}
      </Flex>
      <Separator size="4" />
      
      {/* Main Navigation */}
      <Box py="3" style={{ flex: 1, overflowY: 'auto' }}>
        <Flex direction="column" gap="2">
          <SidebarNavItem 
            icon={<HomeIcon width="20" height="20" />} 
            label="Home" 
            href="/"
            isActive={activeItem === '/'}
            onItemClick={() => handleNavigation('/')}
          />
          <SidebarNavItem 
            icon={<PersonIcon width="20" height="20" />} 
            label="Profile" 
            href="/profile"
            isActive={activeItem === '/profile'}
            onItemClick={() => handleNavigation('/profile')}
          />
          <SidebarNavItem 
            icon={<ListBulletIcon width="20" height="20" />} 
            label="Games" 
            href="/games"
            isActive={activeItem === '/games'}
            onItemClick={() => handleNavigation('/games')}
          />
          <SidebarNavItem 
            icon={<ListBulletIcon width="20" height="20" />} 
            label="Leaderboard" 
            href="/leaderboard"
            isActive={activeItem === '/leaderboard'}
            onItemClick={() => handleNavigation('/leaderboard')}
          />
          <SidebarNavItem 
            icon={<GearIcon width="20" height="20" />} 
            label="Settings" 
            href="/settings"
            isActive={activeItem === '/settings'}
            onItemClick={() => handleNavigation('/settings')}
          />
        </Flex>
      </Box>
      {currentUser && (
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
	  )}
    </Box>
  );
}
