import useSWR from 'swr';
import { 
  ChallengeService, 
  Challenge, 
  ChallengeStatus 
} from '@/services/challengeService';

// Challenge service instance
const challengeService = new ChallengeService();

export default function useChallengesByStatus(status: ChallengeStatus | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Challenge[]>(
    status ? `/api/challenges/status/${status}` : null,
    () => status ? challengeService.getChallengesByStatus(status) : []
  );

  return {
    challenges: data,
    isLoading,
    error,
    mutate
  };
} 