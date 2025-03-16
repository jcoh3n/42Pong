'use client';

import { useState, useCallback } from 'react';

interface LoadingState {
  [id: string]: {
    [action: string]: boolean;
  };
}

/**
 * Hook for managing loading states of actions on different items
 */
export function useActionLoadingState() {
  const [loadingState, setLoadingState] = useState<LoadingState>({});
  
  /**
   * Start loading state for an action on a specific item
   */
  const startLoading = useCallback((itemId: string, action: string) => {
    setLoadingState(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [action]: true
      }
    }));
  }, []);
  
  /**
   * Stop loading state for an action on a specific item
   */
  const stopLoading = useCallback((itemId: string, action: string) => {
    setLoadingState(prev => {
      const itemState = prev[itemId] || {};
      const newItemState = { ...itemState };
      delete newItemState[action];
      
      return {
        ...prev,
        [itemId]: Object.keys(newItemState).length > 0 ? newItemState : {}
      };
    });
  }, []);
  
  /**
   * Check if an action is loading for a specific item
   */
  const isLoading = useCallback((itemId: string, action: string): boolean => {
    return Boolean(loadingState[itemId]?.[action]);
  }, [loadingState]);
  
  /**
   * Check if any action is loading for a specific item
   */
  const isItemLoading = useCallback((itemId: string): boolean => {
    return Object.keys(loadingState[itemId] || {}).length > 0;
  }, [loadingState]);
  
  /**
   * Get all items with a specific action loading
   */
  const getItemsWithActionLoading = useCallback((action: string): string[] => {
    return Object.entries(loadingState)
      .filter(([_, actions]) => actions[action])
      .map(([itemId]) => itemId);
  }, [loadingState]);
  
  /**
   * Wrapper function to execute an action with loading state management
   */
  const executeWithLoading = useCallback(async <T>(
    itemId: string,
    action: string,
    callback: () => Promise<T>
  ): Promise<T> => {
    startLoading(itemId, action);
    try {
      const result = await callback();
      return result;
    } finally {
      stopLoading(itemId, action);
    }
  }, [startLoading, stopLoading]);
  
  return {
    startLoading,
    stopLoading,
    isLoading,
    isItemLoading,
    getItemsWithActionLoading,
    executeWithLoading
  };
} 