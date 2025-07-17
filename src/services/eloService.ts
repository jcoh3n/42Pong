import { userService } from './userService';
import { calculateEloChanges, EloChange, formatEloChange } from '@/utils/eloCalculator';
import { Match, matchService } from './matchService';
import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';

export interface EloUpdateResult {
  success: boolean;
  eloChange?: EloChange;
  error?: string;
}

export class EloService {
  /**
   * Calculate and update ELO ratings for both players after a ranked match
   * @param match The completed match
   * @returns ELO update result
   */
  async updateEloAfterMatch(match: Match): Promise<EloUpdateResult> {
    try {
      // Validate match data
      if (!match.winner_id || match.status !== 'completed') {
        return {
          success: false,
          error: 'Match is not completed or has no winner'
        };
      }

      // Only apply ELO to ranked matches (check both possible properties)
      const isRankedMatch = match.type === 'ranked';
      if (!isRankedMatch) {
        return {
          success: true,
          eloChange: {
            winnerId: match.winner_id,
            loserId: match.user_1_id === match.winner_id ? match.user_2_id : match.user_1_id,
            winnerEloChange: 0,
            loserEloChange: 0,
            winnerNewElo: 0,
            loserNewElo: 0
          }
        };
      }

      // Get current user data for both players
      const [winner, loser] = await Promise.all([
        userService.getUserById(match.winner_id),
        userService.getUserById(match.user_1_id === match.winner_id ? match.user_2_id : match.user_1_id)
      ]);

      if (!winner || !loser) {
        return {
          success: false,
          error: 'Could not find user data for both players'
        };
      }

      const winnerGamesPlayed = await matchService.getUserMatchesCount(winner.id);
      const loserGamesPlayed = await matchService.getUserMatchesCount(loser.id);

      // Calculate ELO changes
      const eloChange = calculateEloChanges({
        winnerId: winner.id,
        loserId: loser.id,
        winnerCurrentElo: winner.elo_score,
        loserCurrentElo: loser.elo_score,
        winnerGamesPlayed,
        loserGamesPlayed
      });

      // Update ELO scores in database
      await Promise.all([
        userService.updateEloScore(winner.id, eloChange.winnerNewElo),
        userService.updateEloScore(loser.id, eloChange.loserNewElo)
      ]);

      console.log(`ELO Update - Ranked Match ${match.id}:`, {
        winner: {
          id: winner.id,
          login: winner.login,
          oldElo: winner.elo_score,
          newElo: eloChange.winnerNewElo,
          change: eloChange.winnerEloChange
        },
        loser: {
          id: loser.id,
          login: loser.login,
          oldElo: loser.elo_score,
          newElo: eloChange.loserNewElo,
          change: eloChange.loserEloChange
        }
      });

      return {
        success: true,
        eloChange
      };

    } catch (error) {
      console.error('Error updating ELO after match:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get ELO change for a specific user in a match
   * @param match The match data
   * @param userId The user ID to get ELO change for
   * @returns ELO change amount or null if not found
   */
  async getEloChangeForUser(match: Match, userId: string): Promise<number | null> {
    try {
      if (!match.winner_id || match.status !== 'completed') {
        return null;
      }

      // Only calculate for ranked matches (check both possible properties)
      const isRankedMatch = match.type === 'ranked';
      if (!isRankedMatch) {
        return null; // Return null for non-ranked matches instead of 0
      }

      // Fallback to old calculation method if pre-calculated values are not available
      console.warn(`Match ${match.id} does not have pre-calculated ELO changes, falling back to calculation`);
      
      // Get current user data
      const [user1, user2] = await Promise.all([
        userService.getUserById(match.user_1_id),
        userService.getUserById(match.user_2_id)
      ]);

      if (!user1 || !user2) {
        return null;
      }

      // Use stored ELO values from before the match if available
      const user1EloBeforeMatch = match.user_1_elo_before || user1.elo_score;
      const user2EloBeforeMatch = match.user_2_elo_before || user2.elo_score;

      // Determine winner and loser with their ELOs from before the match
      const winner = match.winner_id === user1.id ? 
        { id: user1.id, elo_score: user1EloBeforeMatch } : 
        { id: user2.id, elo_score: user2EloBeforeMatch };
      
      const loser = match.winner_id === user1.id ? 
        { id: user2.id, elo_score: user2EloBeforeMatch } : 
        { id: user1.id, elo_score: user1EloBeforeMatch };

      return null;
    } catch (error) {
      console.error('Error calculating ELO change for user:', error);
      return null;
    }
  }

  /**
   * Get formatted ELO change string for display
   * @param match The match data
   * @param userId The user ID
   * @returns Formatted ELO change string
   */
  async getFormattedEloChange(match: Match, userId: string): Promise<string> {
    const eloChange = await this.getEloChangeForUser(match, userId);
    if (eloChange === null) {
      return '?';
    }
    return formatEloChange(eloChange);
  }
}

// Export singleton instance
export const eloService = new EloService(); 