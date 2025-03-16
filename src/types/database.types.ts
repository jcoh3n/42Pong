export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          finished_at: string | null
          forfeited_by: string | null
          id: string
          match_type: Database["public"]["Enums"]["matche_type"]
          score_to_win: number
          status: Database["public"]["Enums"]["match_status"]
          type: Database["public"]["Enums"]["matche_type"]
          user_1_id: string
          user_1_score: number
          user_2_id: string
          user_2_score: number
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          forfeited_by?: string | null
          id?: string
          match_type?: Database["public"]["Enums"]["matche_type"]
          score_to_win?: number
          status?: Database["public"]["Enums"]["match_status"]
          type: Database["public"]["Enums"]["matche_type"]
          user_1_id: string
          user_1_score?: number
          user_2_id: string
          user_2_score?: number
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          forfeited_by?: string | null
          id?: string
          match_type?: Database["public"]["Enums"]["matche_type"]
          score_to_win?: number
          status?: Database["public"]["Enums"]["match_status"]
          type?: Database["public"]["Enums"]["matche_type"]
          user_1_id?: string
          user_1_score?: number
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
            foreignKeyName: "Matches_winner_fkey"
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
      check_matche_winner: {
        Args: {
          match_id: string
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
      create_users_and_manage_matchmaking: {
        Args: {
          user1_name: string
          user2_name: string
        }
        Returns: Json
      }
      delete_row_from_table: {
        Args: {
          table_name: string
          column_name: string
          column_value: unknown
        }
        Returns: undefined
      }
      increase_user_score: {
        Args: {
          match_id: string
          user_id: string
        }
        Returns: Json
      }
      remove_from_matchmaking_queue: {
        Args: {
          player_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
