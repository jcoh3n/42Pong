import useSWR from 'swr';
import { challengeService, Challenge } from '@/services';

export default function useChallenge(challengeId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Challenge | null>(
    challengeId ? `/api/challenges/${challengeId}` : null,
    () => challengeId ? challengeService.getChallengeById(challengeId) : null
  );

  return {
    challenge: data,
    isLoading,
    error,
    mutate
  };
} 