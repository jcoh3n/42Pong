import useSWR from 'swr';
import { ChallengeService, Challenge } from '@/services/challengeService';

// Challenge service instance
const challengeService = new ChallengeService();

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