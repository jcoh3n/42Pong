'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { createClient } from '@/libs/supabase/client';
import { subscribeToTableEvents } from '@/utils/supabaseRealtime';

export interface UserStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
}

const fetchUserStats = async (key: [string, string]): Promise<UserStats> => {
  const [, userId] = key;
  const supabase = createClient();

  // Get total matches count
  const { data: totalMatchesData, error: totalMatchesError } = await supabase
    .from('Matches')
    .select('id', { count: 'exact' })
    .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
    .eq('status', 'completed');

  if (totalMatchesError) {
    console.error('Error fetching total matches:', totalMatchesError);
    throw totalMatchesError;
  }

  // Get wins count
  const { data: winsData, error: winsError } = await supabase
    .from('Matches')
    .select('id', { count: 'exact' })
    .eq('winner_id', userId)
    .eq('status', 'completed');

  if (winsError) {
    console.error('Error fetching wins:', winsError);
    throw winsError;
  }

  // Get losses count
  const { data: lossesData, error: lossesError } = await supabase
    .from('Matches')
    .select('id', { count: 'exact' })
    .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
    .not('winner_id', 'eq', userId)
    .not('winner_id', 'is', null)
    .eq('status', 'completed');

  if (lossesError) {
    console.error('Error fetching losses:', lossesError);
    throw lossesError;
  }

  const totalMatches = totalMatchesData?.length || 0;
  const wins = winsData?.length || 0;
  const losses = lossesData?.length || 0;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return {
    totalMatches,
    wins,
    losses,
    winRate
  };
};

export default function useUserStats(userId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<UserStats>(
    userId ? ['user-stats', userId] : null,
    fetchUserStats
  );

  // Set up real-time subscription to get updates when matches change
  useEffect(() => {
    if (!userId) return;
    
    // Subscribe to the Matches table for matches involving this user
    const unsubscribe = subscribeToTableEvents(
      `user-stats-${userId}`, // channelName - unique identifier for this subscription
      'Matches', // table name
      {
        // Define handlers for different event types
        INSERT: () => {
          console.log('New match created, updating stats...');
          mutate();
        },
        UPDATE: () => {
          console.log('Match updated, updating stats...');
          mutate();
        },
        DELETE: () => {
          console.log('Match deleted, updating stats...');
          mutate();
        },
        '*': () => {
          console.log('Match event occurred, updating stats...');
          mutate();
        }
      },
      {
        // Filter for matches where the user is either player 1 or player 2
        filter: `or(user_1_id.eq.${userId},user_2_id.eq.${userId})`
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [userId, mutate]);

  return {
    stats: data,
    isLoading,
    error,
    mutate
  };
} 