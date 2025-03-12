'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToQueue, removeFromQueue, getPlayerQueueStatus, getPlayerActiveMatch } from '@/services/matchmakingService';
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
      const status = await getPlayerQueueStatus(user.id);
      setIsInQueue(!!status.data);
      setIsLoading(false);
    };

    checkQueue();

    // S'abonner aux nouveaux matches
    const checkActiveMatch = setInterval(async () => {
      const match = await getPlayerActiveMatch(user.id);
      if (match.data) {
        router.push(`/match/${match.data.id}`);
      }
    }, 2000);

    return () => {
      clearInterval(checkActiveMatch);
    };
  }, [user, router]);

  const handleQuickMatch = async () => {
    if (!user) return;

    setIsLoading(true);
    if (isInQueue) {
      // Quitter la file d'attente
      await removeFromQueue(user.id);
      setIsInQueue(false);
    } else {
      // Rejoindre la file d'attente
      const queue = await addToQueue(user.id);
      setIsInQueue(!!queue.data);
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