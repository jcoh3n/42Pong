import React from 'react';
import { Box, Flex, Text, Card } from '@radix-ui/themes';
import { motion } from 'framer-motion';

interface ProfileProgressChartProps {
  matches: any[];
  currentUser: any;
  currentElo: number;
}

const ProfileProgressChart: React.FC<ProfileProgressChartProps> = ({
  matches,
  currentUser,
  currentElo
}) => {
  // Calculer la progression ELO (simulation basée sur les résultats)
  const calculateEloProgression = () => {
    if (!matches || matches.length === 0) return [];
    
    const progression = [];
    let estimatedElo = 1000; // ELO de départ standard
    
    // Ajouter le point de départ
    progression.push({
      match: 0,
      elo: estimatedElo,
      result: 'start'
    });
    
    // Parcourir les matchs dans l'ordre chronologique inverse
    const sortedMatches = [...matches]
      .sort((a, b) => new Date(a.created_at || a.date).getTime() - new Date(b.created_at || b.date).getTime())
      .slice(-20); // Garder les 20 derniers matchs
    
    sortedMatches.forEach((match, index) => {
      const isWin = match.winner_id === currentUser?.id;
      const userScore = match.user_1_id === currentUser?.id ? match.user_1_score : match.user_2_score;
      const opponentScore = match.user_1_id === currentUser?.id ? match.user_2_score : match.user_1_score;
      
      // Simulation de changement d'ELO basée sur le résultat
      const scoreDifference = Math.abs(userScore - opponentScore);
      const baseChange = 15 + (scoreDifference * 2); // Plus de changement si match serré
      
      if (isWin) {
        estimatedElo += baseChange;
      } else {
        estimatedElo -= baseChange;
      }
      
      progression.push({
        match: index + 1,
        elo: Math.max(800, estimatedElo), // ELO minimum à 800
        result: isWin ? 'win' : 'loss',
        score: `${userScore}-${opponentScore}`
      });
    });
    
    // Ajuster le dernier point pour correspondre à l'ELO actuel
    if (progression.length > 1) {
      const lastPoint = progression[progression.length - 1];
      const adjustment = currentElo - lastPoint.elo;
      
      // Répartir l'ajustement sur les derniers points
      const adjustmentPerPoint = adjustment / Math.min(5, progression.length - 1);
      
      for (let i = progression.length - 5; i < progression.length; i++) {
        if (i > 0) {
          progression[i].elo += adjustmentPerPoint * (i - Math.max(0, progression.length - 6));
        }
      }
      
      // Assurer que le dernier point soit l'ELO actuel
      progression[progression.length - 1].elo = currentElo;
    }
    
    return progression;
  };
  
  const progression = calculateEloProgression();
  
  if (progression.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
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
            📈 Pas assez de données pour afficher la progression ELO
          </Text>
        </Card>
      </motion.div>
    );
  }
  
  // Calculer les dimensions du graphique
  const maxElo = Math.max(...progression.map(p => p.elo));
  const minElo = Math.min(...progression.map(p => p.elo));
  const eloRange = maxElo - minElo;
  const chartHeight = 200;
  const chartWidth = 600;
  
  // Générer les points du graphique
  const generatePath = () => {
    const points = progression.map((point, index) => {
      const x = (index / (progression.length - 1)) * chartWidth;
      const y = chartHeight - ((point.elo - minElo) / eloRange) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-6xl"
    >
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
            📈 Progression ELO ({progression.length - 1} derniers matchs)
          </Text>
          
          {/* Graphique SVG */}
          <Box 
            style={{ 
              width: '100%', 
              height: '250px',
              position: 'relative',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* Grille horizontale */}
              {[0, 0.25, 0.5, 0.75, 1].map((percent) => (
                <line
                  key={percent}
                  x1={0}
                  y1={chartHeight * percent}
                  x2={chartWidth}
                  y2={chartHeight * percent}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Ligne de progression */}
              <path
                d={generatePath()}
                fill="none"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Points sur la ligne */}
              {progression.map((point, index) => {
                const x = (index / (progression.length - 1)) * chartWidth;
                const y = chartHeight - ((point.elo - minElo) / eloRange) * chartHeight;
                
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill={point.result === 'win' ? '#22c55e' : point.result === 'loss' ? '#ef4444' : '#8b5cf6'}
                      stroke="white"
                      strokeWidth="2"
                    />
                    
                    {/* Texte ELO */}
                    <text
                      x={x}
                      y={y - 15}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {Math.round(point.elo)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Box>
          
          {/* Statistiques de progression */}
          <Flex 
            justify="between" 
            align="center" 
            direction={{ initial: "column", sm: "row" }}
            gap="4"
          >
            <Flex gap="6" direction={{ initial: "column", sm: "row" }}>
              <Box className="text-center">
                <Text size="1" className="text-white/60 block">ELO Actuel</Text>
                <Text size="4" weight="bold" className="text-white">{currentElo}</Text>
              </Box>
              <Box className="text-center">
                <Text size="1" className="text-white/60 block">Maximum</Text>
                <Text size="4" weight="bold" className="text-green-300">{Math.round(maxElo)}</Text>
              </Box>
              <Box className="text-center">
                <Text size="1" className="text-white/60 block">Minimum</Text>
                <Text size="4" weight="bold" className="text-red-300">{Math.round(minElo)}</Text>
              </Box>
              <Box className="text-center">
                <Text size="1" className="text-white/60 block">Variation</Text>
                <Text size="4" weight="bold" className="text-blue-300">
                  {currentElo > progression[0]?.elo ? '+' : ''}{Math.round(currentElo - (progression[0]?.elo || 1000))}
                </Text>
              </Box>
            </Flex>
            
            {/* Légende */}
            <Flex gap="4" align="center">
              <Flex align="center" gap="2">
                <Box 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#22c55e',
                    border: '2px solid white'
                  }} 
                />
                <Text size="1" className="text-white/70">Victoire</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ef4444',
                    border: '2px solid white'
                  }} 
                />
                <Text size="1" className="text-white/70">Défaite</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </motion.div>
  );
};

export default ProfileProgressChart; 