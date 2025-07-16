import { useState, useEffect } from 'react';
import { eloService } from '@/services/eloService';
import { Match } from '@/services/matchService';
import { formatEloChange } from '@/utils/eloCalculator';

/**
 * Hook to get ELO change for a specific user in a match
 * @param match The match data
 * @param userId The user ID to get ELO change for
 * @returns ELO change data
 */
export function useEloChange(match: Match | null, userId: string | undefined) {
  const [eloChange, setEloChange] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!match || !userId) {
      setEloChange(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    eloService.getEloChangeForUser(match, userId)
      .then(change => {
        setEloChange(change);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to calculate ELO change');
        setIsLoading(false);
      });
  }, [match?.id, match?.winner_id, match?.status, userId]);

  return {
    eloChange,
    formattedEloChange: eloChange !== null ? formatEloChange(eloChange) : '?',
    isLoading,
    error
  };
}

/**
 * Hook to get ELO changes for multiple matches
 * @param matches Array of matches
 * @param userId The user ID
 * @returns Map of match ID to ELO change
 */
export function useMultipleEloChanges(matches: Match[], userId: string | undefined) {
  const [eloChanges, setEloChanges] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matches.length || !userId) {
      setEloChanges(new Map());
      return;
    }

    setIsLoading(true);
    setError(null);

    Promise.all(
      matches.map(async (match) => {
        const eloChange = await eloService.getEloChangeForUser(match, userId);
        return { matchId: match.id, eloChange };
      })
    )
      .then(results => {
        const changeMap = new Map<string, number>();
        results.forEach(({ matchId, eloChange }) => {
          if (eloChange !== null) {
            changeMap.set(matchId, eloChange);
          }
        });
        setEloChanges(changeMap);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to calculate ELO changes');
        setIsLoading(false);
      });
  }, [matches, userId]);

  return {
    eloChanges,
    getFormattedEloChange: (matchId: string) => {
      const change = eloChanges.get(matchId);
      return change !== undefined ? formatEloChange(change) : '?';
    },
    isLoading,
    error
  };
}

/**
 * Hook to trigger ELO update after a match
 * @returns Function to update ELO and loading state
 */
export function useUpdateElo() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateElo = async (match: Match) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await eloService.updateEloAfterMatch(match);
      if (!result.success) {
        setError(result.error || 'Failed to update ELO');
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ELO');
      return { success: false, error: 'Failed to update ELO' };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateElo,
    isUpdating,
    error
  };
} 