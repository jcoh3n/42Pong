"use client";

import { Box, Flex, Text, Avatar } from "@radix-ui/themes";
import { 
  HomeIcon, 
  ListBulletIcon,
  GearIcon,
  ExitIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { SidebarNavItem } from "./SidebarNavItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(usePathname());
  const isDesktop = useMediaQuery(MEDIA_QUERIES.lg);
  const { data: user } = useCurrentUser();

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    if (!isDesktop && onClose) {
      onClose();
    }
  };

  return (
    <Box
      className={`
        fixed z-50 w-[300px]
        ${isDesktop 
          ? 'top-4 left-4 bottom-4' 
          : 'top-[84px] left-4 bottom-4 pointer-events-none'
        }
        ${!isDesktop && !isOpen ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className={`
        h-full bg-gray-900/5 backdrop-blur-md
        rounded-2xl
        border border-white/10
        overflow-hidden pointer-events-auto
        flex flex-col relative
        shadow-xl shadow-black/5
      `}>
        {/* Blur effect background */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 rounded-2xl"
          style={{
            WebkitBackdropFilter: 'blur(12px)',
            backdropFilter: 'blur(12px)',
          }}
        />

        {/* Content */}
        <div className="relative flex-1 flex flex-col min-h-0 z-10">
          {/* Header with Logo and Close button */}
          <Flex align="center" justify="between" px="5" py="4" className="relative shrink-0">
            <div onClick={() => router.push('/')} className="cursor-pointer flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Ping Pong Paddle */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg" />
                <div className="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full" />
                {/* 42 Logo */}
                <span className="relative text-blue-400 font-bold text-lg">42</span>
              </div>
              <Text size="5" weight="bold" className="text-gray-100">Pong</Text>
            </div>
            
            {!isDesktop && (
              <Box 
                onClick={onClose}
                className="cursor-pointer p-2 hover:bg-white/5 rounded-full transition-all duration-200"
              >
                <Cross2Icon width="20" height="20" className="text-gray-400" />
              </Box>
            )}
          </Flex>

          {/* User Profile - Desktop Only */}
          {isDesktop && user && (
            <Box className="px-4 py-3">
              <Link href="/profile" className="no-underline block">
                <div className="
                  rounded-xl bg-white/5 border border-white/10
                  p-4 group hover:bg-white/10 hover:border-blue-500/20
                  transition-all duration-200
                ">
                  <Flex align="center" gap="3">
                    <Avatar
                      size="5"
                      src={user.avatar_url || undefined}
                      fallback={user.login?.[0]?.toUpperCase() || "U"}
                      radius="full"
                      className="
                        border-2 border-gray-800
                        transition-all duration-200
                        group-hover:border-blue-500/50
                        shadow-lg
                      "
                    />
                    <Box>
                      <Text className="text-gray-100 font-medium mb-1">{user.login}</Text>
                      <Flex align="center" gap="2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <Text size="1" className="text-gray-400">Online</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </div>
              </Link>
            </Box>
          )}
          
          {/* Main Navigation */}
          <Box className="flex-1 overflow-y-auto py-4 px-2 min-h-0">
            <Flex direction="column" gap="2">
              <SidebarNavItem 
                icon={<HomeIcon width="20" height="20" />} 
                label="Home" 
                href="/"
                isActive={activeItem === '/'}
                onItemClick={() => handleNavigation('/')}
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
          
          {/* Bottom Navigation */}
          <Box p="4" className="shrink-0">
            <SidebarNavItem
              onItemClick={signOut}
              icon={<ExitIcon width="20" height="20" />} 
              label="Log out"
            />
          </Box>
        </div>
      </div>
    </Box>
  );
}
