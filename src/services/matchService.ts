import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";
import { PaginatedResponse } from "./userService";

// Define match-specific types
export type Match = Database['public']['Tables']['Matches']['Row'];
export type MatchInsert = Database['public']['Tables']['Matches']['Insert'];
export type MatchUpdate = Database['public']['Tables']['Matches']['Update'];

export class MatchService {
  private getClient() {
    return createClient<Database>();
  }

  async getAllMatches(options?: { 
    page?: number; 
    pageSize?: number; 
    sortBy?: keyof Match;
    sortOrder?: 'asc' | 'desc';
    onlyCompleted?: boolean;
  }): Promise<PaginatedResponse<Match>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      onlyCompleted = false
    } = options || {};

    // Calculate offset based on page and pageSize
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Create query with pagination
    let query = this.getClient()
      .from('Matches')
      .select('*', { count: 'exact' });
      
    // Add filters and ordering
    if (onlyCompleted) {
      query = query.not('finished_at', 'is', null);
    }
    
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching all matches:', error);
      throw error;
    }

    const totalCount = count || 0;
    
    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      hasMore: from + data.length < totalCount
    };
  }

  async getMatchById(id: string): Promise<Match | null> {
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

  async getMatchesByUserId(userId: string, options?: {
    page?: number;
    pageSize?: number;
    sortBy?: keyof Match;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Match>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options || {};

    // Calculate offset based on page and pageSize
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      // Get matches where user is player 1
      const user1Matches = await this.getClient()
        .from('Matches')
        .select('*')
        .eq('user_1_id', userId);

      // Get matches where user is player 2
      const user2Matches = await this.getClient()
        .from('Matches')
        .select('*')
        .eq('user_2_id', userId);

      if (user1Matches.error) {
        console.error(`Error fetching user1 matches for user ${userId}:`, user1Matches.error);
        throw user1Matches.error;
      }

      if (user2Matches.error) {
        console.error(`Error fetching user2 matches for user ${userId}:`, user2Matches.error);
        throw user2Matches.error;
      }

      // Combine and sort matches
      const allMatches = [...(user1Matches.data || []), ...(user2Matches.data || [])];
      const sortedMatches = allMatches.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
      });

      // Apply pagination
      const paginatedMatches = sortedMatches.slice(from, to + 1);
      
      return {
        data: paginatedMatches,
        count: allMatches.length,
        page,
        pageSize,
        hasMore: to < allMatches.length - 1
      };
    } catch (error) {
      console.error(`Error in getMatchesByUserId for user ${userId}:`, error);
      throw error;
    }
  }

  async getMatchesWonByUserId(userId: string, options?: {
    page?: number;
    pageSize?: number;
    sortBy?: keyof Match;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Match>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options || {};

    // Calculate offset based on page and pageSize
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Create query with pagination
    const { data, error, count } = await this.getClient()
      .from('Matches')
      .select('*', { count: 'exact' })
      .eq('winner_id', userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      console.error(`Error fetching matches won by user ${userId}:`, error);
      throw error;
    }

    const totalCount = count || 0;
    
    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      hasMore: from + data.length < totalCount
    };
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

  async updateMatch(id: string, updates: MatchUpdate): Promise<Match> {
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

  async updateScores(id: string, user1Score: number, user2Score: number): Promise<Match> {
    return this.updateMatch(id, { 
      user_1_score: user1Score, 
      user_2_score: user2Score 
    });
  }

  async finishMatch(id: string, winnerId: string): Promise<Match> {
    const finished_at = new Date().toISOString();
    return this.updateMatch(id, { 
      finished_at, 
      winner_id: winnerId 
    });
  }

  async deleteMatch(id: string): Promise<boolean> {
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