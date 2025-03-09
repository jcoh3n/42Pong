"use client";

import useSWR from 'swr';
import { userService } from '@/services';
import { PaginatedResponse, User } from '@/services/userService';
import { useState } from 'react';
import { FetchedUser } from '@/services/userService';

export default function useUsers(options?: {
  page?: number;
  pageSize?: number;
  sortBy?: keyof FetchedUser;
  sortOrder?: 'asc' | 'desc';
}) {
  const [pagination, setPagination] = useState({
    page: options?.page || 1,
    pageSize: options?.pageSize || 10,
    sortBy: options?.sortBy || 'elo_score' as keyof FetchedUser,
    sortOrder: options?.sortOrder || 'desc' as 'asc' | 'desc'
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<FetchedUser>>(
    [`/api/users`, pagination],
    () => userService.getAllUsers(pagination)
  );

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 })); // Reset to first page when changing page size
  };

  const setSorting = (sortBy: keyof FetchedUser, sortOrder: 'asc' | 'desc' = 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };

  return {
    users: data?.data || [],
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