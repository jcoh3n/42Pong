"use client";

import { Box, Flex, Text, Avatar } from "@radix-ui/themes";
import { 
  HomeIcon, 
  ListBulletIcon,
  GearIcon,
  ExitIcon,
  Cross2Icon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { SidebarNavItem } from "./SidebarNavItem";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { GamepadIcon } from "lucide-react";
import { GiPingPongBat } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(usePathname());
  const { data: currentUser } = useCurrentUser();
  const isDesktop = useMediaQuery(MEDIA_QUERIES['2xl']);
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

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      className={`
        fixed z-40 w-[300px]
        ${isDesktop 
          ? 'top-4 left-4 bottom-4' 
          : 'top-[84px] left-4 bottom-4'}
        ${!isDesktop && !isOpen ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className={`
        h-full bg-gray-900/5
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
          {/* Header with Close button */}
          {!isDesktop && (
            <Flex align="center" justify="end" px="5" py="2" className="relative shrink-0">
              <Box 
                onClick={onClose}
                className="cursor-pointer p-2 hover:bg-white/5 rounded-full transition-all duration-200"
              >
                <Cross2Icon width="20" height="20" className="text-gray-400" />
              </Box>
            </Flex>
          )}

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
          <Box className="flex-1 px-4 py-2">
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
                icon={<GiPingPongBat width="20" height="20" />} 
                label="Games" 
                href="/games"
                isActive={activeItem === '/games'}
                onItemClick={() => handleNavigation('/games')}
              />
              <SidebarNavItem 
                icon={<FaTrophy width="20" height="20" />} 
                label="Leaderboard" 
                href="/leaderboard"
                isActive={activeItem === '/leaderboard'}
                onItemClick={() => handleNavigation('/leaderboard')}
              />
              <SidebarNavItem 
                icon={<ListBulletIcon width="20" height="20" />} 
                label="History" 
                href="/history"
                isActive={activeItem === '/history'}
                onItemClick={() => handleNavigation('/history')}
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
          <Box 
            p="4" 
            className="shrink-0"
            style={{
              paddingBottom: !isDesktop ? 'calc(1rem + var(--safe-area-inset-bottom, 0px) + 20px)' : '1rem'
            }}
          >
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
