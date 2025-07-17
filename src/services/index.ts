import { UserService } from './userService';
import { MatchService } from './matchService';
import { ChallengeService } from './challengeService';
import { NotificationService } from './notificationService';
import { InvitationService } from './invitationService';
import type { ChallengeStatus, ChallengeInsert, ChallengeUpdate } from './challengeService';
import type { Notification, NotificationInsert, NotificationUpdate } from './notificationService';
import * as Types from './types';
import { MatchmakingStatus, Matchmaking } from './types';

// Export types
export * from './types';
export type { ChallengeStatus, ChallengeInsert, ChallengeUpdate };
export type { Notification, NotificationInsert, NotificationUpdate };
export type { MatchmakingStatus, Matchmaking };

// Export service instances
export { matchService } from './matchService';
export { userService } from './userService';
export const challengeService = new ChallengeService();
export const notificationService = new NotificationService();
export const invitationService = new InvitationService();