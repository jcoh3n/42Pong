"use client";

import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  Box, 
  Container, 
  Flex, 
  Text,
  Grid,
  Heading,
  Card,
  Badge,
  Separator,
  Avatar
} from "@radix-ui/themes";
import { 
  BarChartIcon, 
  ClockIcon
} from "@radix-ui/react-icons";
import { FaTrophy, FaChartLine } from 'react-icons/fa';
import useCurrentUser from "@/hooks/useCurrentUser";
import useUsers from "@/hooks/users/useUsers";
import useUserMatches from "@/hooks/matches/useUserMatches";
import useUserStats from "@/hooks/users/useUserStats";
import { 
  LoadingState, 
  RankingList, 
  MatchHistory, 
  FindOpponentButton 
} from "@/components/home";
import Loading from '@/components/Loading';

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
  
  // Gestionnaires d'événements
  const handleViewLeaderboard = () => router.push('/leaderboard');
  const handleViewHistory = () => router.push('/games/history');
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
    <Box className="min-h-screen">
      <Container size="3" py="6">
        <Flex direction="column" gap="8">
          {/* En-tête avec salutation et carte de profil */}
          <Card style={{
			zIndex: 2,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(30, 41, 59, 0.7)',
          }}>
            <Flex p="5" direction="column" gap="4">
              <Flex align="center" gap="4">
                <Avatar
                  size="5"
                  src={currentUser.avatar_url || "https://via.placeholder.com/100"}
                  fallback={currentUser.login?.substring(0, 2).toUpperCase() || "??"}
                  radius="full"
                  style={{ 
                    border: '4px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                  }}
                />
                <Flex direction="column" gap="1">
                  <Heading size="6" weight="bold" style={{ color: 'white' }}>
                    {currentUser.login || "Utilisateur"}
                  </Heading>
                  <Flex align="center" gap="2">
                    <Badge variant="solid" style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white' }} radius="full">
                      <Text size="1" weight="medium">Élo {currentUser.elo_score || 0}</Text>
                    </Badge>
                    <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Rang #{currentUserRank || "?"}</Text>
                  </Flex>
                </Flex>
              </Flex>
              
              {/* Statistiques rapides */}
              <Grid columns="3" gap="3">
                <Card style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Flex direction="column" align="center" gap="1" p="3">
                    <Flex align="center" gap="1">
                      <FaTrophy style={{ color: '#FFD700' }} />
                      <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Victoires</Text>
                    </Flex>
                    <Text size="5" weight="bold" style={{ color: 'white' }}>{wins}</Text>
                  </Flex>
                </Card>
                
                <Card style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Flex direction="column" align="center" gap="1" p="3">
                    <Flex align="center" gap="1">
                      <ClockIcon color="rgba(255, 255, 255, 0.9)" />
                      <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Parties</Text>
                    </Flex>
                    <Text size="5" weight="bold" style={{ color: 'white' }}>{totalMatches}</Text>
                  </Flex>
                </Card>
                
                <Card style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Flex direction="column" align="center" gap="1" p="3">
                    <Flex align="center" gap="1">
                      <FaChartLine style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                      <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Win Rate</Text>
                    </Flex>
                    <Text size="5" weight="bold" style={{ color: 'white' }}>{winRate}%</Text>
                  </Flex>
                </Card>
              </Grid>
            </Flex>
          </Card>
          
          {/* Section principale avec bouton et grille */}
          <Box style={{ 
            marginTop: '16px', 
            marginBottom: '32px',
            position: 'relative'
          }}>
            {/* Bouton principal pour trouver un adversaire */}
            <Box style={{ 
              maxWidth: '800px', 
              margin: '0 auto 48px auto',
              position: 'relative',
              zIndex: 2
            }}>
              <FindOpponentButton onClick={handleFindOpponent} />
            </Box>
            
            <Box style={{ position: 'relative', zIndex: 1 }}>
              <Grid columns={{ initial: "1", md: "2" }} gap="6">
                <Box>
                  {/* RankingList */}
                  <RankingList 
                    topPlayers={topPlayers}
                    currentUser={currentUser}
                    currentUserRank={currentUserRank}
                    onViewAll={handleViewLeaderboard}
                  />
                  {/* MatchHistory */}
                  <MatchHistory 
                    matches={matches}
                    currentUser={currentUser}
                    topPlayers={topPlayers}
                    limit={5}
                  />
                </Box>
              </Grid>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
