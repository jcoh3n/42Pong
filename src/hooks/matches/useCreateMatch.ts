import { useState } from 'react';
import { Match, MatchInsert } from '@/services';
import useMatches from './useMatches';
import useUserMatches from './useUserMatches';
import useSupabase from '../useSupabase';

export default function useCreateMatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: mutateMatches } = useMatches();
  const { services } = useSupabase();
  const { matchService } = services;

  const createMatch = async (matchData: MatchInsert): Promise<Match | null> => {
    if (!matchService) {
      console.error('Match service not available');
      return null;
    }

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