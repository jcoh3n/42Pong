import React from 'react';
import { Box, Flex, Text, Avatar, Badge, Card } from '@radix-ui/themes';
import { motion } from 'framer-motion';

interface WelcomeCardProps {
  user: {
    login: string;
    avatar_url?: string;
    elo_score: number;
  };
  rank: number;
  stats: {
    wins: number;
    totalMatches: number;
    winRate: number;
  };
  onViewProfile: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ 
  user, 
  rank, 
  stats,
  onViewProfile 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl"
    >
      <Box
        onClick={onViewProfile}
        className="cursor-pointer relative group"
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Effet de hover */}
        <Box
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          }}
        />

        <Flex 
          direction="column" 
          p={{ initial: "4", sm: "5", md: "6" }}
          gap={{ initial: "3", sm: "4" }}
          className="relative z-10"
        >
          {/* Informations principales utilisateur */}
          <Flex 
            align="center" 
            gap={{ initial: "3", sm: "4" }}
            className="relative"
            direction={{ initial: "column", sm: "row" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Avatar
                size={{ initial: "5", sm: "6" }}
                src={user.avatar_url || "https://via.placeholder.com/120"}
                fallback={user.login?.substring(0, 2).toUpperCase() || "??"}
                radius="full"
                style={{
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              />
            </motion.div>

            <Flex 
              direction="column" 
              gap="2" 
              className="flex-1"
              align={{ initial: "center", sm: "start" }}
            >
              <Text
                size={{ initial: "6", sm: "7" }}
                weight="bold"
                className="text-white mix-blend-exclusion text-center sm:text-left"
                style={{ 
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)'
                }}
              >
                {user.login}
              </Text>
              
              <Flex 
                align="center" 
                gap="3" 
                wrap="wrap"
                justify={{ initial: "center", sm: "start" }}
                direction={{ initial: "column", sm: "row" }}
              >
                <Text 
                  size={{ initial: "2", sm: "3" }}
                  className="text-white mix-blend-exclusion opacity-80"
                  style={{ fontWeight: '500' }}
                >
                  Rang #{rank || "?"}
                </Text>

                {/* OPTION 1: Style Actuel - Glassmorphism }
                <Box
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '14px',
                    padding: '8px 16px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-white/20 hover:border-white/35"
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

                {/* OPTION 2: Style Minimaliste - Bordure seulement 
                <Box
                  style={{
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '6px 14px',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:border-white/50 hover:bg-white/5"
                >
                  <Text 
                    size="3" 
                    weight="bold" 
                    className="text-white mix-blend-exclusion"
                    style={{ letterSpacing: '0.5px' }}
                  >
                    {user.elo_score} <Text as="span" className="text-white/60 text-xs">ELO</Text>
                  </Text>
                </Box>

                {/* OPTION 3: Style Gradient Subtil *\
                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(167, 139, 250, 0.3)',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Flex align="center" gap="2">
                    <Text 
                      size="1" 
                      className="text-purple-200/80 font-mono uppercase" 
                      weight="medium"
                    >
                      ELO
                    </Text>
                    <Text 
                      size="3" 
                      weight="bold" 
                      className="text-white"
                      style={{ textShadow: '0 0 8px rgba(167, 139, 250, 0.5)' }}
                    >
                      {user.elo_score}
                    </Text>
                  </Flex>
                </Box>
                */}

                {/* OPTION 4: Style Pill Compact *
                <Box
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-black/60"
                >
                  <Text 
                    size="2" 
                    weight="medium" 
                    className="text-white font-mono"
                    style={{ letterSpacing: '1px' }}
                  >
                    {user.elo_score}
                  </Text>
                </Box>
                */}

                {/* OPTION 5: Style Néon 
                <Box
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(34, 197, 94, 0.5)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    boxShadow: '0 0 12px rgba(34, 197, 94, 0.3), inset 0 0 12px rgba(34, 197, 94, 0.1)',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:shadow-green-500/40 hover:shadow-lg"
                >
                  <Flex align="center" gap="2">
                    <Box
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 6px #22c55e',
                      }}
                    />
                    <Text 
                      size="3" 
                      weight="bold" 
                      className="text-green-300 font-mono"
                      style={{ 
                        textShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {user.elo_score}
                    </Text>
                  </Flex>
                </Box>
                */}

                {/* OPTION 6: Style Outlined Clean */}
                <Box
                  style={{
                    background: 'transparent',
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-white/10 hover:border-white/60"
                >
                  <Flex direction="column" align="center" gap="0">
                    <Text 
                      size="1" 
                      className="text-white/50 uppercase tracking-wide" 
                      weight="medium"
                      style={{ fontSize: '0.6rem', lineHeight: '1' }}
                    >
                      ELO
                    </Text>
                    <Text 
                      size="3" 
                      weight="bold" 
                      className="text-white"
                      style={{ lineHeight: '1.2' }}
                    >
                      {user.elo_score}
                    </Text>
                  </Flex>
                </Box>
                
              </Flex>
            </Flex>
          </Flex>

          {/* Statistiques en grille */}
          <Flex 
            gap={{ initial: "2", sm: "3" }}
            className="mt-2"
            direction={{ initial: "column", xs: "row" }}
          >
            {/* Victoires - Accent doré */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1"
            >
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 12px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
                className="hover:bg-gradient-to-br hover:from-yellow-500/10 hover:to-white/10"
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
                    size={{ initial: "5", sm: "6" }}
                    weight="bold" 
                    className="text-white mix-blend-exclusion"
                    style={{ 
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      lineHeight: '1.1',
                      textShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    {stats.wins}
                  </Text>
                </Flex>
              </Card>
            </motion.div>

            {/* Parties totales - Accent bleu */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1"
            >
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  border: '1px solid rgba(96, 165, 250, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 12px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
                className="hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-white/10"
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
                    size={{ initial: "5", sm: "6" }}
                    weight="bold" 
                    className="text-white mix-blend-exclusion"
                    style={{ 
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      lineHeight: '1.1',
                      textShadow: '0 0 8px rgba(96, 165, 250, 0.3)'
                    }}
                  >
                    {stats.totalMatches}
                  </Text>
                </Flex>
              </Card>
            </motion.div>

            {/* Win Rate - Accent vert */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1"
            >
              <Card
                style={{
                  background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 12px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
                className="hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-white/10"
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
                      size={{ initial: "5", sm: "6" }}
                      weight="bold" 
                      className="text-white mix-blend-exclusion"
                      style={{ 
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        lineHeight: '1.1',
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

          {/* Indicateur de clic */}
          <Text 
            size="1" 
            className="text-white mix-blend-exclusion opacity-50 text-center mt-1"
            style={{ 
              fontStyle: 'italic',
              display: 'block',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)'
            }}
          >
            Cliquez pour voir votre profil
          </Text>
        </Flex>

        {/* Effet de particules en arrière-plan */}
        <Box className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                top: `${30 + i * 20}%`,
                left: `${15 + i * 30}%`,
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

export default WelcomeCard; 