"use client";

import { Flex, Text, Box } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onItemClick?: () => void;
}

export function SidebarNavItem({ 
  icon, 
  label,
  href,
  isActive,
  onItemClick,
}: SidebarNavItemProps) {
  return (
    <Link 
      href={href} 
      onClick={onItemClick} 
      prefetch 
      className="no-underline text-current w-full"
      aria-current={isActive ? 'page' : undefined}
    >
      <Flex 
        align="center" 
        justify="between" 
        py="3" 
        px="4"
        className={`
          transition-colors duration-200
          ${isActive ? 'bg-blue-500/10 border-l-2 border-blue-500' : 'hover:bg-gray-500/5 border-l-2 border-transparent'}
        `}
      >
        <Flex align="center" gap="3">
          <Box className={`${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
            {icon}
          </Box>
          <Text className={`${isActive ? 'text-blue-500 font-medium' : 'text-gray-300'}`}>
            {label}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
} 