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
        className={`
          relative bg-gray-800/30 rounded-xl px-3 py-1.5 w-full
          border border-gray-700/20 backdrop-blur-sm
          transition-all duration-200 group
          ${isFocused ? 'bg-gray-800/40 border-blue-500/30 shadow-lg shadow-blue-500/5' : 'hover:border-gray-600/30'}
        `}
      >
        <Flex align="center" gap="2" style={{ flexGrow: 1 }}>
          <MagnifyingGlassIcon 
            className={`
              transition-colors duration-200
              ${isFocused ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}
            `}
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
            className="
              bg-transparent border-none outline-none text-sm text-gray-100
              placeholder:text-gray-500 w-full p-0
              transition-colors duration-200
            "
          />
        </Flex>
        
        <KeyboardShortcut 
          shortcut="⌘K" 
          className={isFocused ? 'opacity-100' : 'opacity-60'} 
        />
      </Flex>
    </form>
  );
} 