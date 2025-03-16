import React from 'react';
import { Box, Text } from '@radix-ui/themes';
import Image from 'next/image';
import { FaTableTennis } from 'react-icons/fa';

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
  maxSets = 3 // Par défaut, on affiche 3 sets
}) => {
  // Créer un tableau avec le bon nombre de sets
  const displayedSets = [...setScores];
  
  // Compléter avec des sets vides si nécessaire
  while (displayedSets.length < maxSets) {
    displayedSets.push({ player1Score: 0, player2Score: 0 });
  }

  return (
    <Box 
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#308cf4', // Nouveau bleu demandé
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
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontSize: '28px'
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
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db', // Gris clair
            border: '4px solid white',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
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
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#d1d5db', // Gris clair
            border: '4px solid white',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
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

        {/* Tableau de score au milieu - Design simplifié et plus foncé */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: maxSets <= 3 ? '70%' : '85%', // Largeur adaptative selon le nombre de colonnes
            maxWidth: maxSets <= 3 ? '350px' : '450px',
            height: '90px', // Hauteur réduite
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 30, 30, 0.85)', // Plus foncé, presque noir
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
            padding: '8px',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
              height: '100%',
              gap: '6px',
              position: 'relative',
              zIndex: 2
            }}
          >
            {displayedSets.map((set, index) => {
              const player1Won = index < setScores.length && set.player1Score > set.player2Score;
              const player2Won = index < setScores.length && set.player1Score < set.player2Score;
              const isRealSet = index < setScores.length;
              
              return (
                <div 
                  key={index}
                  style={{ 
                    flex: 1,
                    height: '100%', 
                    border: '1px solid rgba(255, 255, 255, 0.4)', 
                    borderRadius: '10px', 
                    background: isRealSet ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '2px 0',
                    overflow: 'hidden',
                    boxShadow: isRealSet ? 'inset 0 1px 3px rgba(255, 255, 255, 0.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Score du joueur 1 */}
                  <div style={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    padding: '4px 0',
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: player1Won ? 'rgba(34, 197, 94, 0.7)' : 'transparent',
                    transition: 'background-color 0.3s ease',
                    boxShadow: player1Won ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                  }}>
                    {isRealSet ? set.player1Score : '-'}
                  </div>
                  
                  {/* Séparateur */}
                  <div style={{ 
                    width: '90%', 
                    height: '1px', 
                    background: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}></div>
                  
                  {/* Score du joueur 2 */}
                  <div style={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    padding: '4px 0',
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: player2Won ? 'rgba(34, 197, 94, 0.7)' : 'transparent',
                    transition: 'background-color 0.3s ease',
                    boxShadow: player2Won ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                  }}>
                    {isRealSet ? set.player2Score : '-'}
                  </div>
                </div>
              );
            })}
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
            <Text size="4" weight="bold" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>{player1.name}</Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text size="4" weight="bold" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>{player2.name}</Text>
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
              padding: '14px', 
              backgroundColor: '#1a56db', // Bleu plus foncé
              color: 'white', 
              border: 'none', 
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
            onClick={onAddSet}
          >
            Ajouter un set
          </button>
          <button 
            style={{ 
              flex: 1, 
              padding: '14px', 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              color: 'white', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
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