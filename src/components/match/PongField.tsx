import React from 'react';
import { Box, Text } from '@radix-ui/themes';
import { FaFlag, FaTrophy } from 'react-icons/fa';
import SetScoreDisplay from './SetScoreDisplay';
import AddSetButton from './AddSetButton';
import PlayerDisplay from './PlayerDisplay';

interface PongFieldProps {
  player1: {
    name: string;
    avatar: string;
    score: number;
  };
  player2: {
    name: string;
    avatar: string;
    score: number;
  };
  setScores: Array<{
    player1Score: number;
    player2Score: number;
  }>;
  onAddSet: () => void;
  onCancel: () => void;
  maxSets?: number; // Nombre maximum de sets possible dans le match
}

const PongField: React.FC<PongFieldProps> = ({ 
  player1, 
  player2, 
  setScores, 
  onAddSet, 
  onCancel,
  maxSets = 5 // Par défaut, on utilise 5 sets comme dans MatchPage
}) => {
  return (
    <Box 
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#308cf4', // Bleu de fond
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0',
        margin: '0',
      }}
    >
      {/* Score en haut */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '30px',
        gap: '10px'
      }}>
        <Text 
          size="6" 
          weight="bold" 
          style={{ 
            color: 'white', 
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: '28px'
          }}
        >
          {player1.score} - {player2.score}
        </Text>
        {player1.score > player2.score && (
          <FaTrophy style={{ color: '#FFD700', fontSize: '20px', marginLeft: '5px' }} />
        )}
        {player2.score > player1.score && (
          <FaTrophy style={{ color: '#FFD700', fontSize: '20px', marginLeft: '5px' }} />
        )}
      </div>

      {/* Contenu principal - Table de ping-pong */}
      <Box style={{ 
        position: 'relative', 
        flex: 1, 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0'
      }}>
        {/* Joueur 1 (en haut) */}
        <PlayerDisplay 
          name={player1.name}
          avatar={player1.avatar}
          score={player1.score}
          position="top"
          isWinning={player1.score > player2.score}
        />

        {/* Tableau de score au milieu avec bouton d'ajout */}
        <div style={{ 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          flex: 1
        }}>
          <SetScoreDisplay setScores={setScores} maxSets={maxSets} />
          <AddSetButton onClick={onAddSet} />
        </div>

        {/* Joueur 2 (en bas) */}
        <PlayerDisplay 
          name={player2.name}
          avatar={player2.avatar}
          score={player2.score}
          position="bottom"
          isWinning={player2.score > player1.score}
        />
      </Box>

      {/* Bouton d'abandon en bas */}
      <Box style={{ width: '100%', padding: '0 15px 20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '10px'
        }}>
          <button 
            style={{ 
              padding: '12px 20px', 
              backgroundColor: 'rgba(220, 38, 38, 0.8)', 
              color: 'white', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onClick={onCancel}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.8)'}
          >
            <FaFlag style={{ fontSize: '14px' }} />
            Abandonner le match
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default PongField; 