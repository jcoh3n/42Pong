import React, { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Text, Badge, Button } from '@radix-ui/themes';
import { Notification } from '@/services';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Component as LumaSpin } from "@/components/ui/luma-spin";
import { InvitationStatus, isInvitationNotification, InvitationNotification } from '@/hooks/useInvitationNotifications';
import { 
  getNotificationIcon, 
  getNotificationFallback,
  getNotificationStatusBadge,
  supportsAction
} from '@/utils/notificationRegistry';

interface NotificationItemProps {
  notification: Notification;
  formattedTime: string;
  onClick?: (notification: Notification) => void;
  onAccept?: (notification: Notification) => void;
  onRefuse?: (notification: Notification) => void;
  isAccepting?: boolean;
  isRefusing?: boolean;
  getInvitationStatus?: (notification: Notification) => Promise<InvitationStatus | null>;
}

export function NotificationItem({ 
  notification, 
  formattedTime, 
  onClick, 
  onAccept, 
  onRefuse,
  isAccepting = false,
  isRefusing = false,
  getInvitationStatus
}: NotificationItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const isInvitation = isInvitationNotification(notification);

  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus | null>(null);

  useEffect(() => {
    if (isInvitation && getInvitationStatus) {
      const fetchInvitationStatus = async () => {
        const status = await getInvitationStatus(notification);
        setInvitationStatus(status || null);
      };
      fetchInvitationStatus();
    }
  }, [isInvitation, getInvitationStatus, notification]);

  // Get icon and avatar fallback from registry
  const Icon = getNotificationIcon(notification);
  const fallback = getNotificationFallback(notification);
  
  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };

  const handleAccept = (e: React.MouseEvent) => {
	e.stopPropagation(); // Prevent triggering the parent onClick
	
	if (!isInvitation) return;
    if (onAccept && !isAccepting && !isRefusing) {
      onAccept(notification);
    }
  };

  const handleRefuse = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick

	if (!isInvitation) return;
    if (onRefuse && !isAccepting && !isRefusing) {
      onRefuse(notification);
    }
  };

  // Get status message for non-pending invitations
  const getStatusMessage = () => {
    if (!isInvitation || !invitationStatus || invitationStatus === 'pending') return null;
    
    switch (invitationStatus) {
      case 'accepted':
        return 'You have accepted this game invitation';
      case 'refused':
        return 'You have refused this game invitation';
      case 'cancelled':
        return 'This game invitation was cancelled';
      default:
        return `Invitation status: ${invitationStatus}`;
    }
  };
  
  const statusMessage = getStatusMessage();
  
  return (
    <Box 
      className={`
        relative p-3 rounded-lg cursor-pointer 
        transition-all duration-200 ease-out
        border border-transparent notification-item
        ${notification.seen 
          ? 'bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-700/50' 
          : 'bg-gray-800/50 hover:bg-gray-800/70 border-blue-500/20 hover:border-blue-500/40'
        }
        ${isHovering ? 'scale-[1.02]' : 'scale-100'}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Flex gap="3" align="start">
        {/* Icon */}
        <Box className="flex-shrink-0">
          <Box 
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${notification.seen 
                ? 'bg-gray-700/50 text-gray-400' 
                : 'bg-blue-500/20 text-blue-400'
              }
              transition-all duration-200
            `}
          >
            <Icon size={16} />
          </Box>
        </Box>

        {/* Content */}
        <Box className="flex-1 min-w-0">
          <Flex direction="column" gap="1">
            {/* Title and badge */}
            <Flex align="center" gap="2" justify="between">
              <Text 
                weight={notification.seen ? "regular" : "medium"} 
                size="2" 
                className={`
                  ${notification.seen ? "text-gray-300" : "text-white"}
                  truncate
                `}
              >
                {notification.title}
              </Text>
              {!notification.seen && (
                <Badge 
                  size="1" 
                  color="blue" 
                  variant="solid" 
                  radius="full"
                  className="flex-shrink-0"
                />
              )}
            </Flex>

            {/* Message */}
            <Text 
              size="1" 
              className={`
                text-gray-400 line-clamp-2
                ${!notification.seen ? 'font-medium' : ''}
              `}
            >
              {notification.content}
            </Text>

            {/* Time and status */}
            <Flex justify="between" align="center" className="mt-1">
              <Text size="1" className="text-gray-500">
                {formattedTime}
              </Text>
              {statusMessage && (
                <Text size="1" className="text-gray-500 italic">
                  {statusMessage}
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>

      {/* Action buttons for pending invitation notifications */}
      {isInvitation && invitationStatus === 'pending' && (
        <Flex 
          gap="2" 
          className="mt-3 pt-3 border-t border-gray-700/30"
        >
          <Button 
            size="1" 
            color="green" 
            variant="soft" 
            onClick={handleAccept}
            className={`
              flex-1 transition-all duration-200
              ${isAccepting || isRefusing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}
            `}
            disabled={isAccepting || isRefusing}
          >
            <Flex gap="1" align="center" justify="center">
              {isAccepting ? (
                <Box style={{ transform: 'scale(0.4)' }}>
                  <LumaSpin />
                </Box>
              ) : (
                <FaCheck size={10} />
              )}
              <span className="text-xs">
                {isAccepting ? 'Accepting...' : 'Accept'}
              </span>
            </Flex>
          </Button>
          <Button 
            size="1" 
            color="red" 
            variant="soft" 
            onClick={handleRefuse}
            className={`
              flex-1 transition-all duration-200
              ${isAccepting || isRefusing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}
            `}
            disabled={isAccepting || isRefusing}
          >
            <Flex gap="1" align="center" justify="center">
              {isRefusing ? (
                <Box style={{ transform: 'scale(0.4)' }}>
                  <LumaSpin />
                </Box>
              ) : (
                <FaTimes size={10} />
              )}
              <span className="text-xs">
                {isRefusing ? 'Refusing...' : 'Refuse'}
              </span>
            </Flex>
          </Button>
        </Flex>
      )}
    </Box>
  );
} 