"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUsers from "@/hooks/users/useUsers";
import { 
  Container, 
  Heading, 
  Flex, 
  Box, 
  Text,
  Card,
  IconButton,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { GiPingPongBat, GiTrophyCup } from "react-icons/gi";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import Loading from "@/components/Loading";

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const { users, isLoading } = useUsers({
    sortBy: "elo_score",
    sortOrder: "desc",
    pageSize: 100,
  });

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter(user => 
    user.login.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Créer les données du leaderboard
  const leaderboardData = filteredUsers.map((user, index) => ({
    position: index + 1,
    user,
    positionChange: 0,
    changeClass: "neutral"
  }));

  // Trouver la position de l'utilisateur connecté
  const currentUserPosition = users.findIndex(user => user.login === session?.user?.email) + 1;

  if (status === "loading" || isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-[var(--gray-2)]">
        <Loading />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-[var(--gray-2)] pb-8 relative overflow-hidden">
      {/* Éléments décoratifs thématiques - masqués sur mobile */}
      <Box className="hidden md:block absolute -top-[50px] -right-[50px] w-[200px] h-[200px] bg-[var(--accent-9)] rounded-full opacity-10 z-0 rotate-[-15deg]">
        <GiPingPongBat className="w-full h-full text-[var(--accent-9)] opacity-20" />
      </Box>
      <Box className="hidden md:block absolute -bottom-[30px] -left-[30px] w-[150px] h-[150px] bg-[var(--accent-9)] rounded-full opacity-10 z-0 rotate-[15deg]">
        <GiPingPongBat className="w-full h-full text-[var(--accent-9)] opacity-20 scale-x-[-1]" />
      </Box>

      <Container size={{initial: "1", sm: "2", md: "3"}} className="py-4 md:py-6">
        <Flex direction="column" gap="4" className="px-2 sm:px-4 md:px-6">
          {/* En-tête avec titre et recherche */}
          <Card size="2" className="bg-[var(--color-background)] border border-[var(--gray-5)] rounded-2xl">
            <Flex direction="column" gap="4" className="p-4 md:p-6">
              <Flex align="center" gap="3" className="flex-wrap sm:flex-nowrap">
                <GiTrophyCup size={28} className="text-[var(--accent-9)]" />
                <Heading 
                  size={{initial: "5", sm: "6"}} 
                  className="bg-gradient-to-r from-[var(--accent-9)] to-[var(--accent-11)] bg-clip-text text-transparent"
                >
                  Classement Mondial
                </Heading>
              </Flex>
              
              <Flex direction="column" gap="4" className="sm:flex-row sm:items-center">
                <Box className="w-full sm:flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon width="16" height="16" className="text-[var(--gray-9)]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un joueur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--gray-6)] focus:outline-none focus:border-[var(--accent-9)] bg-[var(--color-background)] text-[var(--gray-12)] text-sm transition-colors"
                    />
                  </div>
                </Box>
                
                {currentUserPosition > 0 && (
                  <Box className="w-full sm:w-auto">
                    <Card className="bg-gradient-to-r from-[var(--accent-9)] to-[var(--accent-11)] p-2 sm:px-4 rounded-lg shadow-lg">
                      <Flex align="center" justify="center" gap="2">
                        <Text className="text-white text-sm">Votre position</Text>
                        <Text size="4" weight="bold" className="text-white">
                          #{currentUserPosition}
                        </Text>
                      </Flex>
                    </Card>
                  </Box>
                )}
              </Flex>
            </Flex>
          </Card>

          {/* Tableau principal */}
          <Card size="2" className="w-full bg-[var(--color-background)] border border-[var(--gray-5)] rounded-2xl overflow-hidden shadow-sm">
            <Flex direction="column">
              <Box className="p-4 md:p-6 border-b border-[var(--gray-5)] bg-[var(--color-background)]">
                <Flex justify="between" align="center">
                  <Flex direction="column" gap="1">
                    <Text size="2" color="gray" className="text-sm">
                      {filteredUsers.length} joueurs classés
                    </Text>
                  </Flex>
                </Flex>
              </Box>

              <Box className="overflow-hidden">
                <LeaderboardTable data={leaderboardData} />
              </Box>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
}
