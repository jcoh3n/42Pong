"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Box, Container, Flex, Text, Heading, Button, Avatar, Card } from "@radix-ui/themes";
import { motion } from 'framer-motion';
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon } from "lucide-react";
import useUserMatches from "@/hooks/matches/useUserMatches";
import useUsers from "@/hooks/users/useUsers";
import useUserStats from "@/hooks/users/useUserStats";
import useCurrentUser from '@/hooks/useCurrentUser';
import { LoadingState, RecentMatches } from "@/components/home";
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetailedStats from '@/components/profile/ProfileDetailedStats';
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

  // Calcul simplifié de la progression ELO
  const calculateEloProgression = () => {
    if (!matches || matches.length === 0) return { trend: 'stable', change: 0, recent: [] };
    
    // Filtrer seulement les matchs ranked pour la progression ELO
    const rankedMatches = matches.filter(match => match.type === 'ranked');
    
    const recentMatches = [...rankedMatches]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
    
    let eloChanges = 0;
    let wins = 0;
    let losses = 0;
    
    recentMatches.forEach((match) => {
      const isWin = match.winner_id === currentUser?.id;
      if (isWin) {
        wins++;
        eloChanges += 15; // Approximation
      } else {
        losses++;
        eloChanges -= 15;
      }
    });
    
    const trend = eloChanges > 0 ? 'up' : eloChanges < 0 ? 'down' : 'stable';
    
    return {
      trend,
      change: eloChanges,
      recent: recentMatches.slice(0, 5),
      recentWins: wins,
      recentLosses: losses
    };
  };

  const eloProgression = calculateEloProgression();

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
      <Container size="4" className="relative z-10">
        <Flex 
          direction="column" 
          align="center" 
          gap={{ initial: "4", sm: "6" }}
          className="min-h-screen py-4 px-4 sm:py-8"
        >
          
          {/* En-tête de profil */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <ProfileHeader 
              user={currentUser}
              rank={currentUserRank}
              onViewLeaderboard={handleViewLeaderboard}
            />
          </motion.div>

          {/* Statistiques détaillées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-4xl"
          >
            <ProfileDetailedStats 
              basicStats={{ wins, losses, totalMatches, winRate }}
              advancedStats={null}
              eloScore={currentUser.elo_score}
            />
          </motion.div>

          {/* Progression ELO simplifiée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <Box className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
              <Flex direction="column" gap="4">
                
                {/* Titre section plus discret */}
                <Text size="3" weight="medium" className="text-white/80">
                  Progression Ranked
                </Text>

                {/* Contenu principal */}
                <Flex 
                  direction={{ initial: "column", sm: "row" }} 
                  gap="4" 
                  align="center"
                  justify="between"
                >
                  
                  {/* ELO et tendance */}
                  <Flex direction="column" gap="2" align={{ initial: "center", sm: "start" }}>
                    <Text size="2" className="text-white/60">ELO actuel</Text>
                    <Flex align="center" gap="3">
                      <Text size="6" weight="bold" className="text-white">
                        {currentUser.elo_score}
                      </Text>
                      
                      {/* Indicateur de tendance */}
                      <Flex align="center" gap="2">
                        {eloProgression.trend === 'up' && (
                          <>
                            <TrendingUpIcon size={16} className="text-green-400" />
                            <Text size="2" className="text-green-400">
                              +{Math.abs(eloProgression.change)}
                            </Text>
                          </>
                        )}
                        {eloProgression.trend === 'down' && (
                          <>
                            <TrendingDownIcon size={16} className="text-red-400" />
                            <Text size="2" className="text-red-400">
                              {eloProgression.change}
                            </Text>
                          </>
                        )}
                        {eloProgression.trend === 'stable' && (
                          <>
                            <ActivityIcon size={16} className="text-gray-400" />
                            <Text size="2" className="text-gray-400">
                              Stable
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* Bilan récent */}
                  <Flex gap="6" align="center">
                    <Flex direction="column" align="center" gap="1">
                      <Text size="3" weight="bold" className="text-green-400">
                        {eloProgression.recentWins}
                      </Text>
                      <Text size="1" className="text-white/60">Victoires</Text>
                    </Flex>
                    <Flex direction="column" align="center" gap="1">
                      <Text size="3" weight="bold" className="text-red-400">
                        {eloProgression.recentLosses}
                      </Text>
                      <Text size="1" className="text-white/60">Défaites</Text>
                    </Flex>
                  </Flex>
                </Flex>

                {/* Derniers matchs ranked */}
                {eloProgression.recent.length > 0 && (
                  <Box className="border-t border-white/10 pt-4">
                    <Text size="2" className="text-white/60 mb-3 block">
                      Derniers matchs ranked
                    </Text>
                    <Flex gap="3" wrap="wrap" align="center">
                      {eloProgression.recent.map((match, index) => {
                        const isWin = match.winner_id === currentUser?.id;
                        return (
                          <Box
                            key={match.id || index}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              background: isWin ? 'rgba(59, 130, 246, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                              color: isWin ? '#60a5fa' : '#818cf8',
                              border: isWin ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isWin ? 'V' : 'D'}
                          </Box>
                        );
                      })}
                    </Flex>
                  </Box>
                )}
              </Flex>
            </Box>
          </motion.div>

          {/* Historique des matchs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl"
          >
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
          </motion.div>

        </Flex>
      </Container>
    </Box>
  );
} 