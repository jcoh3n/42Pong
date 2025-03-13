"use client";

import { Box, Flex, Popover, Text, Avatar, Badge } from "@radix-ui/themes";
import { BellIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface NotificationBellProps {
  count?: number;
}

export function NotificationBell({ count = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock notifications for demonstration
  const notifications = [
    {
      id: 1,
      title: "New friend request",
      message: "John Doe wants to add you as a friend",
      time: "5 minutes ago",
      read: false,
      user: {
        name: "John Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
      }
    },
    {
      id: 2,
      title: "Game invitation",
      message: "You've been invited to play a game",
      time: "1 hour ago",
      read: true,
      user: {
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
      }
    }
  ];

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Box 
          className="
            relative cursor-pointer p-2 rounded-full
            hover:bg-gray-800/30 transition-all duration-200
            active:scale-95
          "
        >
          <BellIcon 
            height={24} 
            width={24}
            className="text-gray-400 transition-colors duration-200 group-hover:text-gray-200" 
          />
          {count > 0 && (
            <Box
              className="
                absolute -top-1 -right-1 w-5 h-5
                bg-blue-500 rounded-full flex items-center justify-center
                text-[10px] font-bold text-white
                ring-2 ring-background
              "
            >
              {count}
            </Box>
          )}
        </Box>
      </Popover.Trigger>
      
      <Popover.Content>
        <Box className="w-80 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-gray-800 shadow-xl">
          <Box p="3">
            <Flex justify="between" align="center" mb="3">
              <Text weight="medium" size="3">Notifications</Text>
              <Text 
                size="1" 
                className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                Mark all as read
              </Text>
            </Flex>
            
            <Flex direction="column" gap="2">
              {notifications.map((notification) => (
                <Flex 
                  key={notification.id} 
                  p="2" 
                  gap="3"
                  className={`
                    rounded-lg cursor-pointer transition-all duration-200
                    ${notification.read ? 'hover:bg-gray-800/50' : 'bg-gray-800/30 hover:bg-gray-800/50'}
                  `}
                >
                  <Avatar 
                    src={notification.user.avatar} 
                    fallback={notification.user.name.substring(0, 2)} 
                    size="2"
                    radius="full"
                    className="ring-2 ring-gray-700/50"
                  />
                  <Box>
                    <Flex gap="1" align="center">
                      <Text weight="medium" size="2">{notification.title}</Text>
                      {!notification.read && (
                        <Badge size="1" color="blue" variant="solid" radius="full" />
                      )}
                    </Flex>
                    <Text size="1" className="text-gray-400">{notification.message}</Text>
                    <Text size="1" className="text-gray-500">{notification.time}</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
            
            <Box mt="3" style={{ textAlign: 'center' }}>
              <Text 
                size="1" 
                className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors duration-200"
              >
                View all notifications
              </Text>
            </Box>
          </Box>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
} 