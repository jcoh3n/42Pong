'use client';

import useSWR from 'swr';
import { useCallback, useState, useEffect, useRef } from 'react';
import { notificationService, invitationService, Notification } from '@/services';
import { PaginatedResponse } from '@/services/types';
import useCurrentUser from '@/hooks/useCurrentUser';
import { subscribeToUserTable } from '@/utils/supabaseRealtime';
import useInvitationNotifications from './useInvitationNotifications';

type NotificationOptions = {
  page?: number;
  pageSize?: number;
  sortBy?: keyof Notification;
  sortOrder?: 'asc' | 'desc';
  onlyUnseen?: boolean;
  enableRealtime?: boolean;
};

export default function useNotifications(options: NotificationOptions = {}) {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
  const hasSetupRealtimeRef = useRef(false);

  const defaultOptions = {
    page: 1,
    pageSize: 10,
    sortBy: 'created_at' as keyof Notification,
    sortOrder: 'desc' as 'asc' | 'desc',
    onlyUnseen: false,
    enableRealtime: true, // Enable realtime by default
    ...options
  };

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Notification>>(
    userId ? ['notifications', userId, defaultOptions] : null,
    async () => {
      if (!userId) {
        console.warn('No user ID found. Returning empty notifications.');
        return { data: [], count: 0, page: 1, pageSize: 10, hasMore: false };
      }
      
      console.log('Fetching notifications for user:', userId, 'with options:', defaultOptions);
      return await notificationService.getNotificationsByUserId(userId, defaultOptions);
    }
  );

  console.log('Fetched notifications:', data);
  

  // Get count of unseen notifications
  const { data: unseenData, mutate: mutateUnseen } = useSWR(
    userId ? ['unseenNotifications', userId] : null,
    async () => {
      if (!userId) {
        console.warn('No user ID found. Returning unseen count as 0.');
        return { count: 0 };
      }
      
      console.log('Fetching unseen notifications count for user:', userId);
      const result = await notificationService.getNotificationsByUserId(
        userId,
        { ...defaultOptions, onlyUnseen: true, pageSize: 1 }
      );

      console.log('Unseen notifications count:', result.count);
      return { count: result.count };
    }
  );

  // Setup Supabase Realtime subscription
  useEffect(() => {
    if (!userId || !defaultOptions.enableRealtime || hasSetupRealtimeRef.current) {
      console.warn('Realtime subscription not set up. User ID:', userId, 'Enable Realtime:', defaultOptions.enableRealtime);
      return;
    }
    
    // Create handlers for different event types
    const handlers = {
      INSERT: (payload: any) => {
        console.log('New notification received:', payload);
        const newNotification = payload.new as Notification;
        
        // Update notifications list
        mutate(currentData => {
          if (!currentData) return currentData;
          
          console.log('Updating notifications list with new notification:', newNotification);
          return {
            ...currentData,
            data: [newNotification, ...currentData.data],
            count: currentData.count + 1
          };
        }, false);
        
        // Update unseen count if the notification is not seen
        if (!newNotification.seen) {
          mutateUnseen(currentData => {
            if (!currentData) return { count: 1 };
            console.log('Incrementing unseen notifications count.');
            return { count: currentData.count + 1 };
          }, false);
        }
      },
      
      UPDATE: (payload: any) => {
        console.log('Notification updated:', payload);
        const updatedNotification = payload.new as Notification;
        const oldNotification = payload.old as Notification;
        
        // Check if seen status changed (for unseen count)
        if (!oldNotification.seen && updatedNotification.seen) {
          mutateUnseen(currentData => {
            if (!currentData) return { count: 0 };
            console.log('Decrementing unseen notifications count due to seen status change.');
            return { count: Math.max(0, currentData.count - 1) };
          }, false);
        }
        
        // Update the notification in our data
        mutate(currentData => {
          if (!currentData) return currentData;
          
          console.log('Updating notification in the list:', updatedNotification);
          return {
            ...currentData,
            data: currentData.data.map(notification => 
              notification.id === updatedNotification.id ? updatedNotification : notification
            )
          };
        }, false);
      },
      
      DELETE: (payload: any) => {
        console.log('Notification deleted:', payload);
        const deletedNotification = payload.old as Notification;
        
        // Update unseen count if needed
        if (!deletedNotification.seen) {
          mutateUnseen(currentData => {
            if (!currentData) return { count: 0 };
            console.log('Decrementing unseen notifications count due to deletion.');
            return { count: Math.max(0, currentData.count - 1) };
          }, false);
        }
        
        // Remove the deleted notification
        mutate(currentData => {
          if (!currentData) return currentData;
          
          console.log('Removing deleted notification from the list:', deletedNotification.id);
          return {
            ...currentData,
            data: currentData.data.filter(n => n.id !== deletedNotification.id),
            count: currentData.count - 1
          };
        }, false);
      }
    };
    
    // Subscribe to changes for this user's notifications
    const unsubscribe = subscribeToUserTable(
      `notifications-${userId}`,
      'Notifications',
      userId,
      'user_id',
      handlers
    );
    
    // Store unsubscribe function for cleanup
    unsubscribeRef.current = unsubscribe;
    hasSetupRealtimeRef.current = true;
    
    // Clean up on unmount
    return () => {
      if (unsubscribeRef.current) {
        console.log('Cleaning up realtime subscription for user:', userId);
        unsubscribeRef.current();
        hasSetupRealtimeRef.current = false;
      }
    };
  }, [userId, defaultOptions.enableRealtime, mutate, mutateUnseen]);

  const formatRelativeTime = useCallback((timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      return date.toLocaleDateString(undefined, options);
    }
  }, []);

  // Helper function to mark a notification as seen
  const markAsSeen = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      console.log('Marking notification as seen:', notificationId);
      await notificationService.markAsSeen(notificationId);
      
      // Update local state optimistically
      mutate(currentData => {
        if (!currentData) return currentData;
        
        console.log('Optimistically updating notification to seen:', notificationId);
        return {
          ...currentData,
          data: currentData.data.map(notification => 
            notification.id === notificationId 
              ? { ...notification, seen: true } 
              : notification
          )
        };
      }, false);
      
      // Update unseen count
      mutateUnseen(currentData => {
        if (!currentData) return { count: 0 };
        console.log('Decrementing unseen notifications count after marking as seen.');
        return { count: Math.max(0, currentData.count - 1) };
      }, false);
      
    } catch (err) {
      console.error('Error marking notification as seen:', err);
    }
  }, [userId, mutate, mutateUnseen]);

  // Helper function to mark all notifications as seen
  const markAllAsSeen = useCallback(async () => {
    if (!userId) return;
    
    try {
      console.log('Marking all notifications as seen for user:', userId);
      await notificationService.markAllAsSeenForUser(userId);
      
      // Update local state optimistically
      mutate(currentData => {
        if (!currentData) return currentData;
        
        console.log('Optimistically updating all notifications to seen.');
        return {
          ...currentData,
          data: currentData.data.map(notification => ({ ...notification, seen: true }))
        };
      }, false);
      
      // Reset unseen count
      mutateUnseen({ count: 0 }, false);
      
      // Revalidate from server
      mutate();
      mutateUnseen();
      
    } catch (err) {
      console.error('Error marking all notifications as seen:', err);
    }
  }, [userId, mutate, mutateUnseen]);

  // Use the specialized hook for invitation notifications
  const {
    acceptInvitation,
    refuseInvitation,
    isPendingInvitation,
    getInvitationStatus,
    isInvitationNotification,
    isAcceptingInvitation,
    isRefusingInvitation,
    isProcessingInvitation
  } = useInvitationNotifications({
    markAsSeen,
    mutate
  });

  return {
    notifications: data?.data || [],
    unseenCount: unseenData?.count || 0,
    pagination: {
      page: data?.page || 1,
      pageSize: data?.pageSize || 10,
      total: data?.count || 0,
      hasMore: data?.hasMore || false
    },
    isLoading,
    error,
    mutate,
    formatRelativeTime,
    markAsSeen,
    markAllAsSeen,
    acceptInvitation,
    refuseInvitation,
    isPendingInvitation,
    getInvitationStatus,
    isInvitationNotification,
    isAcceptingInvitation,
    isRefusingInvitation,
    isProcessingInvitation
  };
} 