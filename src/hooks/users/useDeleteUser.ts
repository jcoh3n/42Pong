import { useState } from 'react';
import { userService } from '@/services';
import useUsers from './useUsers';

export default function useDeleteUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateUsers } = useUsers();
  
  const deleteUser = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await userService.deleteUser(userId);
      // Invalidate the users cache
      mutateUsers();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteUser,
    isLoading,
    error
  };
} 