import { UserService } from './userService';
import { MatchService } from './matchService';
import { ChallengeService } from './challengeService';

// Export types
export type { User, UserInsert, UserUpdate } from './userService';
export type { Match, MatchInsert, MatchUpdate } from './matchService';
export type { Challenge, ChallengeInsert, ChallengeUpdate, ChallengeStatus } from './challengeService'; 

// Create service instances
export const userService = new UserService();
export const matchService = new MatchService();
export const challengeService = new ChallengeService();