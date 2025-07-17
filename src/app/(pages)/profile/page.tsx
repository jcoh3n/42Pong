"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Box, Container, Flex, Button, Grid, Card, Text, Heading } from "@radix-ui/themes";
import { ArrowLeftIcon, ClockIcon } from "@radix-ui/react-icons";
import { FaTrophy, FaChartLine, FaHistory } from 'react-icons/fa';
import useUserMatches from "@/hooks/matches/useUserMatches";
import useUsers from "@/hooks/users/useUsers";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RankCard from "@/components/profile/RankCard";
import StatsCard from "@/components/profile/StatsCard";
import { MatchHistory } from "@/components/home";
import useCurrentUser from '@/hooks/useCurrentUser';
import PongPaddle from '@/components/PongPaddle/PongPaddle';

interface Match {
  winner_id: string | null;
  user_1_id: string;
  user_2_id: string;
  user_1_score: number;
  user_2_score: number;
}

function calculateStats(matches: Match[], userId: string | undefined) {
  if (!userId || !matches || matches.length === 0) {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
    };
  }

  const totalMatches = matches.length;
  const wins = matches.filter((match) => match.winner_id === userId).length;
  const losses = totalMatches - wins;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  return {
    totalMatches,
    wins,
    losses,
    winRate,
  };
}

export default function Profile() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const router = useRouter();
  const { matches, isLoading: isLoadingMatches } = useUserMatches(currentUser?.id);
  const { users: topPlayers = [], isLoading: isLoadingUsers } = useUsers({ 
    page: 1, 
    pageSize: 10, 
    sortBy: 'elo_score', 
    sortOrder: 'desc' 
  });

  // Affichage du chargement
  if (isLoadingUser || isLoadingMatches || isLoadingUsers) {
    return <PongPaddle />;
  }

  const stats = calculateStats(matches, currentUser?.id);
  const handleViewHistory = () => router.push('/games/history');

  return (
    <Box style={{ minHeight: "100vh" }}>
      <Container size="3" className="shadow-sm">
        <Flex direction="column" gap="6">
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

              {/* Historique des matchs */}
              <MatchHistory 
                matches={matches} // Limiter à 8 matchs récents
                currentUser={currentUser}
                topPlayers={topPlayers}
              />
            </>
          )}

        </Flex>
      </Container>
    </Box>
  );
} 