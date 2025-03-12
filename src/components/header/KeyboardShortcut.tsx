"use client";

import { Flex, Text } from "@radix-ui/themes";

interface KeyboardShortcutProps {
  shortcut: string;
  variant?: "default" | "subtle";
}

export function KeyboardShortcut({ 
  shortcut, 
  variant = "default" 
}: KeyboardShortcutProps) {
  const styles = {
    default: {
      backgroundColor: "var(--gray-5)",
      color: "var(--gray-11)",
    },
    subtle: {
      backgroundColor: "var(--gray-4)",
      color: "var(--gray-10)",
    }
  };

  return (
    <Flex 
      align="center" 
      justify="center"
      style={{
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: styles[variant].backgroundColor,
        color: styles[variant].color,
        padding: '2px 8px',
        borderRadius: '4px',
        minWidth: '28px'
      }}
    >
      {shortcut}
    </Flex>
  );
} 