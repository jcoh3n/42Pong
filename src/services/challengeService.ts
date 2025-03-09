import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";

// Define challenge-specific types
type Challenge = Database['public']['Tables']['Challenge']['Row'];
type ChallengeInsert = Database['public']['Tables']['Challenge']['Insert'];
type ChallengeUpdate = Database['public']['Tables']['Challenge']['Update'];
type ChallengeStatus = Database['public']['Enums']['challenge_status'];

export class ChallengeService {
  private getClient() {
    return createClient<Database>();
  }

  async getAllChallenges(): Promise<Challenge[]> {
    const { data, error } = await this.getClient()
      .from('Challenge')
      .select('*');

    if (error) {
      console.error('Error fetching all challenges:', error);
      throw error;
    }

    return data;
  }

  async getChallengeById(id: number): Promise<Challenge | null> {
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

  async getChallengesByStatus(status: ChallengeStatus): Promise<Challenge[]> {
    const { data, error } = await this.getClient()
      .from('Challenge')
      .select('*')
      .eq('status', status);

    if (error) {
      console.error(`Error fetching challenges with status ${status}:`, error);
      throw error;
    }

    return data;
  }

  async getChallengesByCreator(userId: string): Promise<Challenge[]> {
    const { data, error } = await this.getClient()
      .from('Challenge')
      .select('*')
      .eq('created_by', userId);

    if (error) {
      console.error(`Error fetching challenges created by user ${userId}:`, error);
      throw error;
    }

    return data;
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

  async updateChallenge(id: number, updates: ChallengeUpdate): Promise<Challenge> {
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

  async updateChallengeStatus(id: number, status: ChallengeStatus): Promise<Challenge> {
    return this.updateChallenge(id, { status });
  }

  async deleteChallenge(id: number): Promise<boolean> {
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