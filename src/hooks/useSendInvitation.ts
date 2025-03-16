'use client';

import { useState, useCallback } from 'react';
import { invitationService } from '@/services';
import useCurrentUser from '@/hooks/useCurrentUser';
import useInvitations from './useInvitations';

export type PointsToWin = '5' | '7' | '11';
export type InvitationError = 'not-authenticated' | 'user-not-found' | 'self-invitation' | 'server-error' | null;

/**
 * Hook for sending invitations to other users
 * Provides loading state and error handling
 */
export default function useSendInvitation() {
  // Get current user information
  const { data: currentUser } = useCurrentUser();
  
  // Get invitations hook to refresh after sending
  const { mutate: refreshInvitations } = useInvitations();
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<InvitationError>(null);
  
  /**
   * Send an invitation to another user
   * 
   * @param receiverId ID of the user to invite
   * @param pointsToWin Points required to win the game (5, 7, or 11)
   * @returns The created invitation if successful, null otherwise
   */
  const sendInvitation = useCallback(async (receiverId: string, pointsToWin: PointsToWin = '7') => {
    // Reset error state
    setError(null);
    
    // Check if user is authenticated
    if (!currentUser?.id) {
      setError('not-authenticated');
      return null;
    }
    
    // Prevent inviting self
    if (receiverId === currentUser.id) {
      setError('self-invitation');
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Create the invitation
      const invitation = await invitationService.createFriendlyInvitation(
        currentUser.id,
        receiverId,
        pointsToWin
      );
      
      // Refresh invitations list to include the new one
      refreshInvitations();
      
      return invitation;
    } catch (err: any) {
      console.error('Error creating invitation:', err);
      
      // Handle specific error types
      if (err.message?.includes('not found')) {
        setError('user-not-found');
      } else {
        setError('server-error');
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, refreshInvitations]);
  
  return {
    sendInvitation,
    isLoading,
    error
  };
} 