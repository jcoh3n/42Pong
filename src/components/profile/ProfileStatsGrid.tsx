import React from 'react';
import { Box, Flex, Text, Card, Button } from '@radix-ui/themes';
import { StarFilledIcon, BarChartIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';

interface ProfileStatsGridProps {
  stats: {
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
  };
  eloScore: number;
  onViewLeaderboard: () => void;
}

const ProfileStatsGrid: React.FC<ProfileStatsGridProps> = ({
  stats,
  eloScore,
  onViewLeaderboard
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl"
    >
      <Flex direction="column" gap="4">
        {/* Grille de statistiques détaillées */}
        <Flex 
          gap={{ initial: "3", sm: "4" }}
          direction={{ initial: "column", md: "row" }}
        >
          {/* Carte ELO Score */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1"
          >
            <Card
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                padding: '24px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
              className="hover:shadow-purple-500/20 hover:shadow-lg"
            >
              <Flex direction="column" align="center" gap="3">
                <Box
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <StarFilledIcon width="24" height="24" className="text-purple-200" />
                </Box>
                
                <Text 
                  size="3" 
                  className="text-purple-200/90 uppercase tracking-wide" 
                  weight="medium"
                >
                  Score ELO
                </Text>
                
                <Text 
                  size="8" 
                  weight="bold" 
                  className="text-white mix-blend-exclusion font-mono"
                  style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: '1',
                    textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                  }}
                >
                  {eloScore}
                </Text>

                <Button
                  variant="ghost"
                  size="1"
                  onClick={onViewLeaderboard}
                  style={{
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    marginTop: '8px',
                  }}
                  className="hover:bg-white/20 transition-all duration-200"
                >
                  <Text size="1" weight="medium">Voir Classement</Text>
                </Button>
              </Flex>
            </Card>
          </motion.div>

          {/* Grille 2x2 des autres stats */}
          <Flex 
            direction="column" 
            gap={{ initial: "3", sm: "4" }}
            className="flex-1"
          >
            {/* Première ligne */}
            <Flex gap={{ initial: "3", sm: "4" }}>
              {/* Victoires */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1"
              >
                <Card
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    backdropFilter: 'blur(12px)',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-emerald-500/10"
                >
                  <Flex direction="column" align="center" gap="2">
                    <Text 
                      size="1" 
                      className="text-emerald-200/80 uppercase tracking-wide" 
                      weight="medium"
                    >
                      Victoires
                    </Text>
                    <Text 
                      size="6" 
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                      style={{ 
                        textShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)'
                      }}
                    >
                      {stats.wins}
                    </Text>
                  </Flex>
                </Card>
              </motion.div>

              {/* Défaites */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1"
              >
                <Card
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    backdropFilter: 'blur(12px)',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-red-500/10"
                >
                  <Flex direction="column" align="center" gap="2">
                    <Text 
                      size="1" 
                      className="text-red-200/80 uppercase tracking-wide" 
                      weight="medium"
                    >
                      Défaites
                    </Text>
                    <Text 
                      size="6" 
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                      style={{ 
                        textShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)'
                      }}
                    >
                      {stats.losses}
                    </Text>
                  </Flex>
                </Card>
              </motion.div>
            </Flex>

            {/* Deuxième ligne */}
            <Flex gap={{ initial: "3", sm: "4" }}>
              {/* Total Parties */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1"
              >
                <Card
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    backdropFilter: 'blur(12px)',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-blue-500/10"
                >
                  <Flex direction="column" align="center" gap="2">
                    <Text 
                      size="1" 
                      className="text-blue-200/80 uppercase tracking-wide" 
                      weight="medium"
                    >
                      Total
                    </Text>
                    <Text 
                      size="6" 
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                      style={{ 
                        textShadow: '0 0 8px rgba(59, 130, 246, 0.4)',
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)'
                      }}
                    >
                      {stats.totalMatches}
                    </Text>
                  </Flex>
                </Card>
              </motion.div>

              {/* Win Rate */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-1"
              >
                <Card
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    backdropFilter: 'blur(12px)',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-amber-500/10"
                >
                  <Flex direction="column" align="center" gap="2">
                    <Text 
                      size="1" 
                      className="text-amber-200/80 uppercase tracking-wide" 
                      weight="medium"
                    >
                      Win Rate
                    </Text>
                    <Flex align="baseline" justify="center" gap="1">
                      <Text 
                        size="6" 
                        weight="bold" 
                        className="text-white mix-blend-exclusion"
                        style={{ 
                          textShadow: '0 0 8px rgba(245, 158, 11, 0.4)',
                          fontSize: 'clamp(1.8rem, 3vw, 2.5rem)'
                        }}
                      >
                        {stats.winRate}
                      </Text>
                      <Text 
                        size="3" 
                        className="text-amber-100/70" 
                        weight="medium"
                      >
                        %
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              </motion.div>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default ProfileStatsGrid; 