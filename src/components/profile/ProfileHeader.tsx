import React from 'react';
import { Box, Flex, Text, Avatar, Badge, Button } from '@radix-ui/themes';
import { StarFilledIcon, BadgeIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  user: {
    login: string;
    avatar_url?: string;
    elo_score: number;
    created_at: string;
  };
  rank: number;
  onViewLeaderboard: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  rank, 
  onViewLeaderboard 
}) => {
  const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short'
  });

  return (
    <Box className="rounded-xl bg-white/5 border border-white/10 p-4 sm:p-6">
      <Flex 
        direction={{ initial: "column", sm: "row" }} 
        align="center" 
        justify="between" 
        gap="4"
      >
        {/* Informations utilisateur */}
        <Flex 
          align="center" 
          gap="4" 
          direction={{ initial: "column", xs: "row" }}
          className="text-center sm:text-left"
        >
          <Avatar
            size="5"
            src={user.avatar_url || "https://via.placeholder.com/120"}
            fallback={user.login?.substring(0, 2).toUpperCase() || "??"}
            radius="full"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          />

          <Flex direction="column" gap="1">
            <Text
              size="5"
              weight="bold"
              className="text-white"
            >
              {user.login}
            </Text>
            
            <Text 
              size="2" 
              className="text-white/60"
            >
              Membre depuis {joinDate}
            </Text>
          </Flex>
        </Flex>

        {/* Section rang et ELO */}
        <Flex 
          gap="3" 
          direction={{ initial: "row", sm: "row" }}
          wrap="wrap"
          justify="center"
        >
          {/* Rang - Clickable */}
          <Box
            onClick={onViewLeaderboard}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px 16px',
              backdropFilter: 'blur(8px)',
              minWidth: '100px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-yellow-500/20 hover:border-yellow-400/50"
          >
            <Flex direction="column" align="center" gap="1">
              <StarFilledIcon width="16" height="16" className="text-yellow-400" />
              <Text 
                size="1" 
                className="text-yellow-200/80 uppercase tracking-wide" 
                weight="medium"
              >
                Rang
              </Text>
              <Text 
                size="4" 
                weight="bold" 
                className="text-white"
              >
                #{rank || "?"}
              </Text>
            </Flex>
          </Box>

          {/* ELO Score */}
          <Box
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              backdropFilter: 'blur(8px)',
              minWidth: '100px',
            }}
          >
            <Flex direction="column" align="center" gap="1">
              <BadgeIcon width="16" height="16" className="text-blue-400" />
              <Text 
                size="1" 
                className="text-white/60 uppercase tracking-wide" 
                weight="medium"
              >
                ELO
              </Text>
              <Text 
                size="4" 
                weight="bold" 
                className="text-white font-mono"
              >
                {user.elo_score}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProfileHeader; 