"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { Box, Container, Flex, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import useUserMatches from "@/hooks/matches/useUserMatches";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RankCard from "@/components/profile/RankCard";
import StatsCard from "@/components/profile/StatsCard";
import MatchHistory from "@/components/home/MatchHistory";
import useCurrentUser from '@/hooks/useCurrentUser';
import PongPaddle from '@/components/PongPaddle/PongPaddle';
import { Match } from "@/services/types";
import { FetchedUser } from "@/services/userService";
// Commenting out for now since we need to create this hook
// import useTopPlayers from '@/hooks/useTopPlayers';

// Composant de chargement réutilisable
const LoadingSpinner = () => (
  <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
    <Container size="3" py="9">
      <Flex align="center" justify="center" style={{ minHeight: "70vh" }}>
        <div className="animate-spin h-6 w-6 border-2 border-gray-900 rounded-full border-t-transparent" />
      </Flex>
    </Container>
  </Box>
);

// Fonction utilitaire pour calculer les statistiques
const calculateStats = (matches: Match[] = [], userId?: string) => {
  const totalMatches = matches.length;
  const wins = matches.filter(match => match.winner_id === userId).length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return { totalMatches, wins, winRate };
};

// Nombre de matchs à charger par page
const MATCHES_PER_PAGE = 10;

export default function Profile() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  // Placeholder for topPlayers until we create the hook
  const topPlayers: FetchedUser[] = [];
  const router = useRouter();
  
  // État pour suivre la pagination
  const [page, setPage] = useState(1);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [hasMoreMatches, setHasMoreMatches] = useState(true);
  
  // Utiliser le hook useUserMatches avec la pagination
  // NOTE: Update this call based on your actual useUserMatches implementation
  const { 
    matches: newMatches, 
    isLoading: isLoadingMatches
  } = useUserMatches(currentUser?.id);

  // Mettre à jour tous les matchs lorsque de nouveaux matchs sont chargés
  React.useEffect(() => {
    if (newMatches && newMatches.length > 0) {
      // Ajouter uniquement les nouveaux matchs qui ne sont pas déjà dans la liste
      setAllMatches(prevMatches => {
        const existingIds = new Set(prevMatches.map(match => match.id));
        const filteredNewMatches = newMatches.filter(match => !existingIds.has(match.id));
        
        // Si on reçoit moins de matches que demandé, on a atteint la fin
        if (filteredNewMatches.length < MATCHES_PER_PAGE) {
          setHasMoreMatches(false);
        }
        
        return [...prevMatches, ...filteredNewMatches];
      });
    } else if (newMatches && newMatches.length === 0) {
      setHasMoreMatches(false);
    }
  }, [newMatches]);

  // Fonction pour charger plus de matchs
  const loadMoreMatches = useCallback(async () => {
    if (!hasMoreMatches || isLoadingMatches) return false;
    
    setPage(prevPage => prevPage + 1);
    // We'll need to modify useUserMatches to accept pagination params 
    // and return whether there are more matches
    return hasMoreMatches;
  }, [hasMoreMatches, isLoadingMatches]);

  // Redirection vers la page d'historique complet
  const handleViewHistory = () => {
    router.push('/match-history');
  };

  // Affichage du chargement
  if (isLoadingUser || (isLoadingMatches && page === 1)) {
    return <PongPaddle />;
  }

  const stats = calculateStats(allMatches, currentUser?.id);

  return (
    <Box style={{ minHeight: "100vh" }}>
      <Container size="3" className="shadow-sm">
        <Flex direction="column" gap="6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            style={{ alignSelf: "flex-start", marginBottom: "1rem" }}
            className="shadow-sm rounded-4xl hover:shadow-md transition-shadow"
          >
            <ArrowLeftIcon width="16" height="16" />
            Back
          </Button>

          {currentUser && (
            <>
              <ProfileHeader user={currentUser} />
              <Flex gap="4" wrap="wrap">
                <Box style={{ flex: "1 1 300px" }}>
                  <RankCard user={currentUser} />
                </Box>
                <Box style={{ flex: "1 1 300px" }}>
                	<StatsCard user={currentUser} stats={stats} />
                </Box>
              </Flex>

              {/* Historique des matchs avec défilement infini */}
              <Box style={{ marginTop: "2rem" }}>
                <MatchHistory 
                  matches={allMatches}
                  currentUser={currentUser}
                  topPlayers={topPlayers}
                  onViewHistory={handleViewHistory}
                  maxDisplayCount={MATCHES_PER_PAGE}
                  isScrollable={true}
                  loadMoreMatches={loadMoreMatches}
                />
              </Box>
            </>
          )}

        </Flex>
      </Container>
    </Box>
  );
} 