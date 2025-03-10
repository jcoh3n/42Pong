import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";

// Types
export type MatchmakingQueue = Database['public']['Tables']['matchmaking_queue']['Row'];
export type Match = Database['public']['Tables']['Matches']['Row'];

// Service class
export class MatchmakingService {
  private static supabase = createClient<Database>();

  // Rejoindre la file d'attente de matchmaking
  static async joinQueue(playerId: string): Promise<MatchmakingQueue | null> {
    const { data, error } = await this.supabase
      .from('matchmaking_queue')
      .insert([
        { player_id: playerId }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error joining queue:', error);
      return null;
    }

    return data;
  }

  // Quitter la file d'attente
  static async leaveQueue(playerId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('matchmaking_queue')
      .delete()
      .eq('player_id', playerId);

    if (error) {
      console.error('Error leaving queue:', error);
      return false;
    }

    return true;
  }

  // Vérifier si un joueur est dans la file d'attente
  static async checkQueueStatus(playerId: string): Promise<MatchmakingQueue | null> {
    const { data, error } = await this.supabase
      .from('matchmaking_queue')
      .select()
      .eq('player_id', playerId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  // S'abonner aux changements de statut de matchmaking
  static subscribeToMatches(playerId: string, onMatch: (match: Match) => void) {
    return this.supabase
      .channel('matches')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Matches',
          filter: `user_1_id=eq.${playerId},user_2_id=eq.${playerId}`,
        },
        (payload) => {
          onMatch(payload.new as Match);
        }
      )
      .subscribe();
  }

  // Obtenir le match en cours
  static async getCurrentMatch(playerId: string): Promise<Match | null> {
    const { data, error } = await this.supabase
      .from('Matches')
      .select()
      .or(`user_1_id.eq.${playerId},user_2_id.eq.${playerId}`)
      .eq('status', 'pending')
      .single();

    if (error) {
      return null;
    }

    return data;
  }
} 