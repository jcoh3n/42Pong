import React from 'react';

type SetScore = {
  player1Score: number;
  player2Score: number;
};

interface SetScoreDisplayProps {
  setScores: SetScore[];
  maxSets: number;
}

/**
 * Composant pour afficher les scores des sets dans un tableau
 */
const SetScoreDisplay: React.FC<SetScoreDisplayProps> = ({ setScores, maxSets }) => {
  // Créer un tableau avec le bon nombre de sets
  const displayedSets = [...setScores];
  
  // Compléter avec des sets vides si nécessaire
  while (displayedSets.length < maxSets) {
    displayedSets.push({ player1Score: 0, player2Score: 0 });
  }

  // Adapter la largeur et le style en fonction du nombre de sets
  const getContainerStyle = () => {
    // Pour un seul set (Quick Match)
    if (maxSets === 1) {
      return {
        width: '50%',
        maxWidth: '200px',
        height: '120px', // Plus grand pour un seul set
      };
    }
    
    // Pour 5 sets (Ranked Match)
    if (maxSets === 5) {
      return {
        width: '90%',
        maxWidth: '450px',
        height: '90px',
      };
    }
    
    // Pour les autres cas (3 sets par défaut)
    return {
      width: '70%',
      maxWidth: '350px',
      height: '90px',
    };
  };

  // Adapter la taille des cellules en fonction du nombre de sets
  const getCellStyle = (isRealSet: boolean) => {
    const baseStyle = {
      flex: 1,
      height: '100%', 
      border: '1px solid rgba(255, 255, 255, 0.4)', 
      borderRadius: '10px', 
      background: isRealSet ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '2px 0',
      overflow: 'hidden',
      boxShadow: isRealSet ? 'inset 0 1px 3px rgba(255, 255, 255, 0.1)' : 'none',
      transition: 'all 0.3s ease'
    };

    // Pour un seul set, on augmente la taille de la police
    if (maxSets === 1) {
      return {
        ...baseStyle,
        fontSize: '24px',
      };
    }

    return baseStyle;
  };

  // Adapter la taille du texte en fonction du nombre de sets
  const getScoreTextStyle = (isWinner: boolean, maxSets: number) => {
    const baseStyle = {
      color: 'white', 
      fontWeight: 'bold' as const,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
      padding: '4px 0',
      width: '100%',
      textAlign: 'center' as const,
      backgroundColor: isWinner ? 'rgba(34, 197, 94, 0.8)' : 'transparent',
      transition: 'background-color 0.3s ease',
      boxShadow: isWinner ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
      position: 'relative' as const
    };

    // Adapter la taille de la police en fonction du nombre de sets
    if (maxSets === 1) {
      return {
        ...baseStyle,
        fontSize: '24px',
      };
    } else if (maxSets === 5) {
      return {
        ...baseStyle,
        fontSize: '14px',
      };
    }

    return {
      ...baseStyle,
      fontSize: '16px',
    };
  };

  const containerStyle = getContainerStyle();

  return (
    <div 
      style={{
        position: 'relative',
        width: containerStyle.width,
        maxWidth: containerStyle.maxWidth,
        height: containerStyle.height,
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
        overflow: 'hidden',
        margin: '0 auto' // Assurer le centrage horizontal
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
              style={getCellStyle(isRealSet)}
            >
              {/* Score du joueur 1 */}
              <div style={getScoreTextStyle(player1Won, maxSets)}>
                {isRealSet ? set.player1Score : '-'}
                {player1Won && isRealSet && (
                  <span style={{ 
                    position: 'absolute', 
                    right: '5px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    fontSize: '10px',
                    color: '#FFD700'
                  }}>
                    ✓
                  </span>
                )}
              </div>
              
              {/* Séparateur */}
              <div style={{ 
                width: '90%', 
                height: '1px', 
                background: 'rgba(255, 255, 255, 0.5)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}></div>
              
              {/* Score du joueur 2 */}
              <div style={getScoreTextStyle(player2Won, maxSets)}>
                {isRealSet ? set.player2Score : '-'}
                {player2Won && isRealSet && (
                  <span style={{ 
                    position: 'absolute', 
                    right: '5px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    fontSize: '10px',
                    color: '#FFD700'
                  }}>
                    ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SetScoreDisplay; 