import { FaGamepad, FaEnvelope, FaBullhorn } from 'react-icons/fa';
import { GoBellFill } from 'react-icons/go';
import { Notification } from '@/services';
import { InvitationStatus, isInvitationNotification } from '@/hooks/useInvitationNotifications';
import { Badge } from '@radix-ui/themes';
import React from 'react';

// Define the structure of notification configuration
export interface NotificationTypeConfig {
  icon: React.ComponentType<any>;
  fallback: string;
  availableActions: string[];
  getStatusBadge?: (status: string) => React.ReactNode;
}

// Registry of notification types
export const notificationTypes: Record<string, NotificationTypeConfig> = {
  invitation: {
    icon: FaGamepad,
    fallback: 'GI',
    availableActions: ['accept', 'refuse'],
    getStatusBadge: (status: string) => {
      switch (status) {
        case 'accepted':
          return React.createElement(Badge, { 
            color: "green", 
            variant: "solid", 
            radius: "full",
            className: "px-2 py-0" 
          }, "Accepted");
        case 'refused':
          return React.createElement(Badge, { 
            color: "red", 
            variant: "solid", 
            radius: "full",
            className: "px-2 py-0"
          }, "Refused");
        case 'cancelled':
          return React.createElement(Badge, { 
            color: "gray", 
            variant: "solid", 
            radius: "full",
            className: "px-2 py-0"
          }, "Cancelled");
        case 'pending':
          return React.createElement(Badge, { 
            color: "blue", 
            variant: "soft", 
            radius: "full",
            className: "px-2 py-0"
          }, "Pending");
        default:
          return null;
      }
    }
  },
  message: {
    icon: FaEnvelope,
    fallback: 'MS',
    availableActions: ['reply', 'delete']
  },
  announcement: {
    icon: FaBullhorn,
    fallback: 'AN',
    availableActions: ['dismiss']
  },
  default: {
    icon: GoBellFill,
    fallback: 'NT',
    availableActions: []
  }
};

/**
 * Get configuration for a specific notification type
 */
export function getNotificationConfig(notification: Notification): NotificationTypeConfig {
  return notificationTypes[notification.type] || notificationTypes.default;
}

/**
 * Get the appropriate icon for a notification
 */
export function getNotificationIcon(notification: Notification) {
  const config = getNotificationConfig(notification);
  return config.icon;
}

/**
 * Get the avatar fallback for a notification
 */
export function getNotificationFallback(notification: Notification): string {
  const config = getNotificationConfig(notification);
  return config.fallback;
}

/**
 * Get the status badge for a notification if applicable
 */
export function getNotificationStatusBadge(notification: Notification, status?: string): React.ReactNode {

  if (!isInvitationNotification(notification)) return null;

  const config = getNotificationConfig(notification);
  if (!config.getStatusBadge) {
    return null;
  }

  // For other notification types, only show badge if status is provided and not pending
  if (!status || status === 'pending') {
	return null;
  }

  // For invitation type, always show a badge with the current status
  if (notification.type === 'invitation') {
    return config.getStatusBadge(status || 'pending');
  }
  
  
  return config.getStatusBadge(status);
}

/**
 * Check if a notification supports a specific action
 */
export function supportsAction(notification: Notification, action: string): boolean {
  const config = getNotificationConfig(notification);
  return config.availableActions.includes(action);
} 