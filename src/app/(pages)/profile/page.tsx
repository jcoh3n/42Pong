"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Box, Container, Flex, Text, Heading, Button } from "@radix-ui/themes";
import useUserMatches from "@/hooks/matches/useUserMatches";
import useUsers from "@/hooks/users/useUsers";
import useUserStats from "@/hooks/users/useUserStats";
import useCurrentUser from '@/hooks/useCurrentUser';
import { LoadingState, RecentMatches } from "@/components/home";
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetailedStats from '@/components/profile/ProfileDetailedStats';
import ProfileProgressChart from '@/components/profile/ProfileProgressChart';
import ProfileMatchAnalysis from '@/components/profile/ProfileMatchAnalysis';
import PongPaddle from '@/components/PongPaddle/PongPaddle';

export default function Profile() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const router = useRouter();
  const { matches = [], isLoading: isLoadingMatches } = useUserMatches(currentUser?.id);
  const { users: topPlayers = [], isLoading: isLoadingUsers } = useUsers({ 
    page: 1, 
    pageSize: 10, 
    sortBy: 'elo_score', 
    sortOrder: 'desc' 
  });

  // Récupérer les statistiques de l'utilisateur avec realtime
  const { stats, isLoading: isLoadingStats } = useUserStats(currentUser?.id);
  
  // Trouver la position de l'utilisateur actuel dans le classement
  const currentUserRank = topPlayers.findIndex((player: any) => player?.id === currentUser?.id) + 1;
  
  // Utiliser les statistiques du hook ou des valeurs par défaut
  const totalMatches = stats?.totalMatches || 0;
  const wins = stats?.wins || 0;
  const losses = totalMatches - wins;
  const winRate = stats?.winRate || 0;

  // Statistiques avancées uniques à la page Profile
  const calculateAdvancedStats = () => {
    if (!matches || matches.length === 0) return null;

    // Analyse des streaks
    let currentStreak = 0;
    let longestWinStreak = 0;
    let longestLoseStreak = 0;
    let tempWinStreak = 0;
    let tempLoseStreak = 0;

    // Analyse des scores
    let totalScoreFor = 0;
    let totalScoreAgainst = 0;
    let perfectGames = 0; // Victoires sans encaisser de points
    let closeGames = 0; // Matchs décidés par 1 point

    // Analyse par type de match
    const matchTypeStats = {
      normal: { wins: 0, losses: 0, total: 0 },
      ranked: { wins: 0, losses: 0, total: 0 },
      friendly: { wins: 0, losses: 0, total: 0 }
    };

    matches.forEach((match, index) => {
      const isWin = match.winner_id === currentUser?.id;
      const userScore = match.user_1_id === currentUser?.id ? match.user_1_score : match.user_2_score;
      const opponentScore = match.user_1_id === currentUser?.id ? match.user_2_score : match.user_1_score;
      
      // Calcul des streaks
      if (isWin) {
        tempWinStreak++;
        tempLoseStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, tempWinStreak);
        if (index === 0) currentStreak = tempWinStreak;
      } else {
        tempLoseStreak++;
        tempWinStreak = 0;
        longestLoseStreak = Math.max(longestLoseStreak, tempLoseStreak);
        if (index === 0) currentStreak = -tempLoseStreak;
      }

      // Analyse des scores
      totalScoreFor += userScore;
      totalScoreAgainst += opponentScore;
      
      if (isWin && opponentScore === 0) perfectGames++;
      if (Math.abs(userScore - opponentScore) === 1) closeGames++;

      // Stats par type de match
      const matchType = match.match_type || match.type || 'normal';
      if (matchTypeStats[matchType]) {
        matchTypeStats[matchType].total++;
        if (isWin) matchTypeStats[matchType].wins++;
        else matchTypeStats[matchType].losses++;
      }
    });

    return {
      currentStreak,
      longestWinStreak,
      longestLoseStreak,
      averageScoreFor: totalMatches > 0 ? Math.round(totalScoreFor / totalMatches) : 0,
      averageScoreAgainst: totalMatches > 0 ? Math.round(totalScoreAgainst / totalMatches) : 0,
      perfectGames,
      closeGames,
      matchTypeStats
    };
  };

  const advancedStats = calculateAdvancedStats();

  // Gestionnaires d'événements
  const handleViewHistory = () => router.push('/history');
  const handleViewLeaderboard = () => router.push('/leaderboard');

  // Affichage du chargement
  if (isLoadingUser || isLoadingMatches || isLoadingUsers || isLoadingStats) {
    return <LoadingState />;
  }

  if (!currentUser) {
    return <PongPaddle />;
  }

  return (
    <Box className="min-h-screen w-full relative">
      {/* Container principal */}
      <Container size="4" className="relative z-10 py-8">
        <Flex 
          direction="column" 
          align="center" 
          gap={{ initial: "6", sm: "8" }}
          className="px-4"
        >
          
          {/* Titre principal */}
          <Heading 
            size={{ initial: "8", sm: "9" }}
            weight="bold" 
            className="text-white mix-blend-exclusion text-center"
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em',
              marginBottom: '2rem'
            }}
          >
            Analyse de Performance
          </Heading>

          {/* En-tête de profil compact */}
          <ProfileHeader 
            user={currentUser}
            rank={currentUserRank}
            onViewLeaderboard={handleViewLeaderboard}
          />

          {/* Statistiques détaillées en grille */}
          <ProfileDetailedStats 
            basicStats={{ wins, losses, totalMatches, winRate }}
            advancedStats={advancedStats}
            eloScore={currentUser.elo_score}
          />

          {/* Graphique de progression ELO */}
          <ProfileProgressChart 
            matches={matches}
            currentUser={currentUser}
            currentElo={currentUser.elo_score}
          />

          {/* Analyse des matchs */}
          <ProfileMatchAnalysis 
            matches={matches}
            currentUser={currentUser}
            topPlayers={topPlayers}
            advancedStats={advancedStats}
          />

          {/* Historique complet des matchs */}
          <Box className="w-full max-w-6xl">
            <RecentMatches 
              matches={matches}
              currentUser={{
                ...currentUser,
                wins,
                total_games: totalMatches
              }}
              topPlayers={topPlayers}
              onViewAll={handleViewHistory}
            />
          </Box>

        </Flex>
      </Container>
    </Box>
  );
} 