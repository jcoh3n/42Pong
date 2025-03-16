'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { invitationService } from '@/services';
import { subscribeToTable } from '@/utils/supabaseRealtime';

/**
 * Hook for fetching and managing a single invitation by ID
 * Uses SWR for data fetching with caching and revalidation
 * 
 * @param invitationId The ID of the invitation to fetch
 */
export default function useInvitation(invitationId: string | null | undefined) {
  // Don't fetch if no ID is provided
  const shouldFetch = !!invitationId;
  
  // Fetch invitation data using SWR
  const { 
    data: invitation, 
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    shouldFetch ? ['invitation', invitationId] : null,
    async () => {
      if (!invitationId) {
        return null;
      }
      return await invitationService.getInvitationById(invitationId);
    },
    {
      refreshInterval: 5000, // Refresh data every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // Set up real-time subscription to get updates when the invitation changes
  useEffect(() => {
    if (!invitationId) return;
    
    // Subscribe to the friendly_invitation table for changes to this invitation
    const unsubscribe = subscribeToTable(
      `invitation_${invitationId}`, // channelName - unique identifier for this subscription
      'friendly_invitation', // table name
      '*', // listen to all events
      (payload) => {
        // Handle all changes with mutate
        mutate();
      },
      {
        // Filter to only get events for this specific invitation
        filter: `id=eq.${invitationId}`
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [invitationId, mutate]);

  // Helper functions to check invitation status
  const isPending = invitation?.status === 'pending';
  const isAccepted = invitation?.status === 'accepted';
  const isRefused = invitation?.status === 'refused';
  const isCancelled = invitation?.status === 'cancelled';
  
  // Helper functions to check user roles
  const isSender = (userId: string) => invitation?.sender_id === userId;
  const isReceiver = (userId: string) => invitation?.receiver_id === userId;

  // Function to accept the invitation
  const acceptInvitation = async () => {
    if (!invitationId) return false;
    
    try {
      const updatedInvitation = await invitationService.updateInvitationStatus(invitationId, 'accepted');
      mutate(updatedInvitation);
      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return false;
    }
  };

  // Function to refuse the invitation
  const refuseInvitation = async () => {
    if (!invitationId) return false;
    
    try {
      const updatedInvitation = await invitationService.updateInvitationStatus(invitationId, 'refused');
      mutate(updatedInvitation);
      return true;
    } catch (error) {
      console.error('Error refusing invitation:', error);
      return false;
    }
  };

  // Function to cancel the invitation
  const cancelInvitation = async () => {
    if (!invitationId) return false;
    
    try {
      const updatedInvitation = await invitationService.updateInvitationStatus(invitationId, 'cancelled');
      mutate(updatedInvitation);
      return true;
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      return false;
    }
  };

  return {
    invitation,
    isLoading,
    error,
    mutate,
    // Status helpers
    isPending,
    isAccepted,
    isRefused,
    isCancelled,
    // User role helpers
    isSender,
    isReceiver,
    // Actions
    acceptInvitation,
    refuseInvitation,
    cancelInvitation
  };
} 