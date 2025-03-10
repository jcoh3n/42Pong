"use client";

import { 
  Avatar, 
  Box, 
  DropdownMenu, 
  Flex, 
  Text,
  Separator
} from "@radix-ui/themes";
import { 
  PersonIcon, 
  GearIcon, 
  ExitIcon,
  QuestionMarkCircledIcon
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { type User } from "@/services/types";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    // Handle sign out logic here
    console.log("Signing out...");
    // router.push("/auth/signin");
  };

  const userInitials = user.login.substring(0, 2).toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Box style={{ cursor: 'pointer' }}>
          <Avatar
            src={user.avatar_url}
            fallback={userInitials}
            size="2"
            radius="full"
            style={{ 
              cursor: 'pointer',
              border: '2px solid var(--gray-5)'
            }}
          />
        </Box>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Content align="end" style={{ width: '240px' }}>
        <Box p="3">
          <Flex align="center" gap="3">
            <Avatar
              src={user.avatar_url}
              fallback={userInitials}
              size="3"
              radius="full"
            />
            <Box>
              <Text weight="medium" size="2">{user.login}</Text>
              <Text size="1" color="gray">ELO: {user.elo_score}</Text>
            </Box>
          </Flex>
        </Box>
        
        <Separator size="4" />
        
        <DropdownMenu.Item onSelect={() => router.push("/profile")}>
          <Flex gap="2" align="center">
            <PersonIcon />
            <Text>My Profile</Text>
          </Flex>
        </DropdownMenu.Item>
        
        <DropdownMenu.Item onSelect={() => router.push("/settings")}>
          <Flex gap="2" align="center">
            <GearIcon />
            <Text>Settings</Text>
          </Flex>
        </DropdownMenu.Item>
        
        <DropdownMenu.Item onSelect={() => router.push("/help")}>
          <Flex gap="2" align="center">
            <QuestionMarkCircledIcon />
            <Text>Help & Support</Text>
          </Flex>
        </DropdownMenu.Item>
        
        <Separator size="4" />
        
        <DropdownMenu.Item color="red" onSelect={handleSignOut}>
          <Flex gap="2" align="center">
            <ExitIcon />
            <Text>Sign Out</Text>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}