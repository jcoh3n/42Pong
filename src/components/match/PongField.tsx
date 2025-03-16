import React from 'react';
import { Box, Text } from '@radix-ui/themes';
import Image from 'next/image';

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
}

const PongField: React.FC<PongFieldProps> = ({ player1, player2, setScores, onAddSet, onCancel }) => {
  // Limiter l'affichage à 3 sets maximum
  const displayedSets = setScores.slice(0, 3);
  
  // Compléter avec des sets vides si moins de 3 sets
  while (displayedSets.length < 3) {
    displayedSets.push({ player1Score: 0, player2Score: 0 });
  }

  return (
    <Box 
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0369a1', // Bleu légèrement plus foncé
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
      <Text 
        size="6" 
        weight="bold" 
        style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginTop: '30px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        {player1.score} - {player2.score}
      </Text>

      {/* Contenu principal - Table de ping-pong */}
      <Box style={{ position: 'relative', flex: 1, width: '100%' }}>
        {/* Joueur 1 (cercle gris en haut avec photo) */}
        <div 
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db', // Gris clair
            border: '3px solid white',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {player1.avatar && (
              <Image 
                src={player1.avatar} 
                alt={player1.name} 
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </div>

        {/* Joueur 2 (cercle gris en bas avec photo) */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db', // Gris clair
            border: '3px solid white',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {player2.avatar && (
              <Image 
                src={player2.avatar} 
                alt={player2.name} 
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </div>

        {/* Raquette rouge (en haut à droite) */}
        <div 
          style={{
            position: 'absolute',
            top: '30%',
            right: '20%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 4,
          }}
        >
          <div 
            style={{
              width: '12px',
              height: '35px',
              backgroundColor: '#fcd34d', // Jaune pour la poignée
            }}
          />
          <div 
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: '#ef4444', // Rouge
            }}
          />
        </div>

        {/* Raquette noire (en bas à gauche) */}
        <div 
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '20%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 4,
          }}
        >
          <div 
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: '#1f2937', // Noir
            }}
          />
          <div 
            style={{
              width: '12px',
              height: '35px',
              backgroundColor: '#fcd34d', // Jaune pour la poignée
            }}
          />
        </div>

        {/* Tableau de score au milieu */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '80px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(5px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
          }}
        >
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '90%',
              height: '80%',
            }}
          >
            {displayedSets.map((set, index) => (
              <div 
                key={index}
                style={{ 
                  width: '30px', 
                  height: '100%', 
                  border: '1px solid rgba(255, 255, 255, 0.5)', 
                  borderRadius: '4px', 
                  margin: '0 2px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  padding: '2px 0',
                }}
              >
                {/* Score du joueur 1 */}
                <div style={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}>
                  {index < setScores.length ? set.player1Score : '-'}
                </div>
                
                {/* Séparateur */}
                <div style={{ 
                  width: '80%', 
                  height: '1px', 
                  background: 'rgba(255, 255, 255, 0.3)' 
                }}></div>
                
                {/* Score du joueur 2 */}
                <div style={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}>
                  {index < setScores.length ? set.player2Score : '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>

      {/* Informations des joueurs et boutons en bas */}
      <Box style={{ width: '100%', padding: '0 15px 15px' }}>
        {/* Noms des joueurs */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '15px',
          color: 'white'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Text size="4" weight="bold" style={{ color: 'white' }}>{player1.name}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="4" weight="bold" style={{ color: 'white' }}>{player2.name}</Text>
          </div>
        </div>

        {/* Boutons d'action */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <button 
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: '#2563eb', // Bleu plus vif
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
            onClick={onAddSet}
          >
            Ajouter un set
          </button>
          <button 
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: '#2563eb', // Bleu plus vif
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      </Box>
    </Box>
  );
};

export default PongField; 