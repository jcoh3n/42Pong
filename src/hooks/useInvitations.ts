'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { invitationService } from '@/services';
import useCurrentUser from '@/hooks/useCurrentUser';
import { subscribeToUserTable } from '@/utils/supabaseRealtime';

/**
 * Hook for fetching and managing user invitations
 * Uses SWR for data fetching with caching and revalidation
 */
export default function useInvitations() {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  
  // Fetch invitations using SWR
  const { 
    data: invitations, 
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    userId ? ['invitations', userId] : null,
    async () => {
      if (!userId) {
        return [];
      }
      return await invitationService.getFriendlyInvitations(userId);
    },
    {
      refreshInterval: 10000, // Refresh data every 10 seconds
      revalidateOnFocus: true, // Refresh when window is focused
      revalidateOnReconnect: true, // Refresh when reconnecting
    }
  );

  // Set up real-time subscription to get updates when invitations change
  useEffect(() => {
    if (!userId) return;
    
    // Subscribe to the friendly_invitation table for this user
    const unsubscribe = subscribeToUserTable({
      tableName: 'friendly_invitation',
      userId,
      onInsert: () => mutate(),
      onUpdate: () => mutate(),
      onDelete: () => mutate(),
    });
    
    return () => {
      unsubscribe();
    };
  }, [userId, mutate]);

  // Get only pending invitations
  const pendingInvitations = invitations?.filter(
    invitation => invitation.status === 'pending'
  ) || [];

  // Get only invitations received by the user
  const receivedInvitations = invitations?.filter(
    invitation => invitation.receiver_id === userId
  ) || [];

  // Get only invitations sent by the user
  const sentInvitations = invitations?.filter(
    invitation => invitation.sender_id === userId
  ) || [];

  // Get only pending invitations received by the user
  const pendingReceivedInvitations = invitations?.filter(
    invitation => invitation.receiver_id === userId && invitation.status === 'pending'
  ) || [];

  // Get only pending invitations sent by the user
  const pendingSentInvitations = invitations?.filter(
    invitation => invitation.sender_id === userId && invitation.status === 'pending'
  ) || [];

  return {
    invitations: invitations || [],
    pendingInvitations,
    receivedInvitations,
    sentInvitations,
    pendingReceivedInvitations,
    pendingSentInvitations,
    isLoading,
    error,
    mutate
  };
} 