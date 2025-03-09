import { UserService } from './userService';
import { MatchService } from './matchService';
import { ChallengeService } from './challengeService';
import type { ChallengeStatus, ChallengeInsert, ChallengeUpdate } from './challengeService';
import * as Types from './types';

// Export types
export * from './types';
export type { ChallengeStatus, ChallengeInsert, ChallengeUpdate };

// Export service instances
export const userService = new UserService();
export const matchService = new MatchService();
export const challengeService = new ChallengeService();