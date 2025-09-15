"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { 
  Box, 
  Container, 
  Flex, 
  Text,
  Heading,
} from "@radix-ui/themes";
import useCurrentUser from "@/hooks/useCurrentUser";
import useUsers from "@/hooks/users/useUsers";
import useUserMatches from "@/hooks/matches/useUserMatches";
import useUserStats from "@/hooks/users/useUserStats";
import { 
  LoadingState,
  WelcomeCard,
  QuickPlayButton,
  MiniLeaderboard,
  RecentMatches
} from "@/components/home";

export default function HomePage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { users: topPlayers = [], isLoading: isLoadingUsers } = useUsers({ 
    page: 1, 
    pageSize: 10, 
    sortBy: 'elo_score', 
    sortOrder: 'desc' 
  });
  
  // Récupérer les matchs de l'utilisateur
  const { matches = [], isLoading: isLoadingMatches } = useUserMatches(
    currentUser?.id,
    { pageSize: 5 } // Récupérer les 5 derniers matchs
  );
  
  // Récupérer les statistiques de l'utilisateur avec realtime
  const { stats, isLoading: isLoadingStats } = useUserStats(currentUser?.id);
  
  // Trouver la position de l'utilisateur actuel dans le classement
  const currentUserRank = topPlayers.findIndex((player: any) => player?.id === currentUser?.id) + 1;
  
  // Utiliser les statistiques du hook ou des valeurs par défaut
  const totalMatches = stats?.totalMatches || 0;
  const wins = stats?.wins || 0;
  const winRate = stats?.winRate || 0;
  
  // Créer un currentUser étendu avec les statistiques pour éviter les erreurs TypeScript
  const currentUserWithStats = currentUser ? {
    ...currentUser,
    wins,
    total_games: totalMatches
  } : null;
  
  // Gestionnaires d'événements
  const handleViewLeaderboard = () => router.push('/leaderboard');
  const handleViewHistory = () => router.push('/history');
  const handleViewProfile = () => router.push('/profile');
  const handleFindOpponent = () => router.push('/games/');
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoadingUser, router]);

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoadingUser || !currentUser || isLoadingUsers || isLoadingMatches || isLoadingStats) {
    return <LoadingState />;
  }
  
  return (
    <Box className="h-full w-full relative">
      {/* Container principal centré */}
      <Container size="4" className="relative z-10">
        <Flex 
          direction="column"
          align="center" 
          justify="center" 
          className="h-full my-8 py-4 px-4 sm:py-8"
          gap={{ initial: "5", sm: "7", md: "8" }}
        >
          
          {/* Phrase d'accroche remontée */}
          {/* <Box 
            className="text-center"
            style={{ 
              marginTop: '-2rem',
              marginBottom: '1rem'
            }}
          >
            <Text 
              size={{ initial: "5", sm: "6", md: "7" }}
              className="text-white mix-blend-exclusion opacity-90 font-light italic"
              style={{ 
                fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                textAlign: 'center',
                lineHeight: '1.3'
              }}
            >
              Prêt pour votre prochaine partie ?
            </Text>
          </Box> */}

          {/* Carte de bienvenue avec informations utilisateur */}
          <WelcomeCard 
            user={currentUser}
            rank={currentUserRank}
            stats={{ wins, totalMatches, winRate }}
            onViewProfile={handleViewProfile}
          />

          {/* Bouton principal de jeu rapide */}
          <QuickPlayButton onClick={handleFindOpponent} />

          {/* Section inférieure avec mini-classement et historique */}
          <Flex 
            direction={{ initial: "column", lg: "row" }} 
            gap={{ initial: "4", sm: "5", md: "6" }}
            className="w-full max-w-6xl"
            align="start"
          >
            {/* Mini classement (Top 5) */}
            <Box className="flex-1 w-full">
              <MiniLeaderboard 
                topPlayers={topPlayers.slice(0, 5)}
                currentUser={currentUser}
                currentUserRank={currentUserRank}
                onViewAll={handleViewLeaderboard}
              />
            </Box>

            {/* Historique récent */}
            <Box className="flex-1 w-full">
              <RecentMatches 
                matches={matches}
                currentUser={currentUserWithStats}
                topPlayers={topPlayers}
                onViewAll={handleViewHistory}
              />
            </Box>
          </Flex>

        </Flex>
      </Container>
    </Box>
  );
}
