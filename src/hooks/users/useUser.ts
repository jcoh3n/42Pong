'use client';

import useSWR from 'swr';
import { userService, User } from '@/services';

export default function useUser(login?: string, id?: string) {
  const { data, error, isLoading, mutate } = useSWR<User | null>(
    login ? ['user', 'login', login] : id ? ['user', 'id', id] : null,
    () => {
      if (login) {
        return userService.getUserByLogin(login);
      } else if (id) {
        return userService.getUserById(id);
      }
      return null;
    },
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