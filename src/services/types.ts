import { Database } from "@/types/database.types";

// User types
export type User = Database['public']['Tables']['Users']['Row'];
export type UserInsert = Database['public']['Tables']['Users']['Insert'];
export type UserUpdate = Database['public']['Tables']['Users']['Update'];

// Match types
export type Match = Database['public']['Tables']['Matches']['Row'];
export type MatchInsert = Database['public']['Tables']['Matches']['Insert'];
export type MatchUpdate = Database['public']['Tables']['Matches']['Update'];

// Challenge types
export type Challenge = Database['public']['Tables']['Challenge']['Row'];

// Pagination type
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Extended user type with additional fields
export type FetchedUser = User & {
  wins: number;
}; 