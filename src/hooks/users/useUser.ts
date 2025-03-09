import useSWR from 'swr';
import { userService, User } from '@/services';

export default function useUser(userId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    userId ? `/api/users/${userId}` : null,
    () => userId ? userService.getUserById(userId) : null
  );

  return {
    user: data,
    isLoading,
    error,
    mutate
  };
} 