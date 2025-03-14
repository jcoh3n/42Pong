'use client';

import { useCallback } from 'react';
import { Notification, invitationService } from '@/services';
import { useActionLoadingState } from './useActionLoadingState';

// Define possible invitation statuses
export type InvitationStatus = 'pending' | 'accepted' | 'refused' | 'cancelled';

// Extended notification type with invitation-specific properties
export interface InvitationNotification extends Notification {
  invitation_id: string;
  status?: InvitationStatus;
}

// Helper function to check if a notification is an invitation
export function isInvitationNotification(notification: Notification): notification is InvitationNotification {
  return notification.type === 'invitation' && !!notification.invitation_id;
}

// Props required for the hook
interface UseInvitationNotificationsProps {
  markAsSeen: (notificationId: string) => Promise<void>;
  mutate: () => void;
}

/**
 * Hook for handling invitation-specific notifications
 */
export default function useInvitationNotifications({
  markAsSeen,
  mutate
}: UseInvitationNotificationsProps) {
  // Use the action loading state hook
  const { 
    isLoading,
    isItemLoading,
    executeWithLoading
  } = useActionLoadingState();
  
  /**
   * Accept an invitation
   */
  const acceptInvitation = useCallback(async (notification: Notification): Promise<boolean> => {
    if (!isInvitationNotification(notification)) {
      console.warn('Cannot accept invitation: Not a valid invitation notification');
      return false;
    }
    
    try {
      return await executeWithLoading(
        notification.id,
        'accept',
        async () => {
          console.log('Accepting invitation:', notification.invitation_id);
          
          // Mark notification as seen first
          await markAsSeen(notification.id);
          
          // Call the invitationService to accept the invitation
          await invitationService.updateInvitationStatus(notification.invitation_id, 'accepted');
          
          // Refresh data from server to show the latest state
          mutate();
          
          return true;
        }
      );
    } catch (err) {
      console.error('Error accepting invitation:', err);
      return false;
    }
  }, [markAsSeen, mutate, executeWithLoading]);
  
  /**
   * Refuse an invitation
   */
  const refuseInvitation = useCallback(async (notification: Notification): Promise<boolean> => {
    if (!isInvitationNotification(notification)) {
      console.warn('Cannot refuse invitation: Not a valid invitation notification');
      return false;
    }
    
    try {
      return await executeWithLoading(
        notification.id,
        'refuse',
        async () => {
          console.log('Refusing invitation:', notification.invitation_id);
          
          // Mark notification as seen first
          await markAsSeen(notification.id);
          
          // Call the invitationService to refuse the invitation
          await invitationService.updateInvitationStatus(notification.invitation_id, 'refused');
          
          // Refresh data from server to show the latest state
          mutate();
          
          return true;
        }
      );
    } catch (err) {
      console.error('Error refusing invitation:', err);
      return false;
    }
  }, [markAsSeen, mutate, executeWithLoading]);

  /**
   * Get the current status of an invitation
   */
  const getInvitationStatus = useCallback(async (notification: Notification): Promise<InvitationStatus | null> => {
    if (!isInvitationNotification(notification)) {
      return null;
    }

    try {
      const invitation = await invitationService.getInvitationById(notification.invitation_id);
      console.log('Fetched invitation status:', invitation);
      return invitation.status as InvitationStatus;
    } catch (err) {
      console.warn('No invitation found for ID:', notification.invitation_id);
      return null;
    }
  }, []);

  /**
   * Check if an invitation is in 'pending' status
   */
  const isPendingInvitation = useCallback(async (notification: Notification): Promise<boolean> => {
    const status = await getInvitationStatus(notification);
    return isInvitationNotification(notification) && status === 'pending';
  }, [getInvitationStatus]);

  return {
    acceptInvitation,
    refuseInvitation,
    getInvitationStatus,
    isPendingInvitation,
    isInvitationNotification,
    isAcceptingInvitation: (notificationId: string) => isLoading(notificationId, 'accept'),
    isRefusingInvitation: (notificationId: string) => isLoading(notificationId, 'refuse'),
    isProcessingInvitation: (notificationId: string) => isItemLoading(notificationId)
  };
} 