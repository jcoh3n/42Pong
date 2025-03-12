'use client';

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import React, { useEffect, useState } from "react";
import MatchmakingMenu from "@/components/matchmaking/MatchmakingMenu";
import MatchPage from "@/components/match/MatchPage";
import useCurrentMatch from "@/hooks/matchmaking/useCurrentMatch";

<<<<<<< HEAD
import { 
  Box, 
  Container, 
  Heading, 
  Text,
  Card,
  Button,
  Flex,
  Avatar,
} from "@radix-ui/themes";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { GiPingPongBat, GiTrophy } from 'react-icons/gi';
import { FaUserFriends } from 'react-icons/fa';
import { RiComputerLine } from 'react-icons/ri';

export default function GamePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isInQueue, setIsInQueue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waitTime, setWaitTime] = useState(0);

  // Gérer le Quick Match
  const handleQuickMatch = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    if (isInQueue) {
      setIsInQueue(false);
      setWaitTime(0);
    } else {
      setIsInQueue(true);
    }
    setIsLoading(false);
  };

  // Timer pour le temps d'attente
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInQueue) {
      interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInQueue]);

  // Formater le temps d'attente
  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Container size="3" py="9">
        <Flex direction="column" gap="6">
          {/* Header */}
          <div className="space-y-2">
            <Heading size="8" style={{ color: 'white' }}>Game Center</Heading>
            <Text size="2" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Choose your game mode and start playing
            </Text>
          </div>

          {/* Game Modes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Match Card */}
            <Card className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 border-none hover:shadow-xl transition-all duration-300">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="3">
                  <Box className="p-3 bg-white/10 rounded-xl">
                    <GiPingPongBat size={24} color="white" />
                  </Box>
                  <div>
                    <Heading size="4" style={{ color: 'white' }}>Quick Match</Heading>
                    <Text size="2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {isInQueue 
                        ? `Searching... (${formatWaitTime(waitTime)})` 
                        : "Find an opponent instantly"}
                    </Text>
                  </div>
                </Flex>

                <Button 
                  size="3"
                  variant={isInQueue ? "soft" : "solid"}
                  style={{
                    background: isInQueue ? 'rgba(255,255,255,0.2)' : 'white',
                    color: isInQueue ? 'white' : '#059669',
                  }}
                  disabled={isLoading}
                  onClick={handleQuickMatch}
                >
                  {isLoading 
                    ? "Loading..." 
                    : isInQueue 
                      ? "Cancel Search" 
                      : "Play Now"}
                </Button>

                {isInQueue && (
                  <Flex gap="2" className="animate-pulse">
                    <Avatar
                      size="2"
                      src={session?.user?.image || ""}
                      fallback={session?.user?.name?.[0] || "?"}
                    />
                    <Text size="2" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      Searching for an opponent...
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Card>

            {/* Challenge Friend Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 border-none hover:shadow-xl transition-all duration-300">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="3">
                  <Box className="p-3 bg-white/10 rounded-xl">
                    <FaUserFriends size={24} color="white" />
                  </Box>
                  <div>
                    <Heading size="4" style={{ color: 'white' }}>Challenge Friend</Heading>
                    <Text size="2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Send a challenge to a specific player
                    </Text>
                  </div>
                </Flex>
                <Button size="3" variant="solid" style={{ background: 'white', color: '#2563eb' }}>
                  Challenge
                </Button>
              </Flex>
            </Card>

            {/* Tournament Card */}
            <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 border-none hover:shadow-xl transition-all duration-300">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="3">
                  <Box className="p-3 bg-white/10 rounded-xl">
                    <GiTrophy size={24} color="white" />
                  </Box>
                  <div>
                    <Heading size="4" style={{ color: 'white' }}>Tournament</Heading>
                    <Text size="2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Compete in organized tournaments
                    </Text>
                  </div>
                </Flex>
                <Button size="3" variant="solid" style={{ background: 'white', color: '#d97706' }}>
                  Coming Soon
                </Button>
              </Flex>
            </Card>

            {/* Practice Mode Card */}
            <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 border-none hover:shadow-xl transition-all duration-300">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="3">
                  <Box className="p-3 bg-white/10 rounded-xl">
                    <RiComputerLine size={24} color="white" />
                  </Box>
                  <div>
                    <Heading size="4" style={{ color: 'white' }}>Practice Mode</Heading>
                    <Text size="2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Train against AI opponents
                    </Text>
                  </div>
                </Flex>
                <Button size="3" variant="solid" style={{ background: 'white', color: '#7c3aed' }}>
                  Start Practice
                </Button>
              </Flex>
            </Card>
          </div>
        </Flex>
      </Container>
    </Box>
  );
} 
=======

export default function GamePage() {
	const matchmakingData = useMatchmaking();
	const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

	useEffect(() => {
		if (matchmakingData.data?.data?.inMatch) {
			setCurrentMatchId(matchmakingData.data?.data?.matchData?.id || null);
		}

	}, [matchmakingData.data?.data?.inMatch, matchmakingData.data?.data?.matchData?.id]);

	const onCurrentMatchLeave = () => {
		setCurrentMatchId(null);
	}

	if (currentMatchId) {
		return <MatchPage matchId={currentMatchId} onLeave={onCurrentMatchLeave} />;
	} else if (matchmakingData.data?.data?.inQueue) {
		// return queue page
	} else {
		// return matchmaking menu
	}

	return <MatchmakingMenu />;
}
>>>>>>> dev
