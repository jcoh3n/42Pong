"use client";

import { useState, useRef, useEffect } from "react";
import { Flex } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { KeyboardShortcut } from "./KeyboardShortcut";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search item" 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut to focus the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Flex 
        align="center" 
        justify="between"
        style={{
          backgroundColor: 'var(--gray-3)',
          borderRadius: '100px',
          padding: '8px 16px',
          width: '100%',
          border: isFocused ? '1px solid var(--gray-7)' : '1px solid transparent',
          transition: 'border-color 0.15s ease',
        }}
      >
        <Flex align="center" gap="2" style={{ flexGrow: 1 }}>
          <MagnifyingGlassIcon 
            color="var(--gray-9)" 
            width={16} 
            height={16}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: 'var(--gray-12)',
              width: '100%',
              padding: '0',
            }}
          />
        </Flex>
        
        <KeyboardShortcut shortcut="⌘K" />
      </Flex>
    </form>
  );
} 