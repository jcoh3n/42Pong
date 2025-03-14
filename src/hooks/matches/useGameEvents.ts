'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/libs/supabase/client';

export type GameMove = {
  id: string;
  match_id: string;
  user_id: string;
  move_type: string;
  move_data: any;
  created_at: string;
};

export type GameEvent = {
  type: 'move' | 'state_change' | 'score_update';
  data: any;
};

type GameEventHandler = (event: GameEvent) => void;

/**
 * A hook for subscribing to real-time game events
 * This allows components to react to game moves, state changes, and score updates
 */
export default function useGameEvents(
  match_id: string | undefined,
  onEvent?: GameEventHandler
) {
  const [lastEvent, setLastEvent] = useState<GameEvent | null>(null);
  const unsubscribeMovesRef = useRef<(() => void) | undefined>(undefined);
  const unsubscribeMatchRef = useRef<(() => void) | undefined>(undefined);
  const handlersSetupRef = useRef(false);
  const supabase = createClient();

  // Process received events and notify listeners
  const processEvent = useCallback((event: GameEvent) => {
    setLastEvent(event);
    
    if (onEvent) {
      onEvent(event);
    }
  }, [onEvent]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!match_id || handlersSetupRef.current) {
      return;
    }
    
    console.log('Setting up game event subscriptions for match:', match_id);
    
    // Subscribe to game moves
    const moveHandler = (payload: any) => {
      const moveData = payload.new as GameMove;
      
      console.log('Game move received:', moveData);
      
      processEvent({
        type: 'move',
        data: moveData
      });
    };
    
    // Subscribe to match state changes
    const matchHandler = (payload: any) => {
      const matchData = payload.new;
      const oldMatchData = payload.old;
      
      // Check if score changed
      if (
        matchData.user_1_score !== oldMatchData.user_1_score || 
        matchData.user_2_score !== oldMatchData.user_2_score
      ) {
        console.log('Score updated:', {
          user_1_score: matchData.user_1_score,
          user_2_score: matchData.user_2_score
        });
        
        processEvent({
          type: 'score_update',
          data: {
            user_1_id: matchData.user_1_id,
            user_2_id: matchData.user_2_id,
            user_1_score: matchData.user_1_score,
            user_2_score: matchData.user_2_score
          }
        });
      }
      
      // Check if match state changed
      if (matchData.status !== oldMatchData.status) {
        console.log('Match state changed:', matchData.status);
        
        processEvent({
          type: 'state_change',
          data: {
            status: matchData.status,
            matchData
          }
        });
      }
    };
    
    // Subscribe to moves using direct channel subscription
    const movesChannel = supabase.channel(`game-moves-${match_id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'game_moves',
        filter: `match_id=eq.${match_id}`
      }, moveHandler)
      .subscribe();
    
    // Subscribe to match updates using direct channel subscription
    const matchChannel = supabase.channel(`match-state-${match_id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'Matches',
        filter: `id=eq.${match_id}`
      }, matchHandler)
      .subscribe();
    
    // Store unsubscribe functions
    unsubscribeMovesRef.current = () => supabase.removeChannel(movesChannel);
    unsubscribeMatchRef.current = () => supabase.removeChannel(matchChannel);
    handlersSetupRef.current = true;
    
    // Clean up subscriptions
    return () => {
      if (unsubscribeMovesRef.current) {
        console.log('Cleaning up game moves subscription');
        unsubscribeMovesRef.current();
      }
      
      if (unsubscribeMatchRef.current) {
        console.log('Cleaning up match state subscription');
        unsubscribeMatchRef.current();
      }
      
      handlersSetupRef.current = false;
    };
  }, [match_id, processEvent, supabase]);

  // Function to send a game move
  const sendMove = useCallback(async (
    userId: string,
    moveType: string,
    moveData: any
  ) => {
    if (!match_id || !userId) {
      console.error('Cannot send move: missing match_id or userId');
      return null;
    }
    
    try {
      // Using raw query since the table might not be defined in Database type
      const { data, error } = await (supabase
        .from('game_moves') as any)
        .insert({
          match_id,
          user_id: userId,
          move_type: moveType,
          move_data: moveData
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error sending game move:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Exception sending game move:', error);
      return null;
    }
  }, [match_id, supabase]);
  
  return {
    lastEvent,
    sendMove
  };
} 