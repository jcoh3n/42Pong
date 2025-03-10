'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MatchmakingService } from '@/services/matchmakingService';
import { Button } from '@radix-ui/themes';
import { useAuth } from '@/hooks/useAuth';

export default function QuickMatch() {
  const [isInQueue, setIsInQueue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Vérifier si le joueur est déjà dans la file d'attente
    const checkQueue = async () => {
      const status = await MatchmakingService.checkQueueStatus(user.id);
      setIsInQueue(!!status);
      setIsLoading(false);
    };

    checkQueue();

    // S'abonner aux nouveaux matches
    const subscription = MatchmakingService.subscribeToMatches(user.id, (match) => {
      // Rediriger vers la page du match
      router.push(`/match/${match.id}`);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, router]);

  const handleQuickMatch = async () => {
    if (!user) return;

    setIsLoading(true);
    if (isInQueue) {
      // Quitter la file d'attente
      await MatchmakingService.leaveQueue(user.id);
      setIsInQueue(false);
    } else {
      // Rejoindre la file d'attente
      const queue = await MatchmakingService.joinQueue(user.id);
      setIsInQueue(!!queue);
    }
    setIsLoading(false);
  };

  if (!user || isLoading) {
    return (
      <Button disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleQuickMatch}
      variant={isInQueue ? "soft" : "solid"}
      color={isInQueue ? "amber" : "grass"}
    >
      {isInQueue ? "Cancel Quick Match" : "Quick Match"}
    </Button>
  );
} 