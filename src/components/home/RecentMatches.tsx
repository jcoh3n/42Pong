import React from 'react';
import { Box, Flex, Text, Avatar, Card, Button, Badge } from '@radix-ui/themes';
import { FaTrophy, FaRegSadTear, FaClock, FaHistory } from 'react-icons/fa';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { Match } from '@/services/matchService';
import { FetchedUser } from '@/services/userService';

interface RecentMatchesProps {
  matches: Match[];
  currentUser: FetchedUser | null;
  topPlayers: FetchedUser[];
  onViewAll: () => void;
}

const RecentMatches: React.FC<RecentMatchesProps> = ({
  matches,
  currentUser,
  topPlayers,
  onViewAll
}) => {
  const getMatchResult = (match: Match) => {
    if (!match || !currentUser) return { 
      result: "Inconnu", 
      color: "rgba(255, 255, 255, 0.7)", 
      icon: null
    };

    if (match.winner_id === currentUser.id) {
      return {
        result: "Victoire",
        color: "#4ade80",
        icon: <FaTrophy size={12} color="#4ade80" />
      };
    } else {
      return {
        result: "Défaite",
        color: "#f87171",
        icon: <FaRegSadTear size={12} color="#f87171" />
      };
    }
  };

  const getOpponent = (match: Match) => {
    if (!currentUser) return null;
    
    const opponentId = match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
    return topPlayers.find(player => player.id === opponentId) || null;
  };

  const getUserScore = (match: Match) => {
    if (!currentUser) return 0;
    return match.user_1_id === currentUser.id ? match.user_1_score : match.user_2_score;
  };

  const getOpponentScore = (match: Match) => {
    if (!currentUser) return 0;
    return match.user_1_id === currentUser.id ? match.user_2_score : match.user_1_score;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'ranked':
        return 'linear-gradient(135deg, #3B82F6, #1E40AF)';
      case 'friendly':
        return 'linear-gradient(135deg, #F59E0B, #D97706)';
      case 'normal':
      default:
        return 'linear-gradient(135deg, #10B981, #059669)';
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'ranked':
        return 'Ranked';
      case 'friendly':
        return 'Amical';
      case 'normal':
      default:
        return 'Rapide';
    }
  };

  const getMatchType = (match: Match) => {
    return match.match_type || match.type || 'normal';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
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
                whileHover={{ rotate: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Box
                  style={{
                    padding: '6px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <FaHistory size={16} color="white" />
                </Box>
              </motion.div>
              <Text 
                size={{ initial: "4", sm: "5" }}
                weight="bold" 
                className="text-white mix-blend-exclusion"
              >
                Récents
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
                  Historique
                </Text>
                <Text 
                  size="1" 
                  weight="medium"
                  className="block xs:hidden"
                              >
                    Historique
                </Text>
                <CaretRightIcon 
                  width="12" 
                  height="12" 
                  className="ml-0.5"
                />
              </Flex>
            </Button>
          </Flex>

          {/* Liste des matchs */}
          {matches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                }}
              >
                <FaClock size={24} className="text-white/30 mx-auto mb-2" />
                <Text size={{ initial: "2", sm: "3" }} className="text-white/70 block mb-1">
                  Aucun match récent
                </Text>
                <Text size={{ initial: "1", sm: "2" }} className="text-white/50">
                  Lancez votre première partie !
                </Text>
              </Card>
            </motion.div>
          ) : (
            <Flex direction="column" gap={{ initial: "2", sm: "3" }}>
              {matches.slice(0, 5).map((match, index) => {
                const result = getMatchResult(match);
                const opponent = getOpponent(match);
                const userScore = getUserScore(match);
                const opponentScore = getOpponentScore(match);
                const matchType = getMatchType(match);
                
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        padding: '12px',
                        transition: 'all 0.2s ease',
                      }}
                      className="hover:bg-white/10 cursor-pointer"
                    >
                      <Flex 
                        align="center" 
                        gap={{ initial: "2", sm: "3" }}
                        direction={{ initial: "column", sm: "row" }}
                        className="sm:flex-row"
                      >
                        {/* Première ligne mobile: Avatar + nom + badge */}
                        <Flex 
                          align="center" 
                          gap="2" 
                          className="w-full sm:flex-1"
                        >
                          {/* Avatar adversaire */}
                          <Avatar
                            size={{ initial: "1", sm: "2" }}
                            src={opponent?.avatar_url || "https://via.placeholder.com/32"}
                            fallback={opponent?.login?.substring(0, 2).toUpperCase() || "??"}
                            radius="full"
                            style={{
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          />

                          {/* Informations du match */}
                          <Flex direction="column" className="flex-1 min-w-0">
                            <Flex align="center" gap="2" mb="1">
                              <Text 
                                size={{ initial: "2", sm: "3" }}
                                weight="medium" 
                                className="text-white truncate"
                              >
                                vs {opponent?.login || "Inconnu"}
                              </Text>
                              <Badge
                                variant="solid"
                                size="1"
                                style={{
                                  background: getMatchTypeColor(matchType),
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '0.6rem',
                                  padding: '2px 6px',
                                }}
                              >
                                {getMatchTypeLabel(matchType)}
                              </Badge>
                            </Flex>
                            
                            <Flex align="center" gap="1">
                              <FaClock size={8} className="text-white/50" />
                              <Text size="1" className="text-white/50">
                                {formatDate(match.created_at)}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>

                        {/* Deuxième ligne mobile: Score + Résultat */}
                        <Flex 
                          align="center" 
                          justify="between" 
                          className="w-full sm:w-auto"
                          gap="3"
                        >
                          {/* Score */}
                          <Flex direction="column" align="center">
                            <Text 
                              size={{ initial: "3", sm: "4" }}
                              weight="bold" 
                              className="text-white"
                            >
                              {userScore}-{opponentScore}
                            </Text>
                          </Flex>

                          {/* Résultat */}
                          <Flex 
                            align="center" 
                            gap="1" 
                            style={{ minWidth: '60px' }}
                            justify="center"
                          >
                            {result.icon}
                            <Text 
                              size={{ initial: "1", sm: "2" }}
                              weight="medium" 
                              style={{ color: result.color }}
                            >
                              {result.result}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </motion.div>
                );
              })}
            </Flex>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default RecentMatches; 