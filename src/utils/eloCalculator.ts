/**
 * ELO Rating Calculator
 * Implements a fair ELO rating system that takes into account the difference between players' ratings
 * Only applies to ranked matches
 */

export interface EloChange {
  winnerId: string;
  loserId: string;
  winnerEloChange: number;
  loserEloChange: number;
  winnerNewElo: number;
  loserNewElo: number;
}

export interface EloCalculationParams {
  winnerId: string;
  loserId: string;
  winnerCurrentElo: number;
  loserCurrentElo: number;
  kFactor?: number;
}

/**
 * Calculate expected score for a player based on their ELO vs opponent's ELO
 * @param playerElo Current player's ELO
 * @param opponentElo Opponent's ELO  
 * @returns Expected score (0-1)
 */
export function calculateExpectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

/**
 * Calculate K-factor based on player's ELO (adaptive K-factor)
 * Higher K-factor for lower rated players allows for faster rating changes
 * @param playerElo Current player's ELO
 * @param baseKFactor Base K-factor (default: 32)
 * @returns Adjusted K-factor
 */
export function calculateKFactor(playerElo: number, baseKFactor: number = 32): number {
  // Standard ELO K-factor adjustments
  if (playerElo < 1000) return baseKFactor * 1.5; // New players climb faster
  if (playerElo < 1200) return baseKFactor * 1.2; // Beginner boost
  if (playerElo > 2000) return baseKFactor * 0.8; // Masters have more stable ratings
  return baseKFactor; // Standard K-factor for intermediate players
}

/**
 * Calculate ELO changes for both players after a ranked match
 * @param params Calculation parameters
 * @returns ELO changes for both players
 */
export function calculateEloChanges(params: EloCalculationParams): EloChange {
  const {
    winnerId,
    loserId,
    winnerCurrentElo,
    loserCurrentElo,
    kFactor = 32
  } = params;

  // Calculate expected scores
  const winnerExpectedScore = calculateExpectedScore(winnerCurrentElo, loserCurrentElo);
  const loserExpectedScore = calculateExpectedScore(loserCurrentElo, winnerCurrentElo);

  // Calculate K-factors (adaptive based on current ELO)
  const winnerKFactor = calculateKFactor(winnerCurrentElo, kFactor);
  const loserKFactor = calculateKFactor(loserCurrentElo, kFactor);

  // Calculate ELO changes
  // Winner gets points for winning (actual score = 1, expected score = winnerExpectedScore)
  const winnerEloChange = Math.round(winnerKFactor * (1 - winnerExpectedScore));
  
  // Loser loses points for losing (actual score = 0, expected score = loserExpectedScore)
  const loserEloChange = Math.round(loserKFactor * (0 - loserExpectedScore));

  // Calculate new ELO ratings
  const winnerNewElo = winnerCurrentElo + winnerEloChange;
  const loserNewElo = Math.max(100, loserCurrentElo + loserEloChange); // Minimum ELO of 100

  return {
    winnerId,
    loserId,
    winnerEloChange,
    loserEloChange,
    winnerNewElo,
    loserNewElo
  };
}

/**
 * Get a human-readable description of the ELO change
 * @param eloChange ELO change amount
 * @returns Formatted string with + or - prefix
 */
export function formatEloChange(eloChange: number): string {
  if (eloChange === 0) {
    return "0";
  }
  return eloChange > 0 ? `+${eloChange}` : `${eloChange}`;
} 