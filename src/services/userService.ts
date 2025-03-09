import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";

// Define user-specific types
type User = Database['public']['Tables']['Users']['Row'];
type UserInsert = Database['public']['Tables']['Users']['Insert'];
type UserUpdate = Database['public']['Tables']['Users']['Update'];

export class UserService {
  private getClient() {
    return createClient<Database>();
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.getClient()
      .from('Users')
      .select('*');

    if (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }

    return data;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.getClient()
      .from('Users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw error;
    }

    return data;
  }

  async getUserByLogin(login: string): Promise<User | null> {
    const { data, error } = await this.getClient()
      .from('Users')
      .select('*')
      .eq('login', login)
      .single();

    if (error) {
      console.error(`Error fetching user with login ${login}:`, error);
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw error;
    }

    return data;
  }

  async createUser(user: UserInsert): Promise<User> {
    const { data, error } = await this.getClient()
      .from('Users')
      .insert(user)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  }

  async updateUser(id: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await this.getClient()
      .from('Users')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }

    return data;
  }

  async updateEloScore(id: string, newScore: number): Promise<User> {
    return this.updateUser(id, { elo_score: newScore });
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    return this.updateUser(id, { avatar_url: avatarUrl });
  }

  async deleteUser(id: string): Promise<boolean> {
    const { error } = await this.getClient()
      .from('Users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }

    return true;
  }
} 