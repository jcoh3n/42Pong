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
        // Close the popover after successful acceptance (optional)
        setIsOpen(false);
      } else {
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

  // Format count for display
  const formatCount = (count: number) => {
    if (count > 99) return '99+';
    return count.toString();
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Box 
          className="
            relative cursor-pointer p-2.5 rounded-xl
            hover:bg-gray-800/40 transition-all duration-200
            active:scale-95 group
            border border-transparent hover:border-gray-700/50
          "
        >
          <BellIcon 
            height={20} 
            width={20}
            className="text-gray-400 transition-colors duration-200 group-hover:text-gray-200" 
          />
          {unseenCount > 0 && (
            <Box
              className="
                absolute -top-1 -right-1 
                min-w-[18px] h-[18px] px-1
                notification-badge
                rounded-full flex items-center justify-center
                text-[10px] font-bold text-white
                animate-notification-pulse
              "
            >
              {formatCount(unseenCount)}
            </Box>
          )}
        </Box>
      </Popover.Trigger>
      
      <Popover.Content 
        className="
          w-[320px] sm:w-[380px] 
          max-h-[500px] overflow-hidden
          border border-gray-800/50
          shadow-2xl
        "
        sideOffset={8}
      >
        <Box className="bg-gray-900/95 backdrop-blur-sm rounded-xl notification-item">
          {/* Header */}
          <Box 
            p="4" 
            className="
              border-b border-gray-800/50
              bg-gradient-to-r from-gray-900/50 to-gray-800/30
            "
          >
            <Flex justify="between" align="center">
              <Text weight="medium" size="3" className="text-gray-100">
                Notifications
              </Text>
              {unseenCount > 0 && (
                <Text size="1" className="text-gray-400">
                  {unseenCount} new
                </Text>
              )}
            </Flex>
          </Box>

          {/* Content */}
          <Box className="max-h-[400px] overflow-y-auto">
            <Box p="3">
              <Flex direction="column" gap="2">
                {isLoading ? (
                  // Loading state
                  <Box className="py-12 text-center">
                    <Loading />
                    <Text size="2" className="text-gray-400 mt-2">Loading notifications...</Text>
                  </Box>
                ) : error ? (
                  // Error state
                  <Box className="py-12 text-center">
                    <Text size="2" className="text-gray-400">Failed to load notifications</Text>
                  </Box>
                ) : notifications.length === 0 ? (
                  // Empty state
                  <Box className="py-12 text-center">
                    <Box className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800/50 flex items-center justify-center">
                      <BellIcon width={20} height={20} className="text-gray-500" />
                    </Box>
                    <Text size="2" className="text-gray-400">No notifications</Text>
                    <Text size="1" className="text-gray-500 mt-1">You're all caught up!</Text>
                  </Box>
                ) : (
                  // Render notifications
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
            </Box>
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Box 
              p="3" 
              className="
                border-t border-gray-800/50
                bg-gradient-to-r from-gray-900/30 to-gray-800/20
              "
            >
              <Flex justify="between" align="center">
                <Text 
                  size="2" 
                  className="
                    text-blue-400 hover:text-blue-300 
                    cursor-pointer transition-colors duration-200
                    font-medium
                  "
                  onClick={() => {
                    // Navigate to full notifications page
                    console.log('Navigate to notifications page');
                  }}
                >
                  View all
                </Text>
                {unseenCount > 0 && (
                  <Text 
                    size="2" 
                    className="
                      text-gray-400 hover:text-gray-300 
                      cursor-pointer transition-colors duration-200
                    "
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </Text>
                )}
              </Flex>
            </Box>
          )}
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
} 