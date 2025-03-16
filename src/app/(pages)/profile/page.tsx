"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Box, Container, Flex, Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import useUserMatches from "@/hooks/matches/useUserMatches";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RankCard from "@/components/profile/RankCard";
import StatsCard from "@/components/profile/StatsCard";
import useCurrentUser from '@/hooks/useCurrentUser';
import PongPaddle from '@/components/PongPaddle/PongPaddle';

interface Match {
  winner_id: string | null;
}

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

export default function Profile() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const router = useRouter();
  const { matches, isLoading: isLoadingMatches } = useUserMatches(currentUser?.id);

  // Affichage du chargement
  if (isLoadingUser || isLoadingMatches) {
    return <PongPaddle />;
  }

  const stats = calculateStats(matches, currentUser?.id);

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
            </>
          )}

        </Flex>
      </Container>
    </Box>
  );
} 