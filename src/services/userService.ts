import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";

// Define user-specific types
export type User = {
  id: string;
  login: string;
  avatar_url: string;
  elo_score: number;
  created_at: string;
  theme: string;
  language: string;
  notifications: boolean;
  email: string | null;
  wins: number;
  total_games: number;
};

export type UserInsert = Database['public']['Tables']['Users']['Insert'];
export type UserUpdate = Database['public']['Tables']['Users']['Update'];

// Define pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type FetchedUser = User;

export class UserService {
  private getClient() {
    return createClient<Database>();
  }

  async getAllUsers(options?: { 
    page?: number; 
    pageSize?: number; 
    sortBy?: keyof FetchedUser;
    sortOrder?: 'asc' | 'desc' 
  }): Promise<PaginatedResponse<FetchedUser>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options || {};

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.getClient()
      .from('Users')
      .select(`
        *,
        Matches!winner_id(count)
      `, { count: 'estimated' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }

    const totalCount = count || 0;
    
    return {
      data: data?.map(user => ({
        ...user,
        wins: user.Matches[0]?.count || 0,
        total_games: user.Matches[0]?.count || 0
      })) || [],
      count: totalCount,
      page,
      pageSize,
      hasMore: from + data.length < totalCount
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.getClient()
      .from('Users')
      .select(`
        *,
        Matches!winner_id(count)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      wins: data.Matches[0]?.count || 0,
      total_games: data.Matches[0]?.count || 0
    };
  }

  async getUserByLogin(login: string): Promise<User | null> {
    const { data, error } = await this.getClient()
      .from('Users')
      .select(`
        *,
        Matches!winner_id(count)
      `)
      .eq('login', login)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }

      console.error(`Error fetching user with login ${login}:`, error);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      wins: data.Matches[0]?.count || 0,
      total_games: data.Matches[0]?.count || 0
    };
  }

  async searchUsers(searchTerm: string, options?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      pageSize = 10
    } = options || {};

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.getClient()
      .from('Users')
      .select(`
        *,
        Matches!winner_id(count)
      `, { count: 'exact' })
      .or(`login.ilike.%${searchTerm}%`)
      .order('elo_score', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error searching users:', error);
      throw error;
    }

    const totalCount = count || 0;
    
    return {
      data: data?.map(user => ({
        ...user,
        wins: user.Matches[0]?.count || 0,
        total_games: user.Matches[0]?.count || 0
      })) || [],
      count: totalCount,
      page,
      pageSize,
      hasMore: from + data.length < totalCount
    };
  }

  async createUser(user: UserInsert): Promise<User> {
    const { data, error } = await this.getClient()
      .from('Users')
      .insert(user)
      .select(`
        *,
        Matches!winner_id(count)
      `)
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return {
      ...data,
      wins: data.Matches[0]?.count || 0,
      total_games: data.Matches[0]?.count || 0
    };
  }

  async updateUser(id: string, updates: UserUpdate): Promise<User> {
    const { data, error } = await this.getClient()
      .from('Users')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        Matches!winner_id(count)
      `)
      .single();

    if (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }

    return {
      ...data,
      wins: data.Matches[0]?.count || 0,
      total_games: data.Matches[0]?.count || 0
    };
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

export const userService = new UserService(); 