import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";

// Define match-specific types
type Match = Database['public']['Tables']['Matches']['Row'];
type MatchInsert = Database['public']['Tables']['Matches']['Insert'];
type MatchUpdate = Database['public']['Tables']['Matches']['Update'];

export class MatchService {
  private getClient() {
    return createClient<Database>();
  }

  async getAllMatches(): Promise<Match[]> {
    const { data, error } = await this.getClient()
      .from('Matches')
      .select('*');

    if (error) {
      console.error('Error fetching all matches:', error);
      throw error;
    }

    return data;
  }

  async getMatchById(id: number): Promise<Match | null> {
    const { data, error } = await this.getClient()
      .from('Matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching match with id ${id}:`, error);
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw error;
    }

    return data;
  }

  async getMatchesByUserId(userId: string): Promise<Match[]> {
    const { data, error } = await this.getClient()
      .from('Matches')
      .select('*')
      .or(`user_1.eq.${userId},user_2.eq.${userId}`);

    if (error) {
      console.error(`Error fetching matches for user ${userId}:`, error);
      throw error;
    }

    return data;
  }

  async getMatchesWonByUserId(userId: string): Promise<Match[]> {
    const { data, error } = await this.getClient()
      .from('Matches')
      .select('*')
      .eq('winner_id', userId);

    if (error) {
      console.error(`Error fetching matches won by user ${userId}:`, error);
      throw error;
    }

    return data;
  }

  async createMatch(match: MatchInsert): Promise<Match> {
    const { data, error } = await this.getClient()
      .from('Matches')
      .insert(match)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating match:', error);
      throw error;
    }

    return data;
  }

  async updateMatch(id: number, updates: MatchUpdate): Promise<Match> {
    const { data, error } = await this.getClient()
      .from('Matches')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating match with id ${id}:`, error);
      throw error;
    }

    return data;
  }

  async updateScores(id: number, user1Score: number, user2Score: number): Promise<Match> {
    return this.updateMatch(id, { 
      user_1_score: user1Score, 
      user_2_score: user2Score 
    });
  }

  async finishMatch(id: number, winnerId: string): Promise<Match> {
    const finished_at = new Date().toISOString();
    return this.updateMatch(id, { 
      finished_at, 
      winner_id: winnerId 
    });
  }

  async deleteMatch(id: number): Promise<boolean> {
    const { error } = await this.getClient()
      .from('Matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting match with id ${id}:`, error);
      throw error;
    }

    return true;
  }
} 