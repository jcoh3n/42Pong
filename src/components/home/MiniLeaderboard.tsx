import React from 'react';
import { Box, Flex, Text, Avatar, Card, Button } from '@radix-ui/themes';
import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { FetchedUser } from '@/services/userService';

interface MiniLeaderboardProps {
  topPlayers: FetchedUser[];
  currentUser: any;
  currentUserRank: number;
  onViewAll: () => void;
}

const MiniLeaderboard: React.FC<MiniLeaderboardProps> = ({
  topPlayers,
  currentUser,
  currentUserRank,
  onViewAll
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaCrown size={16} color="#FFD700" />;
      case 2:
        return <FaMedal size={14} color="#C0C0C0" />;
      case 3:
        return <FaMedal size={14} color="#CD7F32" />;
      default:
        return (
          <Text size={{ initial: "2", sm: "3" }} weight="bold" className="text-white/70">
            #{rank}
          </Text>
        );
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%)';
      case 2:
        return 'linear-gradient(135deg, rgba(192, 192, 192, 0.2) 0%, rgba(169, 169, 169, 0.1) 100%)';
      case 3:
        return 'linear-gradient(135deg, rgba(205, 127, 50, 0.2) 0%, rgba(184, 115, 51, 0.1) 100%)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="w-full"
    >
      <Card
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
      >
        <Box p={{ initial: "4", sm: "5", md: "6" }}>
          {/* En-tête - toujours horizontal */}
          <Flex 
            align="center" 
            justify="between" 
            mb={{ initial: "3", sm: "4" }}
          >
            <Flex align="center" gap={{ initial: "2", sm: "3" }}>
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Box
                  style={{
                    padding: '6px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <FaTrophy size={16} color="white" />
                </Box>
              </motion.div>
              <Text 
                size={{ initial: "4", sm: "5" }}
                weight="bold" 
                className="text-white mix-blend-exclusion"
              >
                Top 5
              </Text>
            </Flex>
            
            <Button
              variant="ghost"
              size="1"
              onClick={onViewAll}
              style={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '6px 8px',
                minWidth: 'auto',
              }}
              className="hover:bg-white/20 transition-all duration-200"
            >
              <Flex align="center" gap="1">
                <Text 
                  size={{ initial: "1", sm: "2" }} 
                  weight="medium"
                  className="hidden xs:block"
                >
                  Voir tout
                </Text>
                <Text 
                  size="1" 
                  weight="medium"
                  className="block xs:hidden"
                >
                  Tout
                </Text>
                <CaretRightIcon 
                  width="12" 
                  height="12" 
                  className="ml-0.5"
                />
              </Flex>
            </Button>
          </Flex>

          {/* Liste des joueurs */}
          <Flex direction="column" gap={{ initial: "2", sm: "3" }}>
            {topPlayers.map((player, index) => {
              const rank = index + 1;
              const isCurrentUser = player.id === currentUser?.id;
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card
                    style={{
                      background: isCurrentUser 
                        ? 'rgba(96, 165, 250, 0.2)' 
                        : getRankGradient(rank),
                      border: isCurrentUser 
                        ? '1px solid rgba(96, 165, 250, 0.4)' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '14px',
                      padding: '10px',
                      transition: 'all 0.2s ease',
                    }}
                    className="hover:bg-white/10"
                  >
                    <Flex align="center" gap={{ initial: "2", sm: "3" }}>
                      {/* Rang */}
                      <Box
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getRankIcon(rank)}
                      </Box>

                      {/* Avatar */}
                      <Avatar
                        size={{ initial: "2", sm: "3" }}
                        src={player.avatar_url || "https://via.placeholder.com/40"}
                        fallback={player.login?.substring(0, 2).toUpperCase() || "??"}
                        radius="full"
                        style={{
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />

                      {/* Informations joueur */}
                      <Flex direction="column" className="flex-1 min-w-0">
                        <Text 
                          size={{ initial: "2", sm: "3" }}
                          weight="bold" 
                          className="text-white mix-blend-exclusion truncate"
                        >
                          {player.login}
                          {isCurrentUser && (
                            <Text 
                              size="1" 
                              className="ml-1 text-blue-300"
                              style={{ fontStyle: 'italic' }}
                            >
                              (Vous)
                            </Text>
                          )}
                        </Text>
                        <Text 
                          size={{ initial: "1", sm: "2" }}
                          className="text-white/70"
                        >
                          {player.elo_score} ELO
                        </Text>
                      </Flex>

                      {/* Changement de rang (optionnel) */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + 0.1 * index }}
                      >
                        <Box
                          style={{
                            padding: '3px 6px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <Text size="1" className="text-white/60">
                            #{rank}
                          </Text>
                        </Box>
                      </motion.div>
                    </Flex>
                  </Card>
                </motion.div>
              );
            })}
          </Flex>

          {/* Votre position si pas dans le top 5 */}
          {currentUserRank > 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Box
                style={{
                  marginTop: '12px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(96, 165, 250, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                }}
              >
                <Text 
                  size={{ initial: "1", sm: "2" }}
                  className="text-blue-200 text-center block"
                  style={{ fontStyle: 'italic' }}
                >
                  Votre position: #{currentUserRank}
                </Text>
              </Box>
            </motion.div>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default MiniLeaderboard; 