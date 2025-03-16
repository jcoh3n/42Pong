import useSWR from 'swr';
import { 
  Challenge, 
  ChallengeStatus 
} from '@/services';
import { PaginatedResponse } from '@/services/userService';
import useSupabase from '../useSupabase';
import { useState } from 'react';

export default function useChallengesByStatus(status: ChallengeStatus | undefined, options?: {
  page?: number;
  pageSize?: number;
  sortBy?: keyof Challenge;
  sortOrder?: 'asc' | 'desc';
}) {
  const { services } = useSupabase();
  const { challengeService } = services;

  const [pagination, setPagination] = useState({
    page: options?.page || 1,
    pageSize: options?.pageSize || 10,
    sortBy: options?.sortBy || 'created_at' as keyof Challenge,
    sortOrder: options?.sortOrder || 'desc' as 'asc' | 'desc'
  });

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Challenge>>(
    status ? [`/api/challenges/status/${status}`, pagination] : null,
    () => status && challengeService ? challengeService.getChallengesByStatus(status, pagination) : challengeService ? challengeService.getAllChallenges(pagination) : {
      data: [],
      count: 0,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore: false
    }
  );

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const setSorting = (sortBy: keyof Challenge, sortOrder: 'asc' | 'desc' = 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };

  return {
    challenges: data?.data || [],
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