import useSWR from 'swr';
import { matchService, Match } from '@/services';
import { PaginatedResponse } from '@/services/userService';
import { useState } from 'react';

export default function useMatches(options?: {
  page?: number;
  pageSize?: number;
  sortBy?: keyof Match;
  sortOrder?: 'asc' | 'desc';
  onlyCompleted?: boolean;
}) {
  const [pagination, setPagination] = useState({
    page: options?.page || 1,
    pageSize: options?.pageSize || 10,
    sortBy: options?.sortBy || 'created_at' as keyof Match,
    sortOrder: options?.sortOrder || 'desc' as 'asc' | 'desc',
    onlyCompleted: options?.onlyCompleted || false
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Match>>(
    [`/api/matches`, pagination],
    () => matchService.getAllMatches(pagination)
  );

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 })); // Reset to first page when changing page size
  };

  const setSorting = (sortBy: keyof Match, sortOrder: 'asc' | 'desc' = 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const toggleCompletedOnly = () => {
    setPagination(prev => ({ ...prev, onlyCompleted: !prev.onlyCompleted, page: 1 }));
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
    setSorting,
    toggleCompletedOnly
  };
} 