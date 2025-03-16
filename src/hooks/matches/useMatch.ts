import useSWR from 'swr';
import { Match } from '@/services';
import useSupabase from '../useSupabase';

export default function useMatch(matchId: string | undefined) {
  const { services } = useSupabase();
  const { matchService } = services;

  const { data, error, isLoading, mutate } = useSWR<Match | null>(
    matchId ? `/api/matches/${matchId}` : null,
    () => matchId && matchService ? matchService.getMatchById(matchId) : null
  );

  return {
    match: data,
    isLoading,
    error,
    mutate
  };
}