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
        <Box style={{ position: 'relative', cursor: 'pointer' }}>
          <BellIcon height={24} width={24} />
          {count > 0 && (
            <Box
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: '16px',
                height: '16px',
                backgroundColor: 'var(--accent-9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {count}
            </Box>
          )}
        </Box>
      </Popover.Trigger>
      
      <Popover.Content style={{ width: '320px' }}>
        <Box p="3">
          <Flex justify="between" align="center" mb="3">
            <Text weight="medium" size="3">Notifications</Text>
            <Text size="1" color="gray" style={{ cursor: 'pointer' }}>
              Mark all as read
            </Text>
          </Flex>
          
          <Flex direction="column" gap="2">
            {notifications.map((notification) => (
              <Flex 
                key={notification.id} 
                p="2" 
                gap="3"
                style={{
                  borderRadius: '6px',
                  backgroundColor: notification.read ? 'transparent' : 'var(--accent-2)',
                  cursor: 'pointer'
                }}
              >
                <Avatar 
                  src={notification.user.avatar} 
                  fallback={notification.user.name.substring(0, 2)} 
                  size="2"
                  radius="full"
                />
                <Box>
                  <Flex gap="1" align="center">
                    <Text weight="medium" size="2">{notification.title}</Text>
                    {!notification.read && (
                      <Badge size="1" color="blue" variant="solid" radius="full" />
                    )}
                  </Flex>
                  <Text size="1" color="gray">{notification.message}</Text>
                  <Text size="1" color="gray">{notification.time}</Text>
                </Box>
              </Flex>
            ))}
          </Flex>
          
          <Box mt="3" style={{ textAlign: 'center' }}>
            <Text size="1" color="gray" style={{ cursor: 'pointer' }}>
              View all notifications
            </Text>
          </Box>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
} 