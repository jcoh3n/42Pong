import React from 'react';
import { Box, Flex, Text, Card, Avatar, Badge } from '@radix-ui/themes';
import { motion } from 'framer-motion';

interface ProfileMatchAnalysisProps {
  matches: any[];
  currentUser: any;
  topPlayers: any[];
  advancedStats: any;
}

const ProfileMatchAnalysis: React.FC<ProfileMatchAnalysisProps> = ({
  matches,
  currentUser,
  topPlayers,
  advancedStats
}) => {
  // Analyser les adversaires les plus fréquents
  const getFrequentOpponents = () => {
    if (!matches || matches.length === 0) return [];
    
    const opponentStats = new Map();
    
    matches.forEach((match) => {
      const opponentId = match.user_1_id === currentUser?.id ? match.user_2_id : match.user_1_id;
      const opponent = topPlayers.find(p => p.id === opponentId);
      
      if (opponent) {
        if (!opponentStats.has(opponentId)) {
          opponentStats.set(opponentId, {
            opponent,
            total: 0,
            wins: 0,
            losses: 0,
            scoreFor: 0,
            scoreAgainst: 0
          });
        }
        
        const stats = opponentStats.get(opponentId);
        stats.total++;
        
        const isWin = match.winner_id === currentUser?.id;
        const userScore = match.user_1_id === currentUser?.id ? match.user_1_score : match.user_2_score;
        const opponentScore = match.user_1_id === currentUser?.id ? match.user_2_score : match.user_1_score;
        
        stats.scoreFor += userScore;
        stats.scoreAgainst += opponentScore;
        
        if (isWin) {
          stats.wins++;
        } else {
          stats.losses++;
        }
      }
    });
    
    return Array.from(opponentStats.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };
  
  // Analyser les patterns de temps (simulation)
  const getTimePatterns = () => {
    if (!matches || matches.length === 0) return {};
    
    const hourStats = new Array(24).fill(0).map(() => ({ wins: 0, losses: 0 }));
    const dayStats = new Array(7).fill(0).map(() => ({ wins: 0, losses: 0 }));
    
    matches.forEach((match) => {
      const date = new Date(match.created_at || match.date);
      const hour = date.getHours();
      const day = date.getDay();
      const isWin = match.winner_id === currentUser?.id;
      
      if (isWin) {
        hourStats[hour].wins++;
        dayStats[day].wins++;
      } else {
        hourStats[hour].losses++;
        dayStats[day].losses++;
      }
    });
    
    // Trouver les meilleures heures
    const bestHours = hourStats
      .map((stats, hour) => {
        const total = stats.wins + stats.losses;
        return {
          hour,
          winRate: total > 0 ? Math.round((stats.wins / total) * 100) : 0,
          total
        };
      })
      .filter(h => h.total >= 2)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3);
    
    // Trouver les meilleurs jours
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const bestDays = dayStats
      .map((stats, day) => {
        const total = stats.wins + stats.losses;
        return {
          day: dayNames[day],
          winRate: total > 0 ? Math.round((stats.wins / total) * 100) : 0,
          total
        };
      })
      .filter(d => d.total >= 2)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3);
    
    return { bestHours, bestDays };
  };
  
  const frequentOpponents = getFrequentOpponents();
  const timePatterns = getTimePatterns();
  
  if (!matches || matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-6xl"
      >
        <Card
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <Text size="4" className="text-white/60">
            🎯 Pas assez de données pour l'analyse des matchs
          </Text>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-6xl"
    >
      <Flex direction="column" gap="6">
        {/* Adversaires fréquents */}
        {frequentOpponents.length > 0 && (
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
              <Text 
                size="4" 
                weight="bold" 
                className="text-white mix-blend-exclusion"
              >
                🎯 Adversaires Fréquents
              </Text>
              
              <Flex direction="column" gap="3">
                {frequentOpponents.map((data, index) => {
                  const winRate = Math.round((data.wins / data.total) * 100);
                  const avgScoreFor = Math.round(data.scoreFor / data.total);
                  const avgScoreAgainst = Math.round(data.scoreAgainst / data.total);
                  
                  return (
                    <motion.div
                      key={data.opponent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          transition: 'all 0.2s ease',
                        }}
                        className="hover:bg-white/10"
                      >
                        <Flex align="center" justify="between">
                          <Flex align="center" gap="3">
                            <Avatar
                              size="3"
                              src={data.opponent.avatar_url}
                              fallback={data.opponent.login?.substring(0, 2).toUpperCase()}
                              radius="full"
                            />
                            
                            <Flex direction="column" gap="1">
                              <Text size="3" weight="medium" className="text-white">
                                {data.opponent.login}
                              </Text>
                              <Text size="1" className="text-white/60">
                                {data.total} match{data.total > 1 ? 's' : ''}
                              </Text>
                            </Flex>
                          </Flex>
                          
                          <Flex align="center" gap="4">
                            <Box className="text-center">
                              <Text size="1" className="text-white/60 block">W-L</Text>
                              <Text size="2" weight="bold" className="text-white">
                                {data.wins}-{data.losses}
                              </Text>
                            </Box>
                            
                            <Box className="text-center">
                              <Text size="1" className="text-white/60 block">Win Rate</Text>
                              <Badge
                                style={{
                                  backgroundColor: winRate >= 60 ? '#22c55e' : winRate >= 40 ? '#f59e0b' : '#ef4444',
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                              >
                                {winRate}%
                              </Badge>
                            </Box>
                            
                            <Box className="text-center">
                              <Text size="1" className="text-white/60 block">Score Moyen</Text>
                              <Text size="2" weight="bold" className="text-white font-mono">
                                {avgScoreFor}-{avgScoreAgainst}
                              </Text>
                            </Box>
                          </Flex>
                        </Flex>
                      </Card>
                    </motion.div>
                  );
                })}
              </Flex>
            </Flex>
          </Card>
        )}
        
        {/* Patterns de temps */}
        {(timePatterns.bestHours && timePatterns.bestHours.length > 0 || timePatterns.bestDays && timePatterns.bestDays.length > 0) && (
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
              <Text 
                size="4" 
                weight="bold" 
                className="text-white mix-blend-exclusion"
              >
                ⏰ Patterns de Performance
              </Text>
              
              <Flex 
                direction={{ initial: "column", md: "row" }}
                gap="6"
              >
                {/* Meilleures heures */}
                {timePatterns.bestHours?.length > 0 && (
                  <Box className="flex-1">
                    <Text size="3" weight="medium" className="text-white mb-3 block">
                      Meilleures Heures
                    </Text>
                    <Flex direction="column" gap="2">
                      {timePatterns.bestHours.map((hour, index) => (
                        <motion.div
                          key={hour.hour}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Flex align="center" justify="between" className="py-2">
                            <Text size="2" className="text-white">
                              {hour.hour}h - {hour.hour + 1}h
                            </Text>
                            <Flex align="center" gap="2">
                              <Badge
                                style={{
                                  backgroundColor: hour.winRate >= 70 ? '#22c55e' : hour.winRate >= 50 ? '#f59e0b' : '#ef4444',
                                  color: 'white',
                                  fontSize: '12px',
                                }}
                              >
                                {hour.winRate}%
                              </Badge>
                              <Text size="1" className="text-white/60">
                                ({hour.total} matchs)
                              </Text>
                            </Flex>
                          </Flex>
                        </motion.div>
                      ))}
                    </Flex>
                  </Box>
                )}
                
                {/* Meilleurs jours */}
                {timePatterns.bestDays?.length > 0 && (
                  <Box className="flex-1">
                    <Text size="3" weight="medium" className="text-white mb-3 block">
                      Meilleurs Jours
                    </Text>
                    <Flex direction="column" gap="2">
                      {timePatterns.bestDays.map((day, index) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Flex align="center" justify="between" className="py-2">
                            <Text size="2" className="text-white">
                              {day.day}
                            </Text>
                            <Flex align="center" gap="2">
                              <Badge
                                style={{
                                  backgroundColor: day.winRate >= 70 ? '#22c55e' : day.winRate >= 50 ? '#f59e0b' : '#ef4444',
                                  color: 'white',
                                  fontSize: '12px',
                                }}
                              >
                                {day.winRate}%
                              </Badge>
                              <Text size="1" className="text-white/60">
                                ({day.total} matchs)
                              </Text>
                            </Flex>
                          </Flex>
                        </motion.div>
                      ))}
                    </Flex>
                  </Box>
                )}
              </Flex>
            </Flex>
          </Card>
        )}
        
        {/* Insights de performance */}
        {advancedStats && (
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
              <Text 
                size="4" 
                weight="bold" 
                className="text-white mix-blend-exclusion"
              >
                💡 Insights de Performance
              </Text>
              
              <Flex direction="column" gap="3">
                {/* Insight sur la série actuelle */}
                <Box
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <Text size="3" className="text-white">
                    {advancedStats.currentStreak > 0 ? 
                      `🔥 Vous êtes sur une série de ${advancedStats.currentStreak} victoires !` :
                      advancedStats.currentStreak < 0 ?
                      `⚠️ Vous avez une série de ${Math.abs(advancedStats.currentStreak)} défaites. Temps de rebondir !` :
                      `⚖️ Vous n'avez pas de série active. Votre performance est équilibrée.`
                    }
                  </Text>
                </Box>
                
                {/* Insight sur les matchs parfaits */}
                {advancedStats.perfectGames > 0 && (
                  <Box
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <Text size="3" className="text-white">
                      ⭐ Vous avez {advancedStats.perfectGames} victoire{advancedStats.perfectGames > 1 ? 's' : ''} parfaite{advancedStats.perfectGames > 1 ? 's' : ''} (sans encaisser de points) !
                    </Text>
                  </Box>
                )}
                
                {/* Insight sur les matchs serrés */}
                {advancedStats.closeGames > 0 && (
                  <Box
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                    }}
                  >
                    <Text size="3" className="text-white">
                      🎯 {advancedStats.closeGames} de vos matchs ont été décidés à 1 point. Vous savez gérer la pression !
                    </Text>
                  </Box>
                )}
              </Flex>
            </Flex>
          </Card>
        )}
      </Flex>
    </motion.div>
  );
};

export default ProfileMatchAnalysis; 