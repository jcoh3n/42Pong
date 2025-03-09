import { useState } from 'react';
import { MatchService, MatchUpdate, Match } from '@/services/matchService';
import useMatches from './useMatches';
import useMatch from './useMatch';

// Match service instance
const matchService = new MatchService();

export default function useUpdateMatch(matchId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateMatches } = useMatches();
  const { mutate: mutateMatch } = useMatch(matchId);
  
  const updateMatch = async (id: string, matchData: MatchUpdate): Promise<Match> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedMatch = await matchService.updateMatch(id, matchData);
      // Invalidate caches
      mutateMatches();
      if (matchId === id) {
        mutateMatch();
      }
      return updatedMatch;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateMatch,
    isLoading,
    error
  };
} 