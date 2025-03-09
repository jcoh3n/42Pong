"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Container, Flex } from "@radix-ui/themes";
import useUser from "@/hooks/users/useUser";
import useUserMatches from "@/hooks/matches/useUserMatches";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RankCard from "@/components/profile/RankCard";
import StatsCard from "@/components/profile/StatsCard";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = session?.user?.login;
  const { user: currentUser, isLoading: isLoadingUser } = useUser(userId);
  const { matches, isLoading: isLoadingMatches } = useUserMatches(currentUser?.id);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Show loading state
  if (status === "loading" || isLoadingUser || isLoadingMatches) {
    return (
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Container size="3" py="9">
          <Flex align="center" justify="center" style={{ minHeight: "70vh" }}>
            <div className="animate-spin h-6 w-6 border-2 border-gray-900 rounded-full border-t-transparent"></div>
          </Flex>
        </Container>
      </Box>
    );
  }

  // Calculate stats
  const totalMatches = matches?.length || 0;
  const wins = matches?.filter(match => match.winner_id === currentUser?.id).length || 0;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  const stats = {
    totalMatches,
    wins,
    winRate
  };

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
      <Container size="3" py="9">
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
            </>
          )}
        </Flex>
      </Container>
    </Box>
  );
} 