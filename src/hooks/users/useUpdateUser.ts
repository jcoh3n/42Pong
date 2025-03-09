import { useState } from 'react';
import { userService, User, UserUpdate } from '@/services';
import useUsers from './useUsers';
import useUser from './useUser';

export default function useUpdateUser(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateUsers } = useUsers();
  const { mutate: mutateUser } = useUser(userId);
  
  const updateUser = async (id: string, userData: UserUpdate): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(id, userData);
      // Invalidate both caches
      mutateUsers();
      if (userId === id) {
        mutateUser();
      }
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    isLoading,
    error
  };
} 