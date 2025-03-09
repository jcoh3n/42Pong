import useSWR from 'swr';
import { matchService, Match } from '@/services';
import { PaginatedResponse } from '@/services/userService';
import { useState } from 'react';

export default function useUserMatches(userId: string | undefined, options?: {
  page?: number;
  pageSize?: number;
  sortBy?: keyof Match;
  sortOrder?: 'asc' | 'desc';
}) {
  const [pagination, setPagination] = useState({
    page: options?.page || 1,
    pageSize: options?.pageSize || 10,
    sortBy: options?.sortBy || 'created_at' as keyof Match,
    sortOrder: options?.sortOrder || 'desc' as 'asc' | 'desc'
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Match>>(
    userId ? ['userMatches', userId, pagination] : null,
    () => {
      if (!userId) {
        return Promise.resolve({
          data: [],
          count: 0,
          page: pagination.page,
          pageSize: pagination.pageSize,
          hasMore: false
        });
      }
      return matchService.getMatchesByUserId(userId, pagination);
    }
  );

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const setSorting = (sortBy: keyof Match, sortOrder: 'asc' | 'desc' = 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };

  return {
    matches: data?.data || [],
    pagination: {
      ...pagination,
      total: data?.count || 0,
      hasMore: data?.hasMore || false,
      totalPages: data ? Math.ceil(data.count / pagination.pageSize) : 0
    },
    isLoading,
    error,
    mutate,
    goToPage,
    setPageSize,
    setSorting
  };
}