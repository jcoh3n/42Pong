import React from 'react';
import { Box, Flex, Text, Card, Badge } from '@radix-ui/themes';
import { motion } from 'framer-motion';

interface ProfileDetailedStatsProps {
  basicStats: {
    wins: number;
    losses: number;
    totalMatches: number;
    winRate: number;
  };
  advancedStats: {
    currentStreak: number;
    longestWinStreak: number;
    longestLoseStreak: number;
    averageScoreFor: number;
    averageScoreAgainst: number;
    perfectGames: number;
    closeGames: number;
    matchTypeStats: {
      normal: { wins: number; losses: number; total: number };
      ranked: { wins: number; losses: number; total: number };
      friendly: { wins: number; losses: number; total: number };
    };
  } | null;
  eloScore: number;
}

const ProfileDetailedStats: React.FC<ProfileDetailedStatsProps> = ({
  basicStats,
  advancedStats,
  eloScore
}) => {
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    color,
    icon,
    delay = 0
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    color: string;
    icon?: React.ReactNode;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex-1 min-w-0"
    >
      <Card
        style={{
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${color} 0%, rgba(255, 255, 255, 0.08) 100%)`,
          border: `1px solid ${color.replace('0.12', '0.3')}`,
          backdropFilter: 'blur(12px)',
          padding: '20px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          minHeight: '120px',
        }}
        className="hover:shadow-lg"
      >
        <Flex direction="column" align="center" gap="2" justify="center" className="h-full">
          {icon && <Box className="mb-1">{icon}</Box>}
          <Text 
            size="1" 
            className="text-white/70 uppercase tracking-wide" 
            weight="medium"
          >
            {title}
          </Text>
          <Text 
            size="6" 
            weight="bold" 
            className="text-white mix-blend-exclusion"
            style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              lineHeight: '1.1'
            }}
          >
            {value}
          </Text>
          {subtitle && (
            <Text 
              size="1" 
              className="text-white/50" 
              style={{ marginTop: '-4px' }}
            >
              {subtitle}
            </Text>
          )}
        </Flex>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full max-w-6xl"
    >
      <Flex direction="column" gap="6">
        {/* Section Statistiques Principales */}
        <Box>
          <Text 
            size="4" 
            weight="bold" 
            className="text-white mix-blend-exclusion mb-4"
            style={{ display: 'block' }}
          >
            📊 Statistiques Principales
          </Text>
          
          <Flex 
            gap="4" 
            direction={{ initial: "column", sm: "row" }}
            className="mb-6"
          >
            <StatCard
              title="Victoires"
              value={basicStats.wins}
              color="rgba(34, 197, 94, 0.12)"
              delay={0.1}
            />
            <StatCard
              title="Défaites"
              value={basicStats.losses}
              color="rgba(239, 68, 68, 0.12)"
              delay={0.2}
            />
            <StatCard
              title="Total Parties"
              value={basicStats.totalMatches}
              color="rgba(59, 130, 246, 0.12)"
              delay={0.3}
            />
            <StatCard
              title="Taux de Victoire"
              value={`${basicStats.winRate}%`}
              color="rgba(245, 158, 11, 0.12)"
              delay={0.4}
            />
          </Flex>
        </Box>

        {advancedStats && (
          <>
            {/* Section Streaks */}
            <Box>
              <Text 
                size="4" 
                weight="bold" 
                className="text-white mix-blend-exclusion mb-4"
                style={{ display: 'block' }}
              >
                🔥 Séries et Streaks
              </Text>
              
              <Flex 
                gap="4" 
                direction={{ initial: "column", sm: "row" }}
                className="mb-6"
              >
                <StatCard
                  title="Série Actuelle"
                  value={advancedStats.currentStreak > 0 ? `+${advancedStats.currentStreak}` : advancedStats.currentStreak}
                  subtitle={advancedStats.currentStreak > 0 ? "victoires" : advancedStats.currentStreak < 0 ? "défaites" : "neutre"}
                  color={advancedStats.currentStreak > 0 ? "rgba(34, 197, 94, 0.12)" : advancedStats.currentStreak < 0 ? "rgba(239, 68, 68, 0.12)" : "rgba(156, 163, 175, 0.12)"}
                  delay={0.1}
                />
                <StatCard
                  title="Meilleure Série"
                  value={advancedStats.longestWinStreak}
                  subtitle="victoires consécutives"
                  color="rgba(34, 197, 94, 0.12)"
                  delay={0.2}
                />
                <StatCard
                  title="Pire Série"
                  value={advancedStats.longestLoseStreak}
                  subtitle="défaites consécutives"
                  color="rgba(239, 68, 68, 0.12)"
                  delay={0.3}
                />
              </Flex>
            </Box>

            {/* Section Performance */}
            <Box>
              <Text 
                size="4" 
                weight="bold" 
                className="text-white mix-blend-exclusion mb-4"
                style={{ display: 'block' }}
              >
                📈 Performance Détaillée
              </Text>
              
              <Flex 
                gap="4" 
                direction={{ initial: "column", sm: "row" }}
                className="mb-6"
              >
                <StatCard
                  title="Score Moyen"
                  value={`${advancedStats.averageScoreFor} - ${advancedStats.averageScoreAgainst}`}
                  subtitle="pour - contre"
                  color="rgba(59, 130, 246, 0.12)"
                  delay={0.1}
                />
                <StatCard
                  title="Victoires Parfaites"
                  value={advancedStats.perfectGames}
                  subtitle="sans encaisser"
                  color="rgba(168, 85, 247, 0.12)"
                  delay={0.2}
                />
                <StatCard
                  title="Matchs Serrés"
                  value={advancedStats.closeGames}
                  subtitle="décidés à 1 point"
                  color="rgba(245, 158, 11, 0.12)"
                  delay={0.3}
                />
              </Flex>
            </Box>

            {/* Section Types de Match */}
            <Box>
              <Text 
                size="4" 
                weight="bold" 
                className="text-white mix-blend-exclusion mb-4"
                style={{ display: 'block' }}
              >
                🎯 Performance par Type de Match
              </Text>
              
              <Flex 
                gap="4" 
                direction={{ initial: "column", lg: "row" }}
              >
                {Object.entries(advancedStats.matchTypeStats).map(([type, stats], index) => {
                  if (stats.total === 0) return null;
                  
                  const winRate = Math.round((stats.wins / stats.total) * 100);
                  const typeLabels = {
                    normal: "Quick Play",
                    ranked: "Classé",
                    friendly: "Amical"
                  };
                  
                  return (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                      className="flex-1"
                    >
                      <Card
                        style={{
                          borderRadius: '16px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(12px)',
                          padding: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <Flex direction="column" gap="3">
                          <Text 
                            size="3" 
                            weight="bold" 
                            className="text-white mix-blend-exclusion"
                          >
                            {typeLabels[type as keyof typeof typeLabels]}
                          </Text>
                          
                          <Flex justify="between" gap="2">
                            <Box className="text-center">
                              <Text size="1" className="text-green-300/80 block">Victoires</Text>
                              <Text size="4" weight="bold" className="text-green-300">{stats.wins}</Text>
                            </Box>
                            <Box className="text-center">
                              <Text size="1" className="text-red-300/80 block">Défaites</Text>
                              <Text size="4" weight="bold" className="text-red-300">{stats.losses}</Text>
                            </Box>
                            <Box className="text-center">
                              <Text size="1" className="text-blue-300/80 block">Win Rate</Text>
                              <Text size="4" weight="bold" className="text-blue-300">{winRate}%</Text>
                            </Box>
                          </Flex>
                        </Flex>
                      </Card>
                    </motion.div>
                  );
                })}
              </Flex>
            </Box>
          </>
        )}
      </Flex>
    </motion.div>
  );
};

export default ProfileDetailedStats; 