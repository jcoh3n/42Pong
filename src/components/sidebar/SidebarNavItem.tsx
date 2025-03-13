"use client";

import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
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
  const content = (
    <Flex 
      align="center" 
      gap="3" 
      px="4" 
      py="2"
      className={`
        group cursor-pointer
        transition-all duration-200
        hover:bg-white/5
        ${isActive ? 'bg-white/5' : ''}
      `}
    >
      <span className={`
        transition-colors duration-200
        ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}
      `}>
        {icon}
      </span>
      <Text className={`
        transition-colors duration-200
        ${isActive ? 'text-blue-400 font-medium' : 'text-gray-300 group-hover:text-gray-200'}
      `}>
        {label}
      </Text>
    </Flex>
  );

  if (href) {
    return (
      <Link href={href} onClick={onItemClick} className="no-underline">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onItemClick} role="button" tabIndex={0}>
      {content}
    </div>
  );
} 