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
  Button,
  TextField,
  Avatar,
  Badge,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon, Cross2Icon, StarFilledIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingState } from "@/components/home";

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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

  // Trouver la position de l'utilisateur connecté
  const currentUserPosition = users.findIndex(user => user.login === session?.user?.email) + 1;

  const handleGoBack = () => router.back();

  // Fonction pour obtenir le style du top 3
  const getTopPlayerStyle = (index: number) => {
    switch (index) {
      case 0: // 1er place - Or
        return {
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          rankBackground: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
          rankColor: '#000',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
        };
      case 1: // 2e place - Argent
        return {
          background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(158, 158, 158, 0.08) 100%)',
          border: '1px solid rgba(192, 192, 192, 0.4)',
          rankBackground: 'linear-gradient(135deg, #C0C0C0 0%, #9E9E9E 100%)',
          rankColor: '#000',
          textShadow: '0 0 10px rgba(192, 192, 192, 0.3)',
        };
      case 2: // 3e place - Bronze
        return {
          background: 'linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(184, 115, 51, 0.08) 100%)',
          border: '1px solid rgba(205, 127, 50, 0.4)',
          rankBackground: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
          rankColor: '#000',
          textShadow: '0 0 10px rgba(205, 127, 50, 0.3)',
        };
      default:
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          rankBackground: 'rgba(255, 255, 255, 0.1)',
          rankColor: '#ffffff',
          textShadow: 'none',
        };
    }
  };

  if (status === "loading" || isLoading) {
    return <LoadingState />;
  }

  return (
    <Box className="h-full w-full relative">
      <Container size="4" className="relative z-10">
        <Flex 
          direction="column" 
          align="center" 
          justify="start" 
          className="h-full py-4 px-4 sm:py-8"
          gap={{ initial: "4", sm: "6" }}
        >
          
          {/* Titre principal amélioré */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <Flex direction="column" align="center" gap="2">
              <StarFilledIcon width="32" height="32" className="text-yellow-400 mb-2" />
              <Heading 
                size="8"
                weight="bold" 
                className="text-white"
                style={{ 
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.02em',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
                }}
              >
                Classement
              </Heading>
              <Text 
                size="3" 
                className="text-white/60"
                style={{ 
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                Les meilleurs joueurs
              </Text>
            </Flex>
          </motion.div>

          {/* Barre de recherche simplifiée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <Box className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
              <Flex gap="3" align="center">
                <Box className="flex-1">
                  <TextField.Root
                    placeholder="Rechercher un joueur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon width="16" height="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Box>
                
                {searchQuery && (
                  <Button
                    variant="ghost"
                    onClick={() => setSearchQuery("")}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  >
                    <Cross2Icon width="14" height="14" />
                  </Button>
                )}
              </Flex>
              
              {/* Statistiques discrètes */}
              <Flex justify="between" align="center" className="mt-3 pt-3 border-t border-white/10">
                <Text size="2" className="text-white/60">
                  {filteredUsers.length} joueur{filteredUsers.length > 1 ? 's' : ''}
                </Text>
                
                {currentUserPosition > 0 && (
                  <Text size="2" className="text-white/60">
                    Votre rang : <span className="text-blue-400 font-medium">#{currentUserPosition}</span>
                  </Text>
                )}
              </Flex>
            </Box>
          </motion.div>

          {/* Liste des joueurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl"
          >
            <Flex direction="column" gap="2">
              {filteredUsers.slice(0, 50).map((user, index) => {
                const style = getTopPlayerStyle(index);
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Box
                      style={{
                        background: style.background,
                        border: style.border,
                        borderRadius: '12px',
                        padding: '16px',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s ease',
                      }}
                      className="hover:bg-white/10 hover:border-white/20 cursor-pointer"
                    >
                      <Flex align="center" justify="between">
                        <Flex align="center" gap="4">
                          {/* Position avec style amélioré */}
                          <Box
                            style={{
                              minWidth: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: style.rankBackground,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: index < 3 ? '2px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)',
                              boxShadow: index < 3 ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
                            }}
                          >
                            <Text 
                              size="3" 
                              weight="bold" 
                              style={{ 
                                color: style.rankColor,
                                textShadow: style.textShadow,
                              }}
                            >
                              {index + 1}
                            </Text>
                          </Box>

                          {/* Avatar */}
                          <Avatar
                            size="3"
                            src={user.avatar_url || "https://via.placeholder.com/40"}
                            fallback={user.login?.substring(0, 2).toUpperCase() || "??"}
                            radius="full"
                            style={{
                              border: index < 3 ? '3px solid rgba(255, 255, 255, 0.4)' : '2px solid rgba(255, 255, 255, 0.2)',
                              boxShadow: index < 3 ? '0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                            }}
                          />

                          {/* Nom et médaille */}
                          <Flex direction="column" gap="1">
                            <Text 
                              size="4" 
                              weight="medium" 
                              className="text-white"
                              style={{ 
                                textShadow: index < 3 ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none',
                              }}
                            >
                              {user.login}
                            </Text>
                          </Flex>
                        </Flex>

                        {/* Score ELO */}
                        <Box
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            backdropFilter: 'blur(8px)',
                          }}
                        >
                          <Text 
                            size="3" 
                            weight="bold" 
                            className="text-white font-mono"
                          >
                            {user.elo_score}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </motion.div>
                );
              })}
            </Flex>
          </motion.div>

        </Flex>
      </Container>
    </Box>
  );
}
