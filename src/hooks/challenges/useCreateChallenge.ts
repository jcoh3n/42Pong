import { useState } from 'react';
import { 
  challengeService, 
  Challenge,
  ChallengeInsert
} from '@/services';
import useChallenges from './useChallenges';

export default function useCreateChallenge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateChallenges } = useChallenges();
  
  const createChallenge = async (challengeData: ChallengeInsert): Promise<Challenge> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newChallenge = await challengeService.createChallenge(challengeData);
      // Invalidate the challenges cache
      mutateChallenges();
      return newChallenge;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createChallenge,
    isLoading,
    error
  };
} 