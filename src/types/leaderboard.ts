import { type User } from "@/services/userService";

export interface LeaderboardData {
  position: number;
  user: User;
  positionChange: number;
  changeClass: string;
}

export interface LeaderboardStats {
  totalGames: number;
  wins: number;
  winRate: number;
} 