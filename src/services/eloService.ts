import { userService } from './userService';
import { calculateEloChanges, EloChange, formatEloChange } from '@/utils/eloCalculator';
import { Match } from './matchService';
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
      const isRankedMatch = match.match_type === 'ranked' || match.type === 'ranked';
      if (!isRankedMatch) {
        return {
          success: true,
          eloChange: {
            winnerId: match.winner_id,
            loserId: match.user_1_id === match.winner_id ? match.user_2_id : match.user_1_id,
            winnerEloChange: 0,
            loserEloChange: 0,
            winnerNewElo: 0, // These will be ignored since no change
            loserNewElo: 0
          }
        };
      }

      // Use pre-calculated ELO changes if available
      if (match.user_1_elo_change !== undefined && match.user_2_elo_change !== undefined && 
          match.user_1_elo_before !== undefined && match.user_2_elo_before !== undefined) {
        
        // Determine winner and loser ELO changes
        const isUser1Winner = match.winner_id === match.user_1_id;
        const winnerEloChange = isUser1Winner ? match.user_1_elo_change : match.user_2_elo_change;
        const loserEloChange = isUser1Winner ? -match.user_2_elo_change : -match.user_1_elo_change;
        
        const winnerNewElo = isUser1Winner ? 
          match.user_1_elo_before + match.user_1_elo_change : 
          match.user_2_elo_before + match.user_2_elo_change;
        
        const loserNewElo = isUser1Winner ? 
          match.user_2_elo_before - match.user_2_elo_change : 
          match.user_1_elo_before - match.user_1_elo_change;

        // Apply the pre-calculated ELO changes
        await Promise.all([
          userService.updateEloScore(match.user_1_id, isUser1Winner ? winnerNewElo : loserNewElo),
          userService.updateEloScore(match.user_2_id, isUser1Winner ? loserNewElo : winnerNewElo)
        ]);

        const eloChange = {
          winnerId: match.winner_id,
          loserId: match.user_1_id === match.winner_id ? match.user_2_id : match.user_1_id,
          winnerEloChange,
          loserEloChange,
          winnerNewElo,
          loserNewElo
        };

        console.log(`ELO Update - Ranked Match ${match.id} (using pre-calculated):`, {
          winner: {
            id: match.winner_id,
            oldElo: isUser1Winner ? match.user_1_elo_before : match.user_2_elo_before,
            newElo: winnerNewElo,
            change: winnerEloChange
          },
          loser: {
            id: match.user_1_id === match.winner_id ? match.user_2_id : match.user_1_id,
            oldElo: isUser1Winner ? match.user_2_elo_before : match.user_1_elo_before,
            newElo: loserNewElo,
            change: loserEloChange
          }
        });

        return {
          success: true,
          eloChange
        };
      }

      // Fallback to old calculation method if pre-calculated values are not available
      console.warn(`Match ${match.id} does not have pre-calculated ELO changes, falling back to calculation`);
      
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

      // Calculate ELO changes
      const eloChange = calculateEloChanges({
        winnerId: winner.id,
        loserId: loser.id,
        winnerCurrentElo: winner.elo_score,
        loserCurrentElo: loser.elo_score
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
      const isRankedMatch = match.match_type === 'ranked' || match.type === 'ranked';
      if (!isRankedMatch) {
        return 0;
      }

      // Use pre-calculated ELO changes stored in the match
      if (match.user_1_elo_change !== undefined && match.user_2_elo_change !== undefined) {
        if (userId === match.user_1_id) {
          // Return the correct ELO change based on who won
          return match.winner_id === match.user_1_id ? match.user_1_elo_change : -match.user_2_elo_change;
        } else if (userId === match.user_2_id) {
          // Return the correct ELO change based on who won
          return match.winner_id === match.user_2_id ? match.user_2_elo_change : -match.user_1_elo_change;
        }
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

      // Calculate ELO changes using ELOs from before the match
      const eloChange = calculateEloChanges({
        winnerId: winner.id,
        loserId: loser.id,
        winnerCurrentElo: winner.elo_score,
        loserCurrentElo: loser.elo_score
      });

      // Return the ELO change for the requested user
      if (userId === winner.id) {
        return eloChange.winnerEloChange;
      } else if (userId === loser.id) {
        return eloChange.loserEloChange;
      }

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