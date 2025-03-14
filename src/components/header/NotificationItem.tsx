import React, { useEffect, useState } from 'react';
import { Avatar, Box, Flex, Text, Badge, Button } from '@radix-ui/themes';
import { Notification } from '@/services';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
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
    <Flex 
      p="2" 
      gap="3"
      className={`
		min-h-22
        rounded-lg cursor-pointer transition-all duration-200
        shadow-xl bg-gray-900/95
		border-neutral-800
		border-2
		${notification.seen 
          ? isHovering ? 'bg-gray-800/50' : 'hover:bg-gray-800/50' 
          : isHovering ? 'bg-gray-800/50' : 'bg-gray-800/30 hover:bg-gray-800/50'
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      position="relative"
    >
      <Icon className='rounded-full mt-1' />
	<Box style={{ flex: 1, flexDirection: 'column' }}>
        <Flex gap="1" align="center" justify="between">
          <Flex gap="1" align="center">
            <Text 
              weight={notification.seen ? "regular" : "medium"} 
              size="2" 
              className={notification.seen ? "text-gray-300" : "text-white"}
            >
              {notification.title}
            </Text>
            {!notification.seen && (
              <Badge size="1" color="blue" variant="solid" radius="full" />
            )}
          </Flex>
        </Flex>
        <Text 
          size="1" 
          className={`text-gray-400 ${notification.seen ? '' : 'font-medium'}`}
        >
          {notification.content}
        </Text>
        
        <Flex justify="between" align="center" className=''>
          <Text size="1" className="text-gray-500 mt-1">{formattedTime}</Text>
        </Flex>
      </Box>

      {/* Action buttons for pending invitation notifications */}
      {isInvitation && invitationStatus === 'pending' && (
        <Flex 
          position="absolute" 
          bottom="2" 
          right="2"
          gap="2"
          className="animate-fadeIn"
        >
          <Button 
            size="1" 
            color="green" 
            variant="soft" 
            onClick={handleAccept}
            className={`transition-all ${isAccepting || isRefusing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
            disabled={isAccepting || isRefusing}
          >
            <Flex gap="1" align="center">
              {isAccepting ? (
                <FaSpinner size={12} className="animate-spin" />
              ) : (
                <FaCheck size={12} />
              )}
              <span>{isAccepting ? 'Accepting...' : 'Accept'}</span>
            </Flex>
          </Button>
          <Button 
            size="1" 
            color="red" 
            variant="soft" 
            onClick={handleRefuse}
            className={`transition-all ${isAccepting || isRefusing ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
            disabled={isAccepting || isRefusing}
          >
            <Flex gap="1" align="center">
              {isRefusing ? (
                <FaSpinner size={12} className="animate-spin" />
              ) : (
                <FaTimes size={12} />
              )}
              <span>{isRefusing ? 'Refusing...' : 'Refuse'}</span>
            </Flex>
          </Button>
        </Flex>
      )}

	  {isInvitation && invitationStatus !== 'pending' && (
		<Text 
		  size="1" 
		  className="text-gray-500 italic mt-2"
		>
		  {invitationStatus}
		</Text>
	  )}
    </Flex>
  );
} 