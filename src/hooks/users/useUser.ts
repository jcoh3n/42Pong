import useSWR from 'swr';
import { userService, User } from '@/services';

export default function useUser(login: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    login ? ['user', login] : null,
    () => login ? userService.getUserByLogin(login) : null,
    {
      refreshInterval: 5000 // Rafraîchir toutes les 5 secondes
    }
  );

  return {
    user: data,
    isLoading,
    error,
    mutate
  };
} 