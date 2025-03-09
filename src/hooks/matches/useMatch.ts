import useSWR from 'swr';
import { matchService, Match } from '@/services';

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