import useSWR from 'swr';
import { MatchService, Match } from '@/services/matchService';

// Match service instance
const matchService = new MatchService();

export default function useMatch(matchId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Match | null>(
    matchId ? `/api/matches/${matchId}` : null,
    () => matchId ? matchService.getMatchById(matchId) : null
  );

  return {
    match: data,
    isLoading,
    error,
    mutate
  };
} 