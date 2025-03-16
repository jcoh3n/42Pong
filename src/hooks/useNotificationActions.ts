// 'use client';

// import { useCallback } from 'react';
// import { Notification } from '@/services';
// import { useActionLoadingState } from './useActionLoadingState';
// import useNotifications from './useNotifications';

// /**
//  * Hook for handling notification actions with loading states
//  */
// export default function useNotificationActions() {
//   const { 
//     acceptInvitation: acceptInvitationBase,
//     refuseInvitation: refuseInvitationBase,
//     markAsSeen,
//     isPendingInvitation,
//     isInvitationNotification,
//     formatRelativeTime
//   } = useNotifications();
  
//   const { 
//     isLoading,
//     isItemLoading,
//     executeWithLoading 
//   } = useActionLoadingState();
  
//   /**
//    * Accept an invitation with loading state
//    */
//   const acceptInvitation = useCallback(async (notification: Notification) => {
//     return executeWithLoading(
//       notification.id,
//       'accept',
//       () => acceptInvitationBase(notification)
//     );
//   }, [acceptInvitationBase, executeWithLoading]);
  
//   /**
//    * Refuse an invitation with loading state
//    */
//   const refuseInvitation = useCallback(async (notification: Notification) => {
//     return executeWithLoading(
//       notification.id,
//       'refuse',
//       () => refuseInvitationBase(notification)
//     );
//   }, [refuseInvitationBase, executeWithLoading]);
  
//   /**
//    * Mark notification as seen with loading state
//    */
//   const markNotificationAsSeen = useCallback(async (notification: Notification) => {
//     return executeWithLoading(
//       notification.id,
//       'markSeen',
//       async () => {
//         await markAsSeen(notification.id);
//         return true;
//       }
//     );
//   }, [markAsSeen, executeWithLoading]);
  
//   /**
//    * Check if a specific action is loading for a notification
//    */
//   const isActionLoading = useCallback((notificationId: string, action: string): boolean => {
//     return isLoading(notificationId, action);
//   }, [isLoading]);
  
//   /**
//    * Check if any action is loading for a notification
//    */
//   const isNotificationProcessing = useCallback((notificationId: string): boolean => {
//     return isItemLoading(notificationId);
//   }, [isItemLoading]);
  
//   return {
//     acceptInvitation,
//     refuseInvitation,
//     markNotificationAsSeen,
//     isActionLoading,
//     isNotificationProcessing,
//     isAcceptingInvitation: (notificationId: string) => isLoading(notificationId, 'accept'),
//     isRefusingInvitation: (notificationId: string) => isLoading(notificationId, 'refuse'),
//     isPendingInvitation,
//     isInvitationNotification,
//     formatRelativeTime
//   };
// } 