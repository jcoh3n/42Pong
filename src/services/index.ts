import { UserService } from './userService';
import { MatchService } from './matchService';
import { ChallengeService } from './challengeService';

// Create service instances
export const userService = new UserService();
export const matchService = new MatchService();
export const challengeService = new ChallengeService();

// Export service classes for direct usage if needed
export { UserService } from './userService';
export { MatchService } from './matchService';
export { ChallengeService } from './challengeService'; 