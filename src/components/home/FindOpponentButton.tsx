import React from 'react';
import { Box, Text, Flex } from "@radix-ui/themes";
import { GiPingPongBat } from 'react-icons/gi';

interface FindOpponentButtonProps {
  onClick: () => void;
}

const FindOpponentButton: React.FC<FindOpponentButtonProps> = ({ onClick }) => {
  return (
    <Box 
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Carte principale */}
      <Box 
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #2c3e50, #1a2530)',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        className="hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
      >
        {/* Effet de lumière */}
        <Box 
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'rotate(-45deg)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        
        {/* Contenu */}
        <Flex 
          align="center" 
          justify="center" 
          direction="column"
          gap="4"
          p="6"
          style={{ position: 'relative', zIndex: 2 }}
        >
          {/* Icône */}
          <Box 
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '8px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
            }}
          >
            <GiPingPongBat size={40} color="white" />
          </Box>
          
          {/* Texte */}
          <Flex direction="column" align="center" gap="2">
            <Text size="6" weight="bold" style={{ color: 'white' }}>
              Trouver un adversaire
            </Text>
            <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Matchmaking rapide avec des joueurs de niveau similaire
            </Text>
          </Flex>
          
          {/* Bouton visuel */}
          <Box 
            style={{
              marginTop: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'background 0.2s ease'
            }}
            className="hover:bg-white/25"
          >
            <Text size="2" weight="medium" style={{ color: 'white' }}>
              Jouer maintenant
            </Text>
          </Box>
        </Flex>
        
        {/* Effet de particules */}
        <Box className="particles" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
          {[...Array(6)].map((_, i) => (
            <Box 
              key={i}
              className={`particle particle-${i+1}`}
              style={{
                position: 'absolute',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Style pour l'animation des particules */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .particle-1 { animation-delay: 0s; }
        .particle-2 { animation-delay: 2s; }
        .particle-3 { animation-delay: 4s; }
        .particle-4 { animation-delay: 6s; }
        .particle-5 { animation-delay: 8s; }
        .particle-6 { animation-delay: 10s; }
      `}</style>
    </Box>
  );
};

export default FindOpponentButton; 