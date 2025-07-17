export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      Challenge: {
        Row: {
          created_at: string
          created_by: string
          id: string
          status: Database["public"]["Enums"]["match_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          status?: Database["public"]["Enums"]["match_status"]
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          status?: Database["public"]["Enums"]["match_status"]
        }
        Relationships: []
      }
      friendly_invitation: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          points_to_win: Database["public"]["Enums"]["score_to_win"]
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["invitation_status"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          points_to_win?: Database["public"]["Enums"]["score_to_win"]
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          points_to_win?: Database["public"]["Enums"]["score_to_win"]
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "friendly_invitation_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendly_invitation_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Matches: {
        Row: {
          created_at: string
          elo_change: number | null
          finished_at: string | null
          forfeited_by: string | null
          id: string
          max_sets: number
          score_to_win: number
          sets: Json[]
          sets_to_win: number
          status: Database["public"]["Enums"]["match_status"]
          type: Database["public"]["Enums"]["matche_type"]
          user_1_elo_before: number | null
          user_1_elo_change: number | null
          user_1_id: string
          user_1_score: number
          user_2_elo_before: number | null
          user_2_elo_change: number | null
          user_2_id: string
          user_2_score: number
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          elo_change?: number | null
          finished_at?: string | null
          forfeited_by?: string | null
          id?: string
          max_sets?: number
          score_to_win?: number
          sets?: Json[]
          sets_to_win?: number
          status?: Database["public"]["Enums"]["match_status"]
          type: Database["public"]["Enums"]["matche_type"]
          user_1_elo_before?: number | null
          user_1_elo_change?: number | null
          user_1_id: string
          user_1_score?: number
          user_2_elo_before?: number | null
          user_2_elo_change?: number | null
          user_2_id: string
          user_2_score?: number
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          elo_change?: number | null
          finished_at?: string | null
          forfeited_by?: string | null
          id?: string
          max_sets?: number
          score_to_win?: number
          sets?: Json[]
          sets_to_win?: number
          status?: Database["public"]["Enums"]["match_status"]
          type?: Database["public"]["Enums"]["matche_type"]
          user_1_elo_before?: number | null
          user_1_elo_change?: number | null
          user_1_id?: string
          user_1_score?: number
          user_2_elo_before?: number | null
          user_2_elo_change?: number | null
          user_2_id?: string
          user_2_score?: number
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Matches_forfeited_by_fkey"
            columns: ["forfeited_by"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Matches_user_1_id_fkey"
            columns: ["user_1_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Matches_user_2_id_fkey"
            columns: ["user_2_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      matchmaking_queue: {
        Row: {
          id: string
          joined_at: string | null
          matche_type: Database["public"]["Enums"]["matche_type"] | null
          player_id: string
          status: Database["public"]["Enums"]["matchmaking_status"]
        }
        Insert: {
          id?: string
          joined_at?: string | null
          matche_type?: Database["public"]["Enums"]["matche_type"] | null
          player_id: string
          status?: Database["public"]["Enums"]["matchmaking_status"]
        }
        Update: {
          id?: string
          joined_at?: string | null
          matche_type?: Database["public"]["Enums"]["matche_type"] | null
          player_id?: string
          status?: Database["public"]["Enums"]["matchmaking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "matchmaking_queue_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          invitation_id: string | null
          seen: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          invitation_id?: string | null
          seen?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          invitation_id?: string | null
          seen?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notifications_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "friendly_invitation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          avatar_url: string
          created_at: string
          elo_score: number
          email: string | null
          id: string
          language: string
          login: string
          notifications: boolean
          theme: string
        }
        Insert: {
          avatar_url: string
          created_at?: string
          elo_score?: number
          email?: string | null
          id?: string
          language?: string
          login: string
          notifications?: boolean
          theme?: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          elo_score?: number
          email?: string | null
          id?: string
          language?: string
          login?: string
          notifications?: boolean
          theme?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_player_to_queue: {
        Args: {
          player_id: string
          type?: Database["public"]["Enums"]["matche_type"]
        }
        Returns: Json
      }
      check_match_victory: {
        Args: { match_id: string }
        Returns: Json
      }
      check_matche_winner: {
        Args: { match_id: string }
        Returns: Json
      }
      create_match_with_sets: {
        Args:
          | {
              player1_id: string
              player2_id: string
              match_type: Database["public"]["Enums"]["matche_type"]
              p_sets_to_win?: number
              p_max_sets?: number
              p_score_to_win?: number
            }
          | {
              player1_id: string
              player2_id: string
              match_type: Database["public"]["Enums"]["matche_type"]
              p_sets_to_win?: number
              p_max_sets?: number
              p_score_to_win?: number
            }
          | {
              player1_id: string
              player2_id: string
              match_type: Database["public"]["Enums"]["matche_type"]
              sets_to_win: number
              max_sets: number
            }
          | {
              player1_id: string
              player2_id: string
              match_type: string
              sets_to_win: number
              max_sets: number
            }
        Returns: Json
      }
      create_matche: {
        Args: {
          player1_id: string
          player2_id: string
          matche_type?: Database["public"]["Enums"]["matche_type"]
          score_to_win?: number
        }
        Returns: Json
      }
      create_notification: {
        Args: {
          user_id: string
          title: string
          content: string
          type: Database["public"]["Enums"]["notification_type"]
          invitation_id?: string
        }
        Returns: undefined
      }
      create_typed_match: {
        Args: {
          player1_id: string
          player2_id: string
          match_type: Database["public"]["Enums"]["matche_type"]
        }
        Returns: Json
      }
      create_users_and_manage_matchmaking: {
        Args: { user1_name: string; user2_name: string }
        Returns: Json
      }
      delete_row_from_table: {
        Args: { table_name: string; column_name: string; column_value: unknown }
        Returns: undefined
      }
      increase_user_score: {
        Args: { match_id: string; user_id: string }
        Returns: Json
      }
      remove_from_matchmaking_queue: {
        Args: { player_id: string }
        Returns: Json
      }
      update_elo_after_match: {
        Args: { p_match_id: number }
        Returns: undefined
      }
      update_elo_after_match_if_ranked: {
        Args: { p_match_id: number } | { p_match_id: string }
        Returns: undefined
      }
      update_set_and_check_victory: {
        Args: { set_id: string; p1_score: number; p2_score: number }
        Returns: Json
      }
      update_set_score: {
        Args: { set_id: string; p1_score: number; p2_score: number }
        Returns: Json
      }
    }
    Enums: {
      invitation_status: "pending" | "accepted" | "cancelled" | "refused"
      match_status: "pending" | "ongoing" | "completed" | "cancelled"
      matche_type: "normal" | "ranked" | "friendly"
      matchmaking_status: "waiting" | "matched" | "cancelled"
      notification_type: "invitation" | "message" | "announcement"
      score_to_win: "5" | "7" | "11"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      invitation_status: ["pending", "accepted", "cancelled", "refused"],
      match_status: ["pending", "ongoing", "completed", "cancelled"],
      matche_type: ["normal", "ranked", "friendly"],
      matchmaking_status: ["waiting", "matched", "cancelled"],
      notification_type: ["invitation", "message", "announcement"],
      score_to_win: ["5", "7", "11"],
    },
  },
} as const
