import React, { useState } from 'react';
import { Avatar, Box, Flex, Text, Badge } from '@radix-ui/themes';
import { Notification } from '@/services';
import { GoBellFill } from 'react-icons/go';
import { FaGamepad, FaEnvelope, FaBullhorn } from 'react-icons/fa';

interface NotificationItemProps {
  notification: Notification;
  formattedTime: string;
  onClick?: (notification: Notification) => void;
}

export function NotificationItem({ notification, formattedTime, onClick }: NotificationItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  // Generate avatar and icon based on notification type
  const getAvatarInfo = () => {
    // Default avatar fallback uses first two letters of the title
    let fallback = notification.title.substring(0, 2);
    let src = undefined;
    let icon = <GoBellFill size={14} />;
    
    if (notification.type === 'invitation') {
      // For game invitations
      fallback = 'GI';
      icon = <FaGamepad size={14} />;
    } else if (notification.type === 'message') {
      // For messages
      fallback = 'MS';
      icon = <FaEnvelope size={14} />;
    } else if (notification.type === 'announcement') {
      // For announcements
      fallback = 'AN';
      icon = <FaBullhorn size={14} />;
    }

    return { src, fallback, icon };
  };

  const { src, fallback, icon } = getAvatarInfo();
  
  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
  };
  
  return (
    <Flex 
      p="2" 
      gap="3"
      className={`
        rounded-lg cursor-pointer transition-all duration-200
        ${notification.seen 
          ? isHovering ? 'bg-gray-800/50' : 'hover:bg-gray-800/50' 
          : isHovering ? 'bg-gray-800/50' : 'bg-gray-800/30 hover:bg-gray-800/50'
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar 
        src={src} 
        fallback={fallback} 
        size="2"
        radius="full"
        className={`
          ring-2 transition-all duration-200
          ${notification.seen 
            ? 'ring-gray-700/50' 
            : isHovering ? 'ring-blue-500/70' : 'ring-blue-500/50'
          }
        `}
      />
      <Box style={{ flex: 1 }}>
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
          <Box className="text-gray-400">
            {icon}
          </Box>
        </Flex>
        <Text 
          size="1" 
          className={`text-gray-400 ${notification.seen ? '' : 'font-medium'}`}
        >
          {notification.content}
        </Text>
        <Text size="1" className="text-gray-500 mt-1">{formattedTime}</Text>
      </Box>
    </Flex>
  );
} 