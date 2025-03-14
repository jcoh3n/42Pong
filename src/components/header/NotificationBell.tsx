"use client";

import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import { BellIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useCallback } from "react";
import useNotifications from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@/services";

interface NotificationBellProps {
  maxNotifications?: number;
}

export function NotificationBell({ maxNotifications = 5 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unseenCount, 
    isLoading, 
    error, 
    formatRelativeTime,
    markAsSeen,
    markAllAsSeen 
  } = useNotifications({ 
    pageSize: maxNotifications,
    enableRealtime: true
  });

  // Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.seen) {
      markAsSeen(notification.id);
    }
    
    // Additional handling based on notification type
    if (notification.type === 'invitation' && notification.invitation_id) {
      // Handle invitation click - could navigate to game or show accept dialog
      console.log('Invitation clicked:', notification.invitation_id);
    } else if (notification.type === 'message') {
      // Handle message click
      console.log('Message notification clicked');
    } else if (notification.type === 'announcement') {
      // Handle announcement click
      console.log('Announcement clicked');
    }
  }, [markAsSeen]);

  // Handle "Mark all as read" button click
  const handleMarkAllAsRead = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click handlers
    markAllAsSeen();
  }, [markAllAsSeen]);

  // Auto-mark notifications as seen when popover opens
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      // Optional: Automatically mark notifications as seen when viewed
      // Uncomment if you want this behavior
      // const unseenNotifications = notifications.filter(n => !n.seen);
      // unseenNotifications.forEach(n => markAsSeen(n.id));
    }
  }, [isOpen, notifications]);

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
          {unseenCount > 0 && (
            <Box
              className="
                absolute -top-1 -right-1 w-5 h-5
                bg-blue-500 rounded-full flex items-center justify-center
                text-[10px] font-bold text-white
                ring-2 ring-background
              "
            >
              {unseenCount}
            </Box>
          )}
        </Box>
      </Popover.Trigger>
      
      <Popover.Content>
        <Box className="w-80 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-gray-800 shadow-xl">
          <Box p="3">
            <Flex justify="between" align="center" mb="3">
              <Text weight="medium" size="3">Notifications</Text>
              {unseenCount > 0 && (
                <Text 
                  size="1" 
                  className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors duration-200"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Text>
              )}
            </Flex>
            
            <Flex direction="column" gap="2">
              {isLoading ? (
                // Loading state
                <Box className="py-8 text-center">
                  <Text size="1" className="text-gray-400">Loading notifications...</Text>
                </Box>
              ) : error ? (
                // Error state
                <Box className="py-8 text-center">
                  <Text size="1" className="text-gray-400">Failed to load notifications</Text>
                </Box>
              ) : notifications.length === 0 ? (
                // Empty state
                <Box className="py-8 text-center">
                  <Text size="1" className="text-gray-400">No notifications</Text>
                </Box>
              ) : (
                // Render notifications
                notifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id}
                    notification={notification}
                    formattedTime={formatRelativeTime(notification.created_at)}
                    onClick={handleNotificationClick}
                  />
                ))
              )}
            </Flex>
            
            {notifications.length > 0 && (
              <Box mt="3" style={{ textAlign: 'center' }}>
                <Text 
                  size="1" 
                  className="text-gray-400 hover:text-gray-200 cursor-pointer transition-colors duration-200"
                >
                  View all notifications
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
} 