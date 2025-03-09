import { useState } from 'react';
import { matchService, Match } from '@/services';
import useMatches from './useMatches';
import useMatch from './useMatch';

export default function useUpdateScores(matchId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateMatches } = useMatches();
  const { mutate: mutateMatch } = useMatch(matchId);
  
  const updateScores = async (id: string, user1Score: number, user2Score: number): Promise<Match> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await matchService.updateScores(id, user1Score, user2Score);
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
    updateScores,
    isLoading,
    error
  };
} 