export interface UserStats {
  totalGames: number;
  wins: number;
  winRate: number;
}

export const calculateUserStats = (userId: string, matches: any[]): UserStats => {
  const totalGames = matches.length;
  const wins = matches.filter(match => 
    (match.user_1_id === userId && match.user_1_score > match.user_2_score) ||
    (match.user_2_id === userId && match.user_2_score > match.user_1_score)
  ).length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return {
    totalGames,
    wins,
    winRate
  };
}; 