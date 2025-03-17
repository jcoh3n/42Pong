import React from 'react';
import { Box, Text } from '@radix-ui/themes';

interface SetScoreDisplayProps {
    setScores: Array<{
        player1Score: number;
        player2Score: number;
    }>;
    maxSets?: number;
}

const SetScoreDisplay: React.FC<SetScoreDisplayProps> = ({ 
    setScores,
    maxSets = 5 // Par défaut, on utilise 5 sets
}) => {
    // Style pour le conteneur principal
    const containerStyle = {
        width: maxSets === 1 ? '50%' : '90%', // 50% pour quick match, 90% pour ranked
        maxWidth: maxSets === 1 ? '200px' : '450px', // 200px pour quick match, 450px pour ranked
        margin: '0 auto',
        padding: '15px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    };

    // Style pour chaque colonne de score
    const columnStyle = {
        flex: 1,
        minWidth: 0,
        textAlign: 'center' as const,
        padding: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontSize: maxSets === 1 ? '24px' : '14px', // Police plus grande pour quick match
    };

    return (
        <Box style={containerStyle}>
            <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'space-between',
            }}>
                {Array.from({ length: maxSets }).map((_, index) => (
                    <div key={index} style={columnStyle}>
                        {index < setScores.length ? (
                            <Text style={{ 
                                color: 'white',
                                fontSize: maxSets === 1 ? '24px' : '14px'
                            }}>
                                {setScores[index].player1Score} - {setScores[index].player2Score}
                            </Text>
                        ) : (
                            <Text style={{ 
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontSize: maxSets === 1 ? '24px' : '14px'
                            }}>
                                -
                            </Text>
                        )}
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default SetScoreDisplay; 