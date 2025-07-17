import React from 'react';
import { Box, Flex, Text, Card, Badge } from '@radix-ui/themes';
import { motion } from 'framer-motion';
import { TrophyIcon, XCircleIcon, BarChart3Icon, PercentIcon } from 'lucide-react';

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
      transition={{ duration: 0.3, delay }}
      className="flex-1 min-w-0"
    >
      <Box
        style={{
          background: color,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '12px',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
        className="hover:bg-white/10 hover:border-white/20 h-full"
      >
        <Flex direction="column" align="center" gap="1" className="h-full">
          {icon && (
            <Box className="text-white/60">
              {icon}
            </Box>
          )}
          <Text 
            size="1" 
            className="text-white/60 uppercase tracking-wide text-center" 
            weight="medium"
          >
            {title}
          </Text>
          <Text 
            size={{ initial: "4", sm: "5" }} 
            weight="bold" 
            className="text-white text-center"
          >
            {value}
          </Text>
          {subtitle && (
            <Text 
              size="1" 
              className="text-white/40 text-center"
            >
              {subtitle}
            </Text>
          )}
        </Flex>
      </Box>
    </motion.div>
  );

  return (
    <Box className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
      <Flex direction="column" gap="4">
        
        {/* Titre section plus discret */}
        <Text size="3" weight="medium" className="text-white/80">
          Statistiques principales
        </Text>
        
        {/* Statistiques en grille */}
        <Flex 
          gap="2" 
          direction={{ initial: "row", sm: "row" }}
          wrap="wrap"
        >
          <StatCard
            title="Victoires"
            value={basicStats.wins}
            color="rgba(34, 197, 94, 0.12)"
            icon={<TrophyIcon size={16} />}
            delay={0.1}
          />
          <StatCard
            title="Défaites"
            value={basicStats.losses}
            color="rgba(239, 68, 68, 0.12)"
            icon={<XCircleIcon size={16} />}
            delay={0.2}
          />
          <StatCard
            title="Total Parties"
            value={basicStats.totalMatches}
            color="rgba(59, 130, 246, 0.12)"
            icon={<BarChart3Icon size={16} />}
            delay={0.3}
          />
          <StatCard
            title="Taux de Victoire"
            value={`${basicStats.winRate}%`}
            color="rgba(245, 158, 11, 0.12)"
            icon={<PercentIcon size={16} />}
            delay={0.4}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProfileDetailedStats; 