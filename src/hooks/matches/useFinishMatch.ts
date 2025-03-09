import { useState } from 'react';
import { MatchService, Match } from '@/services/matchService';
import useMatches from './useMatches';
import useMatch from './useMatch';

// Match service instance
const matchService = new MatchService();

export default function useFinishMatch(matchId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateMatches } = useMatches();
  const { mutate: mutateMatch } = useMatch(matchId);
  
  const finishMatch = async (id: string, winnerId: string): Promise<Match> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await matchService.finishMatch(id, winnerId);
      // Invalidate caches
      mutateMatches();
      if (matchId === id) {
        mutateMatch();
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
    finishMatch,
    isLoading,
    error
  };
} 