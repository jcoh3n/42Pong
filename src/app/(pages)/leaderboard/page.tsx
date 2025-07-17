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
import { MagnifyingGlassIcon, ArrowLeftIcon, StarFilledIcon, Cross2Icon } from "@radix-ui/react-icons";
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

  if (status === "loading" || isLoading) {
    return <LoadingState />;
  }

  return (
    <Box className="min-h-screen w-full relative">
      {/* Container principal centré */}
      <Container size="4" className="relative z-10">
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          className="min-h-screen py-4 px-4 sm:py-8"
          gap={{ initial: "5", sm: "6", md: "8" }}
        >
          
          {/* Titre principal */}
          <Heading 
            size={{ initial: "8", sm: "9" }}
            weight="bold" 
            className="text-white mix-blend-exclusion text-center"
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em',
              marginBottom: '2rem'
            }}
          >
            Classement Global
          </Heading>

          {/* Barre de recherche et position utilisateur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <Card
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                padding: '24px',
              }}
            >
              <Flex direction="column" gap="4">
                {/* Recherche */}
                <Flex gap="3" align="center">
                  <Box className="flex-1">
                    <TextField.Root
                      placeholder="Rechercher un joueur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                      }}
                      className="placeholder:text-white/60"
                    >
                      <TextField.Slot>
                        <MagnifyingGlassIcon width="16" height="16" className="text-white/60" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                  
                  {/* Bouton clear */}
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="2"
                          onClick={() => setSearchQuery("")}
                          style={{
                            color: 'white',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                          }}
                          className="hover:bg-white/20 transition-all duration-200"
                        >
                          <Cross2Icon width="14" height="14" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Flex>

                {/* Position utilisateur et statistiques */}
                <Flex 
                  justify="between" 
                  align="center" 
                  direction={{ initial: "column", sm: "row" }}
                  gap="3"
                >
                  <Text 
                    size="2" 
                    className="text-white/80" 
                    weight="medium"
                  >
                    {filteredUsers.length} joueur{filteredUsers.length > 1 ? 's' : ''}
                  </Text>
                  
                  {currentUserPosition > 0 && (
                    <Box
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Flex align="center" gap="2">
                        <Text 
                          size="1" 
                          className="text-white/70 uppercase tracking-wider" 
                          weight="medium"
                        >
                          Votre rang
                        </Text>
                        <Badge
                          style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(167, 139, 250, 0.8) 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                          }}
                        >
                          #{currentUserPosition}
                        </Badge>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Flex>
            </Card>
          </motion.div>

          {/* Tableau des joueurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-4xl"
          >
            <Card
              style={{
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                overflow: 'hidden',
              }}
            >
              <Box p="4">
                <Flex direction="column" gap="3">
                  {/* En-tête du tableau */}
                  <Flex 
                    justify="between" 
                    align="center" 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingBottom: '12px'
                    }}
                  >
                    <Text 
                      size="3" 
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                    >
                      Meilleurs Joueurs
                    </Text>
                    <StarFilledIcon width="18" height="18" className="text-yellow-400" />
                  </Flex>

                  {/* Liste des joueurs */}
                  <Flex direction="column" gap="2">
                    {filteredUsers.slice(0, 50).map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <Card
                          style={{
                            background: index < 3 
                              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: index < 3 
                              ? '1px solid rgba(255, 215, 0, 0.3)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover:bg-white/10 hover:border-white/20 cursor-pointer"
                        >
                          <Flex align="center" justify="between">
                            <Flex align="center" gap="3">
                              {/* Position */}
                              <Box
                                style={{
                                  minWidth: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: index < 3 
                                    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: index < 3 
                                    ? '1px solid rgba(255, 215, 0, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                              >
                                <Text 
                                  size="2" 
                                  weight="bold" 
                                  className={index < 3 ? "text-yellow-200" : "text-white/80"}
                                >
                                  {index + 1}
                                </Text>
                              </Box>

                              {/* Avatar */}
                              <Avatar
                                size="2"
                                src={user.avatar_url || "https://via.placeholder.com/40"}
                                fallback={user.login?.substring(0, 2).toUpperCase() || "??"}
                                radius="full"
                                style={{
                                  border: '2px solid rgba(255, 255, 255, 0.3)',
                                }}
                              />

                              {/* Nom */}
                              <Text 
                                size="3" 
                                weight="medium" 
                                className="text-white mix-blend-exclusion"
                              >
                                {user.login}
                              </Text>

                              {/* Badge médaille pour le top 3 */}
                              {index < 3 && (
                                <Badge
                                  style={{
                                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </Badge>
                              )}
                            </Flex>

                            {/* Score ELO */}
                            <Box
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '8px',
                                padding: '4px 12px',
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              <Text 
                                size="2" 
                                weight="bold" 
                                className="text-white mix-blend-exclusion font-mono"
                              >
                                {user.elo_score}
                              </Text>
                            </Box>
                          </Flex>
                        </Card>
                      </motion.div>
                    ))}
                  </Flex>
                </Flex>
              </Box>
            </Card>
          </motion.div>

        </Flex>
      </Container>
    </Box>
  );
}
