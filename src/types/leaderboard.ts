import { type User } from "@/services/userService";

export interface LeaderboardData {
  position: number;
  user: User;
  positionChange: number;
  changeClass: string;
} 