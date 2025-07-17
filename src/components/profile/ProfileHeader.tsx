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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl"
    >
      <Box
        style={{
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Flex 
          align="center" 
          justify="between" 
          p={{ initial: "4", sm: "5" }}
          direction={{ initial: "column", sm: "row" }}
          gap={{ initial: "4", sm: "0" }}
        >
          {/* Informations utilisateur */}
          <Flex align="center" gap="4">
            <Avatar
              size={{ initial: "6", sm: "7" }}
              src={user.avatar_url || "https://via.placeholder.com/120"}
              fallback={user.login?.substring(0, 2).toUpperCase() || "??"}
              radius="full"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            />

            <Flex direction="column" gap="2">
              <Text
                size={{ initial: "6", sm: "7" }}
                weight="bold"
                className="text-white mix-blend-exclusion"
                style={{ 
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)'
                }}
              >
                {user.login}
              </Text>
              
              <Text 
                size="2" 
                className="text-white/60"
                style={{ fontStyle: 'italic' }}
              >
                Membre depuis {joinDate}
              </Text>
            </Flex>
          </Flex>

          {/* Section rang et ELO */}
          <Flex 
            align="center" 
            gap="3" 
            direction={{ initial: "row", sm: "column" }}
            className="text-center"
          >
            {/* Rang */}
            <Box
              style={{
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                backdropFilter: 'blur(8px)',
                minWidth: '120px',
              }}
            >
              <Flex direction="column" align="center" gap="1">
                <StarFilledIcon width="20" height="20" className="text-yellow-400" />
                <Text 
                  size="1" 
                  className="text-yellow-200/80 uppercase tracking-wide" 
                  weight="medium"
                >
                  Classement
                </Text>
                <Text 
                  size="4" 
                  weight="bold" 
                  className="text-white mix-blend-exclusion"
                  style={{ textShadow: '0 0 8px rgba(255, 215, 0, 0.4)' }}
                >
                  #{rank || "?"}
                </Text>
              </Flex>
            </Box>

            {/* ELO Score */}
            <Box
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                backdropFilter: 'blur(8px)',
                minWidth: '120px',
              }}
            >
              <Flex direction="column" align="center" gap="1">
                <BadgeIcon width="20" height="20" className="text-purple-400" />
                <Text 
                  size="1" 
                  className="text-purple-200/80 uppercase tracking-wide" 
                  weight="medium"
                >
                  Score ELO
                </Text>
                <Text 
                  size="4" 
                  weight="bold" 
                  className="text-white mix-blend-exclusion font-mono"
                  style={{ textShadow: '0 0 8px rgba(139, 92, 246, 0.4)' }}
                >
                  {user.elo_score}
                </Text>
              </Flex>
            </Box>

            {/* Bouton voir classement */}
            <Button
              variant="ghost"
              size="2"
              onClick={onViewLeaderboard}
              style={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                minWidth: '120px',
              }}
              className="hover:bg-white/20 transition-all duration-200"
            >
              <Text size="2" weight="medium">Voir Classement</Text>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default ProfileHeader; 