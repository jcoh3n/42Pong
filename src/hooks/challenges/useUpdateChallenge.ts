import { useState } from 'react';
import { 
  ChallengeService, 
  ChallengeUpdate, 
  Challenge 
} from '@/services/challengeService';
import useChallenges from './useChallenges';
import useChallenge from './useChallenge';

// Challenge service instance
const challengeService = new ChallengeService();

export default function useUpdateChallenge(challengeId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateChallenges } = useChallenges();
  const { mutate: mutateChallenge } = useChallenge(challengeId);
  
  const updateChallenge = async (id: string, challengeData: ChallengeUpdate): Promise<Challenge> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedChallenge = await challengeService.updateChallenge(id, challengeData);
      // Invalidate caches
      mutateChallenges();
      if (challengeId === id) {
        mutateChallenge();
      }
      return updatedChallenge;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateChallenge,
    isLoading,
    error
  };
} 