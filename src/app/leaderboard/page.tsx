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
  Badge,
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
    <Box className="min-h-screen bg-[#0F172A]">
      <Container size="3" className="py-6">
        <Flex direction="column" gap="4">
          <Card size="2" className="bg-[#1E293B] border-none rounded-xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] opacity-[0.02]" />
              
              <Flex direction="column" gap="4" className="p-4">
                <Flex align="center" gap="3" className="flex-wrap sm:flex-nowrap">
                  <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] shadow-lg transform hover:scale-105 transition-transform">
                    <GiPingPongBat size={24} className="text-[#0F172A] transform hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <Flex align="baseline" gap="2">
                      <Text size="6" weight="bold" className="text-white">
                        42 Pong
                      </Text>
                      <Text size="2" className="text-[#94A3B8] tracking-wide uppercase">
                        Leaderboard
                      </Text>
                    </Flex>
                  </div>
                </Flex>
                
                <Flex direction="column" gap="3" className="sm:flex-row sm:items-center">
                  <Box className="w-full sm:flex-1">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon width="14" height="14" className="text-[#94A3B8] group-hover:text-[#0EA5E9] transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher un joueur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#334155] bg-[#0F172A] text-white transition-all duration-200 
                          focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] focus:ring-opacity-50
                          placeholder-[#64748B] group-hover:border-[#94A3B8]"
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity" />
                    </div>
                  </Box>
                  
                  {currentUserPosition > 0 && (
                    <Box className="w-full sm:w-auto">
                      <Card className="bg-[#0F172A] border border-[#334155] rounded-lg overflow-hidden group hover:border-[#0EA5E9] transition-colors">
                        <Flex align="center" justify="center" gap="3" className="py-2 px-4">
                          <Text className="text-[#94A3B8] text-sm group-hover:text-[#0EA5E9] transition-colors">
                            Votre rang
                          </Text>
                          <div className="px-2 py-1 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-md shadow-sm group-hover:shadow-md transition-shadow">
                            <Text size="3" weight="bold" className="text-[#0F172A] font-mono">
                              #{currentUserPosition}
                            </Text>
                          </div>
                        </Flex>
                      </Card>
                    </Box>
                  )}
                </Flex>
              </Flex>
            </div>
          </Card>

          {/* Tableau principal */}
          <Card size="2" className="w-full bg-[#1E293B] border-none rounded-xl overflow-hidden">
            <Flex direction="column">
              <Box className="px-4 py-3 border-b border-[#334155]">
                <Flex justify="between" align="center">
                  <Flex gap="2" align="center">
                    <Text size="1" className="text-[#94A3B8] uppercase tracking-wider font-medium">
                      Classement
                    </Text>
                    <Badge variant="surface" className="bg-[#0F172A] text-[#94A3B8] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors">
                      {filteredUsers.length}
                    </Badge>
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
