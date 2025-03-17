import React from 'react';
import { Text } from '@radix-ui/themes';
import { FaTrophy } from 'react-icons/fa';
import Image from 'next/image';

interface PlayerDisplayProps {
  name: string;
  avatar: string;
  score: number;
  position: 'top' | 'bottom';
  isWinning: boolean;
}

/**
 * Composant pour afficher les informations d'un joueur
 */
const PlayerDisplay: React.FC<PlayerDisplayProps> = ({ 
  name, 
  avatar, 
  score, 
  position, 
  isWinning 
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: position === 'top' ? '10px 0 30px' : '30px 0 10px',
      position: 'relative',
      zIndex: 2
    }}>
      {/* Avatar du joueur */}
      <div style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid white',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        marginBottom: '10px'
      }}>
        <Image
          src={avatar}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* Nom du joueur */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        justifyContent: 'center'
      }}>
        <Text 
          size="4" 
          weight="bold" 
          style={{ 
            color: 'white', 
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            fontSize: '18px'
          }}
        >
          {name}
        </Text>
        {isWinning && (
          <FaTrophy style={{ color: '#FFD700', fontSize: '14px' }} />
        )}
      </div>
    </div>
  );
};

export default PlayerDisplay; 