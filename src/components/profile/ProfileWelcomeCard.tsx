import React from 'react';
import { Box, Flex, Text, Avatar, Badge, Card } from '@radix-ui/themes';
import { motion } from 'framer-motion';

interface ProfileWelcomeCardProps {
  user: {
    login: string;
    avatar_url?: string;
    elo_score: number;
    created_at: string;
  };
  rank: number;
  stats: {
    wins: number;
    totalMatches: number;
    winRate: number;
  };
}

const ProfileWelcomeCard: React.FC<ProfileWelcomeCardProps> = ({ 
  user, 
  rank, 
  stats
}) => {
  const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl"
    >
      <Box
        className="relative group"
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Flex 
          direction="column" 
          p={{ initial: "5", sm: "6", md: "7" }}
          gap={{ initial: "4", sm: "5" }}
          className="relative z-10"
        >
          {/* Section principale avec avatar et informations */}
          <Flex 
            align="center" 
            gap={{ initial: "4", sm: "5" }}
            className="relative"
            direction={{ initial: "column", md: "row" }}
          >
            {/* Avatar large */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Avatar
                size={{ initial: "7", sm: "8", md: "9" }}
                src={user.avatar_url || "https://via.placeholder.com/200"}
                fallback={user.login?.substring(0, 2).toUpperCase() || "??"}
                radius="full"
                style={{
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
                }}
              />
            </motion.div>

            {/* Informations utilisateur */}
            <Flex 
              direction="column" 
              gap="3" 
              className="flex-1"
              align={{ initial: "center", md: "start" }}
            >
              {/* Nom utilisateur */}
              <Text
                size={{ initial: "7", sm: "8", md: "9" }}
                weight="bold"
                className="text-white mix-blend-exclusion text-center md:text-left"
                style={{ 
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  lineHeight: '1.1'
                }}
              >
                {user.login}
              </Text>
              
              {/* Badges et informations */}
              <Flex 
                align="center" 
                gap="3" 
                wrap="wrap"
                justify={{ initial: "center", md: "start" }}
                direction={{ initial: "column", sm: "row" }}
              >
                {/* Rang */}
                <Text 
                  size={{ initial: "3", sm: "4" }}
                  className="text-white mix-blend-exclusion opacity-80"
                  style={{ fontWeight: '500' }}
                >
                  Rang #{rank || "?"}
                </Text>

                {/* Badge ELO */}
                <Box
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '14px',
                    padding: '8px 16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Flex align="center" gap="2">
                    <Text 
                      size="1" 
                      className="text-white/70 uppercase tracking-wider" 
                      weight="medium"
                      style={{ fontSize: '0.7rem' }}
                    >
                      ELO
                    </Text>
                    <Box
                      style={{
                        width: '1px',
                        height: '14px',
                        background: 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                    <Text 
                      size="3" 
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                      style={{ 
                        letterSpacing: '-0.01em',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      {user.elo_score}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Date d'inscription */}
              <Text 
                size={{ initial: "2", sm: "3" }}
                className="text-white/60 text-center md:text-left"
                style={{ fontStyle: 'italic' }}
              >
                Membre depuis le {joinDate}
              </Text>
            </Flex>
          </Flex>

          {/* Résumé rapide des statistiques */}
          <Flex 
            gap={{ initial: "3", sm: "4" }}
            className="mt-4"
            direction={{ initial: "column", xs: "row" }}
          >
            {/* Victoires */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1"
            >
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  backdropFilter: 'blur(8px)',
                  textAlign: 'center',
                }}
              >
                <Flex direction="column" align="center" gap="1">
                  <Text 
                    size={{ initial: "1", sm: "2" }}
                    className="text-yellow-200/80 uppercase tracking-wide" 
                    weight="medium"
                    style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}
                  >
                    Victoires
                  </Text>
                  <Text 
                    size={{ initial: "4", sm: "5" }}
                    weight="bold" 
                    className="text-white mix-blend-exclusion"
                    style={{ 
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                      textShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    {stats.wins}
                  </Text>
                </Flex>
              </Card>
            </motion.div>

            {/* Parties totales */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1"
            >
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  backdropFilter: 'blur(8px)',
                  textAlign: 'center',
                }}
              >
                <Flex direction="column" align="center" gap="1">
                  <Text 
                    size={{ initial: "1", sm: "2" }}
                    className="text-blue-200/80 uppercase tracking-wide" 
                    weight="medium"
                    style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}
                  >
                    Parties
                  </Text>
                  <Text 
                    size={{ initial: "4", sm: "5" }}
                    weight="bold" 
                    className="text-white mix-blend-exclusion"
                    style={{ 
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                      textShadow: '0 0 8px rgba(96, 165, 250, 0.3)'
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
                  background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  backdropFilter: 'blur(8px)',
                  textAlign: 'center',
                }}
              >
                <Flex direction="column" align="center" gap="1">
                  <Text 
                    size={{ initial: "1", sm: "2" }}
                    className="text-emerald-200/80 uppercase tracking-wide" 
                    weight="medium"
                    style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}
                  >
                    Taux de Victoire
                  </Text>
                  <Flex align="baseline" justify="center" gap="1">
                    <Text 
                      size={{ initial: "4", sm: "5" }}
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                      style={{ 
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                        textShadow: '0 0 8px rgba(52, 211, 153, 0.3)'
                      }}
                    >
                      {stats.winRate}
                    </Text>
                    <Text 
                      size={{ initial: "2", sm: "3" }}
                      className="text-emerald-100/70" 
                      weight="medium"
                      style={{ 
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        marginBottom: '2px'
                      }}
                    >
                      %
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </motion.div>
          </Flex>
        </Flex>

        {/* Effet de particules en arrière-plan */}
        <Box className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                top: `${25 + i * 18}%`,
                left: `${15 + i * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProfileWelcomeCard; 