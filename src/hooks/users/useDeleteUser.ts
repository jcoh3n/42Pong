import { useState } from 'react';
import { UserService } from '@/services/userService';
import useUsers from './useUsers';

// User service instance
const userService = new UserService();

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