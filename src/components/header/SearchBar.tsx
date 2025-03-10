"use client";

import { useState } from "react";
import { Flex, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
    // Implement search functionality here
  };

  return (
    <form onSubmit={handleSearch} style={{ width: '100%' }}>
      <TextField.Root 
        size="3"
        style={{
          width: '100%',
          backgroundColor: 'var(--gray-3)',
          border: 'none',
          borderRadius: '8px'
        }}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height={16} width={16} />
        </TextField.Slot>
        <TextField.Input 
          placeholder="Search item"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            backgroundColor: 'transparent',
            '&::placeholder': {
              color: 'var(--gray-9)'
            }
          }}
        />
        {searchValue && (
          <TextField.Slot pr="2">
            <Flex 
              align="center" 
              justify="center"
              style={{
                fontSize: '12px',
                color: 'var(--gray-10)',
                backgroundColor: 'var(--gray-5)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              ⌘ K
            </Flex>
          </TextField.Slot>
        )}
      </TextField.Root>
    </form>
  );
} 