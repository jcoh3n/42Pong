import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";
import { PaginatedResponse } from "./userService";

// Define challenge-specific types
export type Challenge = Database['public']['Tables']['Challenge']['Row'];
export type ChallengeInsert = Database['public']['Tables']['Challenge']['Insert'];
export type ChallengeUpdate = Database['public']['Tables']['Challenge']['Update'];
export type ChallengeStatus = Database['public']['Enums']['match_status'];

export class ChallengeService {
  private getClient() {
    return createClient<Database>();
  }

  async getAllChallenges(options?: { 
    page?: number; 
    pageSize?: number;
    sortBy?: keyof Challenge;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Challenge>> {
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
      .from('Challenge')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      console.error('Error fetching all challenges:', error);
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

  async getChallengeById(id: string): Promise<Challenge | null> {
    const { data, error } = await this.getClient()
      .from('Challenge')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching challenge with id ${id}:`, error);
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw error;
    }

    return data;
  }

  async getChallengesByStatus(status: ChallengeStatus, options?: {
    page?: number;
    pageSize?: number;
    sortBy?: keyof Challenge;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Challenge>> {
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
      .from('Challenge')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      console.error(`Error fetching challenges with status ${status}:`, error);
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

  async getChallengesByCreator(userId: string, options?: {
    page?: number;
    pageSize?: number;
    sortBy?: keyof Challenge;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Challenge>> {
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
      .from('Challenge')
      .select('*', { count: 'exact' })
      .eq('created_by', userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      console.error(`Error fetching challenges created by user ${userId}:`, error);
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

  async createChallenge(challenge: ChallengeInsert): Promise<Challenge> {
    const { data, error } = await this.getClient()
      .from('Challenge')
      .insert(challenge)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }

    return data;
  }

  async updateChallenge(id: string, updates: ChallengeUpdate): Promise<Challenge> {
    const { data, error } = await this.getClient()
      .from('Challenge')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating challenge with id ${id}:`, error);
      throw error;
    }

    return data;
  }

  async updateChallengeStatus(id: string, status: ChallengeStatus): Promise<Challenge> {
    return this.updateChallenge(id, { status });
  }

  async deleteChallenge(id: string): Promise<boolean> {
    const { error } = await this.getClient()
      .from('Challenge')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting challenge with id ${id}:`, error);
      throw error;
    }

    return true;
  }
} 