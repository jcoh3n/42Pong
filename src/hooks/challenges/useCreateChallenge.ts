import { useState } from 'react';
import { 
  ChallengeService, 
  ChallengeInsert, 
  Challenge 
} from '@/services/challengeService';
import useChallenges from './useChallenges';

// Challenge service instance
const challengeService = new ChallengeService();

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