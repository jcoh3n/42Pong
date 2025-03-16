import useSWR from 'swr';
import { Challenge } from '@/services';
import useSupabase from '../useSupabase';

export default function useChallenge(challengeId: string | undefined) {
  const { services } = useSupabase();
  const { challengeService } = services;

  const { data, error, isLoading, mutate } = useSWR<Challenge | null>(
    challengeId ? `/api/challenges/${challengeId}` : null,
    () => challengeId && challengeService ? challengeService.getChallengeById(challengeId) : null
  );

  return {
    challenge: data,
    isLoading,
    error,
    mutate
  };
} 