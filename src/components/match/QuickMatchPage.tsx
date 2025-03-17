import React, { useState } from 'react';
import { Box, Dialog, Button, Flex, Text, Heading } from "@radix-ui/themes";
import PongField from './PongField';
import Image from 'next/image';
import { FaMinus, FaPlus } from 'react-icons/fa';

// Types
type Player = {
    id: string;
    name: string;
    avatar: string;
};

type SetScore = {
    player1Score: number;
    player2Score: number;
};

type MatchSettings = {
    setsToWin: number;
    maxSets: number;
};

interface QuickMatchPageProps {
    onSetsSelected?: (sets: number) => void;
}

// Composant principal QuickMatch
const QuickMatchPage: React.FC<QuickMatchPageProps> = ({ onSetsSelected }) => {
    // États pour les joueurs (à remplacer par des données réelles)
    const [player1, setPlayer1] = useState<Player>({
        id: 'player1',
        name: 'Joueur 1',
        avatar: '/default-avatar.png', // À remplacer par l'URL réelle
    });
    
    const [player2, setPlayer2] = useState<Player>({
        id: 'player2',
        name: 'Joueur 2',
        avatar: '/default-avatar.png', // À remplacer par l'URL réelle
    });

    // État pour les paramètres du match
    const [matchSettings, setMatchSettings] = useState<MatchSettings | null>(null);
    const [matchStarted, setMatchStarted] = useState(false);
    
    // État pour les scores des sets
    const [setScores, setSetScores] = useState<SetScore[]>([]);
    
    // État pour le dialogue d'ajout de set
    const [showAddSetDialog, setShowAddSetDialog] = useState(false);
    const [currentSetPlayer1Score, setCurrentSetPlayer1Score] = useState<number>(0);
    const [currentSetPlayer2Score, setCurrentSetPlayer2Score] = useState<number>(0);

    // Calcul des sets gagnés par chaque joueur
    const player1SetsWon = setScores.filter(set => set.player1Score > set.player2Score).length;
    const player2SetsWon = setScores.filter(set => set.player1Score < set.player2Score).length;

    // Vérifier si le match est terminé
    const isMatchFinished = matchSettings && 
        (player1SetsWon >= matchSettings.setsToWin || player2SetsWon >= matchSettings.setsToWin);

    // Fonction pour démarrer un match
    const startMatch = (setsToWin: number) => {
        const maxSets = setsToWin * 2 - 1; // Nombre maximum de sets possible
        setMatchSettings({ setsToWin, maxSets });
        setMatchStarted(true);
        setSetScores([]);
        
        // Notifier le composant parent du nombre de sets choisi
        if (onSetsSelected) {
            onSetsSelected(maxSets);
        }
    };

    // Fonctions pour incrémenter/décrémenter les scores
    const incrementScore = (player: 'player1' | 'player2') => {
        if (player === 'player1') {
            setCurrentSetPlayer1Score(prev => prev + 1);
        } else {
            setCurrentSetPlayer2Score(prev => prev + 1);
        }
    };

    const decrementScore = (player: 'player1' | 'player2') => {
        if (player === 'player1') {
            setCurrentSetPlayer1Score(prev => prev > 0 ? prev - 1 : 0);
        } else {
            setCurrentSetPlayer2Score(prev => prev > 0 ? prev - 1 : 0);
        }
    };

    // Fonction pour ajouter un set
    const addSet = () => {
        if (currentSetPlayer1Score === currentSetPlayer2Score) {
            // Ne pas permettre les égalités dans un set
            alert("Les scores ne peuvent pas être égaux dans un set");
            return;
        }

        const newSet: SetScore = {
            player1Score: currentSetPlayer1Score,
            player2Score: currentSetPlayer2Score,
        };
        
        setSetScores(prev => [...prev, newSet]);
        setShowAddSetDialog(false);
        setCurrentSetPlayer1Score(0);
        setCurrentSetPlayer2Score(0);
    };

    // Fonction pour réinitialiser le match
    const resetMatch = () => {
        setMatchStarted(false);
        setMatchSettings(null);
        setSetScores([]);
    };

    // Rendu du sélecteur de format de match - Design amélioré
    const renderFormatSelector = () => (
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
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box style={{
                width: '90%',
                maxWidth: '400px',
                backgroundColor: 'rgba(30, 30, 30, 0.85)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '30px 20px',
            }}>
                <Heading size="5" align="center" mb="6" style={{ color: 'white', fontSize: '24px' }}>
                    Format du match
                </Heading>
                <Text size="2" align="center" mb="6" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                    Nombre de sets pour gagner
                </Text>
                <Flex direction="column" gap="4">
                    {[1, 2, 3].map((setsToWin) => {
                        const maxSets = setsToWin * 2 - 1;
                        return (
                            <Button 
                                key={setsToWin}
                                size="3"
                                style={{
                                    height: '80px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                                    color: 'white',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '4px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onClick={() => startMatch(setsToWin)}
                            >
                                {/* Indicateur visuel du nombre de sets */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    display: 'flex',
                                    gap: '4px'
                                }}>
                                    {Array.from({ length: maxSets }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: i < setsToWin ? '#4CAF50' : '#f44336',
                                            opacity: 0.8
                                        }} />
                                    ))}
                                </div>
                                
                                <span style={{ fontSize: '20px' }}>
                                    {setsToWin === 1 ? 'Match simple' : `Best of ${maxSets}`}
                                </span>
                                <span style={{ fontSize: '14px', opacity: 0.8 }}>
                                    {setsToWin} {setsToWin === 1 ? 'set' : 'sets'} pour gagner
                                </span>
                                
                                {/* Visualisation des colonnes */}
                                <div style={{
                                    display: 'flex',
                                    gap: '4px',
                                    marginTop: '8px'
                                }}>
                                    {Array.from({ length: maxSets }).map((_, i) => (
                                        <div key={i} style={{
                                            width: '12px',
                                            height: '20px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: '2px'
                                        }} />
                                    ))}
                                </div>
                            </Button>
                        );
                    })}
                </Flex>
            </Box>
        </Box>
    );

    // Dialogue pour ajouter un set - Simplifié avec des boutons +/-
    const renderAddSetDialog = () => (
        <Dialog.Root open={showAddSetDialog} onOpenChange={setShowAddSetDialog}>
            <Dialog.Content style={{
                maxWidth: '90%',
                width: '340px',
                borderRadius: '16px',
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                padding: '24px',
            }}>
                <Dialog.Title style={{ color: 'white', fontSize: '22px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                    Ajouter un set
                </Dialog.Title>
                
                <Flex direction="column" gap="6" style={{ marginTop: '20px' }}>
                    {/* Score du joueur 1 */}
                    <Flex direction="column" gap="2" align="center">
                        <Text size="3" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{player1.name}</Text>
                        <Flex align="center" gap="4">
                            <button 
                                onClick={() => decrementScore('player1')}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <FaMinus />
                            </button>
                            <div style={{
                                width: '100px',
                                height: '70px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: '32px',
                                fontWeight: 'bold',
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}>
                                {currentSetPlayer1Score}
                            </div>
                            <button 
                                onClick={() => incrementScore('player1')}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: '#1a56db',
                                    border: 'none',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <FaPlus />
                            </button>
                        </Flex>
                    </Flex>
                    
                    {/* Séparateur */}
                    <div style={{ 
                        width: '100%', 
                        height: '1px', 
                        background: 'rgba(255, 255, 255, 0.1)',
                        margin: '5px 0' 
                    }}></div>
                    
                    {/* Score du joueur 2 */}
                    <Flex direction="column" gap="2" align="center">
                        <Text size="3" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{player2.name}</Text>
                        <Flex align="center" gap="4">
                            <button 
                                onClick={() => decrementScore('player2')}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <FaMinus />
                            </button>
                            <div style={{
                                width: '100px',
                                height: '70px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                fontSize: '32px',
                                fontWeight: 'bold',
                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}>
                                {currentSetPlayer2Score}
                            </div>
                            <button 
                                onClick={() => incrementScore('player2')}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: '#1a56db',
                                    border: 'none',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <FaPlus />
                            </button>
                        </Flex>
                    </Flex>
                    
                    {/* Boutons d'action */}
                    <Flex gap="4" mt="5" justify="center" style={{ marginTop: '25px' }}>
                        <Dialog.Close>
                            <Button style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '10px',
                                padding: '12px 18px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '130px',
                                height: '50px',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Annuler
                            </Button>
                        </Dialog.Close>
                        <Button onClick={addSet} style={{
                            backgroundColor: '#1a56db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px 18px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            width: '130px',
                            height: '50px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Valider
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );

    // Rendu principal
    return (
        <>
            {!matchStarted ? (
                renderFormatSelector()
            ) : (
                <>
                    <PongField 
                        player1={{
                            name: player1.name,
                            avatar: player1.avatar,
                            score: player1SetsWon
                        }}
                        player2={{
                            name: player2.name,
                            avatar: player2.avatar,
                            score: player2SetsWon
                        }}
                        setScores={setScores}
                        onAddSet={() => setShowAddSetDialog(true)}
                        onCancel={resetMatch}
                        maxSets={matchSettings ? matchSettings.maxSets : 3}
                    />
                    {renderAddSetDialog()}
                </>
            )}
        </>
    );
};

export default QuickMatchPage; 