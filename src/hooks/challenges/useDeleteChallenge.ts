import { useState } from 'react';
import { challengeService } from '@/services';
import useChallenges from './useChallenges';

export default function useDeleteChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateChallenges } = useChallenges();
  
  const deleteChallenge = async (challengeId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
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