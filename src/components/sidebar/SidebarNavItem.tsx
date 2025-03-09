import { Flex, Text, Box } from "@radix-ui/themes";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import React from "react";

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  hasAddButton?: boolean;
  onAddClick?: () => void;
}

export function SidebarNavItem({ 
  icon, 
  label, 
  href, 
  hasAddButton, 
  onAddClick 
}: SidebarNavItemProps) {
//   const pathname = usePathname();
//   const isActive = pathname === href;
  const isActive = false;
  
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Flex 
        align="center" 
        justify="between" 
        py="2" 
        px="4"
        style={{ 
          borderRadius: 'var(--radius-2)',
          backgroundColor: isActive ? 'var(--accent-3)' : 'transparent',
          color: isActive ? 'var(--accent-11)' : 'var(--gray-11)'
        }}
      >
        <Flex align="center" gap="3">
          <Box style={{ color: isActive ? 'var(--accent-9)' : 'var(--gray-9)' }}>
            {icon}
          </Box>
          <Text size="2" weight={isActive ? "medium" : "regular"}>
            {label}
          </Text>
        </Flex>
        
        {hasAddButton && (
          <div
            role="button"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onAddClick?.();
            }}
            style={{ 
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              color: 'var(--gray-9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 1C7.77614 1 8 1.22386 8 1.5V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V1.5C7 1.22386 7.22386 1 7.5 1Z" fill="currentColor" />
              <path d="M1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5Z" fill="currentColor" />
            </svg>
          </div>
        )}
      </Flex>
    </Link>
  );
} 