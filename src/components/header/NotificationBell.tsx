"use client";

import { Box, Flex, Popover, Text } from "@radix-ui/themes";
import { BellIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useCallback, Suspense } from "react";
import useNotifications from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Notification } from "@/services";
import toast from "react-hot-toast";
import Loading from "../Loading";

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
    markAllAsSeen,
    acceptInvitation,
    refuseInvitation,
    isPendingInvitation,
    getInvitationStatus,
    isAcceptingInvitation,
    isRefusingInvitation
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

  // Handle accepting an invitation
  const handleAcceptInvitation = useCallback(async (notification: Notification) => {
	if (notification.type !== 'invitation') return ;
    console.log('Accepting invitation:', notification.id);
    
    try {
      const success = await acceptInvitation(notification);
      
      if (success) {
        // Show success message
        toast.success('Invitation accepted successfully!');
        console.log('Invitation accepted successfully');
        
        // Close the popover after successful acceptance (optional)
        setIsOpen(false);
      } else {
        // Show error message
        toast.error('Failed to accept invitation');
        console.error('Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      // Show error message
      toast.error('An error occurred while accepting invitation');
    }
  }, [acceptInvitation, setIsOpen]);

  // Handle refusing an invitation
  const handleRefuseInvitation = useCallback(async (notification: Notification) => {
	if (notification.type !== 'invitation') return ;
    console.log('Refusing invitation:', notification.id);

    try {
      const success = await refuseInvitation(notification);
      
      if (success) {
        // Show success message
        toast.success('Invitation refused');
        console.log('Invitation refused successfully');
      } else {
        // Show error message
        toast.error('Failed to refuse invitation');
        console.error('Failed to refuse invitation');
      }
    } catch (error) {
      console.error('Error refusing invitation:', error);
      // Show error message
      toast.error('An error occurred while refusing invitation');
    }
  }, [refuseInvitation]);

  // Handle "Mark all as read" button click
  const handleMarkAllAsRead = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click handlers
    markAllAsSeen();
  }, [markAllAsSeen]);

  // Optional: Auto-mark notifications as seen when popover opens
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      const unseenNotifications = notifications.filter(n => !n.seen);
      unseenNotifications.forEach(n => markAsSeen(n.id));
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
        <Box className="w-80 rounded-xl bg-gray-900/95 shadow-xl">
          <Box p="3">
            <Flex justify="between" align="center" mb="3">
              <Text weight="medium" size="3">Notifications</Text>
            </Flex>

            <Flex direction="column" gap="3">
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
                // Render a maximum of 3 notifications
                <Suspense fallback={<Box className="py-8 text-center"><Loading /></Box>}>
                  {notifications.slice(0, 3).map((notification) => (
                    <NotificationItem 
                      key={notification.id}
                      notification={notification}
                      formattedTime={formatRelativeTime(notification.created_at)}
                      onClick={handleNotificationClick}
                      onAccept={handleAcceptInvitation}
                      onRefuse={handleRefuseInvitation}
                      isAccepting={isAcceptingInvitation(notification.id)}
                      isRefusing={isRefusingInvitation(notification.id)}
                      getInvitationStatus={getInvitationStatus}
                    />
                  ))}
                </Suspense>
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