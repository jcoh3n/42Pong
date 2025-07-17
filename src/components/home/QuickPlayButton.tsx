import React from 'react';
import { Box, Flex, Text } from '@radix-ui/themes';
import { GiPingPongBat } from 'react-icons/gi';
import { motion } from 'framer-motion';

interface QuickPlayButtonProps {
  onClick: () => void;
}

const QuickPlayButton: React.FC<QuickPlayButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer w-full max-w-2xl"
    >
      <Box
        style={{
          position: 'relative',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
        className="group hover:shadow-2xl hover:border-white/30"
      >
        {/* Effet de lumière en mouvement */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Gradient d'arrière-plan */}
        <Box
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          }}
        />

        <Flex 
          align="center" 
          justify="center" 
          direction="column"
          gap={{ initial: "3", sm: "4" }}
          p={{ initial: "4", sm: "5", md: "6" }}
          className="relative z-10"
        >
          {/* Icône animée */}
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            style={{
              width: 'clamp(50px, 12vw, 70px)',
              height: 'clamp(50px, 12vw, 70px)',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <GiPingPongBat 
              size={28} 
              className="text-white" 
              style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}
            />
          </motion.div>

          {/* Texte principal */}
          <Flex direction="column" align="center" gap="2">
            <Text 
              size={{ initial: "5", sm: "6", md: "7" }}
              weight="bold" 
              className="text-white mix-blend-exclusion text-center"
              style={{ 
                letterSpacing: '-0.02em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                fontSize: 'clamp(1.2rem, 3.5vw, 2.5rem)'
              }}
            >
              Jouer
            </Text>
            <Text 
              size={{ initial: "2", sm: "3" }}
              className="text-white mix-blend-exclusion opacity-80 text-center font-light"
              style={{ 
                fontStyle: 'italic',
                maxWidth: '260px',
                lineHeight: '1.4',
                fontSize: 'clamp(0.85rem, 2.2vw, 1.1rem)'
              }}
            >
              Trouvez un adversaire et commencez une partie immédiatement
            </Text>
          </Flex>

          {/* Indicateur d'action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              padding: '6px 14px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
            className="group-hover:bg-white/20 transition-all duration-200"
          >
            <Text 
              size={{ initial: "1", sm: "2" }}
              weight="medium" 
              className="text-white mix-blend-exclusion"
              style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1rem)' }}
            >
              Cliquez pour commencer →
            </Text>
          </motion.div>
        </Flex>

        {/* Particules d'animation - réduites sur mobile */}
        <Box className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default QuickPlayButton; 