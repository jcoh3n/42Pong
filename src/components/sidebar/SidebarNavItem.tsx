import { Flex, Text, Box } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  return (
    <Link href={href || '#'} onClick={onItemClick} prefetch style={{ textDecoration: 'none', color: 'system' }}>
      <Flex 
        align="center" 
        justify="between" 
        py="3" 
        px="6"
        style={{ 
          borderRadius: '0',
          backgroundColor: isActive ? 'var(--accent-3)' : 'transparent',
          color: isActive ? 'var(--accent-11)' : 'var(--gray-11)'
        }}
      >
        <Flex align="center" gap="4">
          <Box style={{ color: isActive ? 'var(--accent-9)' : 'var(--gray-9)' }}>
            {icon}
          </Box>
          <Text size="3" weight={isActive ? "medium" : "regular"}>
            {label}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
} 