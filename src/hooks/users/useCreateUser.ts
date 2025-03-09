import { useState } from 'react';
import { userService, User, UserInsert } from '@/services';
import useUsers from './useUsers';

export default function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateUsers } = useUsers();
  
  const createUser = async (userData: UserInsert): Promise<User> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newUser = await userService.createUser(userData);
      // Invalidate the users cache
      mutateUsers();
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading,
    error
  };
} 