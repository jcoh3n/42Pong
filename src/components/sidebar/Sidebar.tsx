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
import { GiPingPongBat } from "react-icons/gi";
import { FaTrophy } from "react-icons/fa";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Composant LogoutButton réutilisable
function LogoutButton({ isMobile, onClick }: { isMobile: boolean; onClick: () => void }) {
  const baseStyles = "group cursor-pointer transition-all duration-200 hover:bg-white/[0.03] rounded-lg";
  const iconSize = isMobile ? 16 : 18;
  const padding = isMobile ? "px-3 py-1.5" : "px-4 py-2";
  const margin = isMobile ? "mx-4" : "";
  
  return (
    <div onClick={onClick} role="button" tabIndex={0} className={`${baseStyles} ${margin}`}>
      <Flex align="center" gap="3" className={padding}>
        <span className="text-gray-600 group-hover:text-gray-500 transition-colors duration-200 opacity-70 group-hover:opacity-90">
          <ExitIcon width={iconSize} height={iconSize} />
        </span>
        <Text 
          size={isMobile ? "1" : "2"}
          className="text-gray-500 group-hover:text-gray-400 transition-colors duration-200 font-normal opacity-80 group-hover:opacity-100"
        >
          Logout
        </Text>
      </Flex>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const { data: user } = useCurrentUser();
  const isDesktop = useMediaQuery(MEDIA_QUERIES['2xl']);

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    if (!isDesktop && onClose) onClose();
  };

  const handleLogout = () => {
    signOut();
    if (!isDesktop && onClose) onClose();
  };

  if (!isOpen) return null;

  const navItems = [
    { icon: <HomeIcon width="20" height="20" />, label: "Home", href: "/" },
    { icon: <PersonIcon width="20" height="20" />, label: "Profile", href: "/profile" },
    { icon: <GiPingPongBat width="20" height="20" />, label: "Games", href: "/games" },
    { icon: <FaTrophy width="20" height="20" />, label: "Leaderboard", href: "/leaderboard" },
    { icon: <ListBulletIcon width="20" height="20" />, label: "History", href: "/history" },
    { icon: <GearIcon width="20" height="20" />, label: "Settings", href: "/settings" },
  ];

  return (
    <Box
      className={`
        fixed z-40 w-[300px] transition-all duration-300 ease-in-out
        ${isDesktop ? 'top-4 left-4 bottom-4' : 'top-[84px] left-4 bottom-4'}
        ${!isDesktop && !isOpen ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="h-full bg-gray-900/5 rounded-2xl border border-white/10 overflow-hidden pointer-events-auto flex flex-col relative shadow-xl shadow-black/5">
        {/* Blur Background */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 rounded-2xl"
          style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
        />

        {/* Content */}
        <div className="relative flex-1 flex flex-col min-h-0 z-10">
          {/* Mobile Close Button */}
          {!isDesktop && (
            <Flex align="center" justify="end" px="5" py="2" className="shrink-0">
              <Box onClick={onClose} className="cursor-pointer p-2 hover:bg-white/5 rounded-full transition-all duration-200">
                <Cross2Icon width="20" height="20" className="text-gray-400" />
              </Box>
            </Flex>
          )}

          {/* Desktop User Profile */}
          {isDesktop && user && (
            <Box className="px-4 py-3">
              <Link href="/profile" className="no-underline block">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 group hover:bg-white/10 hover:border-blue-500/20 transition-all duration-200">
                  <Flex align="center" gap="3">
                    <Avatar
                      size="5"
                      src={user.avatar_url || undefined}
                      fallback={user.login?.[0]?.toUpperCase() || "U"}
                      radius="full"
                      className="border-2 border-gray-800 transition-all duration-200 group-hover:border-blue-500/50 shadow-lg"
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
              {navItems.map((item) => (
                <SidebarNavItem 
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isActive={activeItem === item.href}
                  onItemClick={() => handleNavigation(item.href)}
                />
              ))}
              
              {/* Mobile Logout */}
              {!isDesktop && (
                <>
                  <Box className="mx-4 my-2"><div className="h-px bg-white/10" /></Box>
                  <LogoutButton isMobile={true} onClick={handleLogout} />
                </>
              )}
            </Flex>
          </Box>
          
          {/* Desktop Bottom Logout */}
          {isDesktop && (
            <Box p="4" className="shrink-0">
              <Box className="mb-3"><div className="h-px bg-white/10" /></Box>
              <LogoutButton isMobile={false} onClick={handleLogout} />
            </Box>
          )}
          
          {/* Mobile Bottom Spacing */}
          {!isDesktop && (
            <Box 
              className="shrink-0"
              style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 20px)' }}
            />
          )}
        </div>
      </div>
    </Box>
  );
}
