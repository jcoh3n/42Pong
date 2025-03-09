import { useState } from 'react';
import { MatchService, MatchInsert, Match } from '@/services/matchService';
import useMatches from './useMatches';
import useUserMatches from './useUserMatches';

// Match service instance
const matchService = new MatchService();

export default function useCreateMatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateMatches } = useMatches();
  
  const createMatch = async (matchData: MatchInsert): Promise<Match> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newMatch = await matchService.createMatch(matchData);
      // Invalidate the matches cache
      mutateMatches();
      return newMatch;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMatch,
    isLoading,
    error
  };
} 