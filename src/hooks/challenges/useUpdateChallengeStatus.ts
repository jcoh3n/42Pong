import { useState } from 'react';
import { 
  Challenge,
  ChallengeStatus
} from '@/services';
import useChallenges from './useChallenges';
import useChallenge from './useChallenge';
import useChallengesByStatus from './useChallengesByStatus';
import useSupabase from '../useSupabase';
		
export default function useUpdateChallengeStatus(challengeId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateChallenges } = useChallenges();
  const { mutate: mutateChallenge } = useChallenge(challengeId);
  const { services } = useSupabase();
  const { challengeService } = services;

  const updateChallengeStatus = async (id: string, status: ChallengeStatus): Promise<Challenge> => {
    setIsLoading(true);
    setError(null);
    
    try {
	  if (!challengeService) {
		throw new Error('Challenge service not initialized');
	  }

      const result = await challengeService.updateChallengeStatus(id, status);
      // Invalidate caches
      mutateChallenges();
      if (challengeId === id) {
        mutateChallenge();
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateChallengeStatus,
    isLoading,
    error
  };
} 