'use client';

import useSWR from 'swr';
import { useEffect, useRef } from 'react';
import { InvitationService } from '@/services';
import useCurrentUser from '@/hooks/useCurrentUser';
import { subscribeToTableEvents } from '@/utils/supabaseRealtime';
import useSupabase from '@/hooks/useSupabase';

/**
 * Hook for fetching and managing user invitations
 * Uses SWR for data fetching with caching and revalidation
 */
export default function useInvitations() {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const { supabase, isLoading: isSupabaseLoading, error: supabaseError, services } = useSupabase();
  const { invitationService } = services;
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
  
  // Fetch invitations using SWR
  const { 
    data: invitations, 
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    userId ? ['invitations', userId] : null,
    async () => {
      if (!userId || !invitationService) {
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
    if (!userId || !supabase || isSupabaseLoading || supabaseError) return;
    
    // Subscribe to the friendly_invitation table for this user's invitations
    // We need both sent and received, so we'll use subscribeToTableEvents
    unsubscribeRef.current = subscribeToTableEvents(
      `invitations_${userId}`, // channelName - unique identifier for this subscription
      'friendly_invitation', // table name
      {
        // Define handlers for different event types
        INSERT: () => mutate(),
        UPDATE: () => mutate(),
        DELETE: () => mutate(),
      },
      // Filter for invitations where this user is sender or receiver
      {
        filter: `or(sender_id.eq.${userId},receiver_id.eq.${userId})`,
      },
      supabase
    );
    
    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userId, mutate, supabase, isSupabaseLoading, supabaseError]);

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