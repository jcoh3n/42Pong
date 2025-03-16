import { useState } from 'react';
import { Challenge } from '@/services';
import useChallenges from './useChallenges';
import useSupabase from '../useSupabase';

export default function useDeleteChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateChallenges } = useChallenges();
  
  const deleteChallenge = async (challengeId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { services } = useSupabase();
      const { challengeService } = services;
	  if (!challengeService) {
		throw new Error('Challenge service not initialized');
	  }

      const result = await challengeService.deleteChallenge(challengeId);
      // Invalidate the challenges cache
      mutateChallenges();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteChallenge,
    isLoading,
    error
  };
} 