import React, { useState } from 'react';
import { Box, Dialog, TextField, Button, Flex, Text, Heading } from "@radix-ui/themes";
import PongField from './PongField';
import Image from 'next/image';

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

// Composant principal QuickMatch
const QuickMatchPage: React.FC = () => {
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

    // Rendu du sélecteur de format de match
    const renderFormatSelector = () => (
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
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box className="w-full max-w-md mx-auto p-6 rounded-xl" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                borderRadius: '15px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                margin: '0 20px',
            }}>
                <Heading size="5" align="center" mb="6" style={{ color: 'white' }}>
                    Sélectionnez le format du match
                </Heading>
                <Text size="2" align="center" mb="4" style={{ color: 'white' }}>
                    Choisissez le nombre de sets nécessaires pour gagner
                </Text>
                <Flex direction="column" gap="5">
                    {[1, 2, 3].map((setsToWin) => (
                        <Button 
                            key={setsToWin}
                            size="3"
                            style={{
                                height: '60px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, background-color 0.2s',
                            }}
                            onClick={() => startMatch(setsToWin)}
                        >
                            {setsToWin === 1 ? 'Match simple' : `Best of ${setsToWin * 2 - 1}`} ({setsToWin} sets pour gagner)
                        </Button>
                    ))}
                </Flex>
            </Box>
        </Box>
    );

    // Dialogue pour ajouter un set
    const renderAddSetDialog = () => (
        <Dialog.Root open={showAddSetDialog} onOpenChange={setShowAddSetDialog}>
            <Dialog.Content style={{
                maxWidth: '90%',
                width: '350px',
                borderRadius: '15px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                padding: '20px',
            }}>
                <Dialog.Title style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>
                    Ajouter un set
                </Dialog.Title>
                <Dialog.Description size="2" mb="4" style={{ color: '#94a3b8' }}>
                    Entrez les scores du set terminé
                </Dialog.Description>
                
                <Flex direction="column" gap="4">
                    <Flex justify="between" align="center" gap="4">
                        <Box className="flex-1">
                            <Text size="2" mb="2" style={{ color: 'white' }}>{player1.name}</Text>
                            <TextField.Root>
                                <TextField.Slot>
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={currentSetPlayer1Score.toString()} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentSetPlayer1Score(parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border rounded"
                                        style={{
                                            backgroundColor: '#1e293b',
                                            color: 'white',
                                            border: '1px solid #475569',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontSize: '16px',
                                            width: '100%',
                                        }}
                                    />
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>
                        
                        <Box className="flex-1">
                            <Text size="2" mb="2" style={{ color: 'white' }}>{player2.name}</Text>
                            <TextField.Root>
                                <TextField.Slot>
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={currentSetPlayer2Score.toString()} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentSetPlayer2Score(parseInt(e.target.value) || 0)}
                                        className="w-full p-2 border rounded"
                                        style={{
                                            backgroundColor: '#1e293b',
                                            color: 'white',
                                            border: '1px solid #475569',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontSize: '16px',
                                            width: '100%',
                                        }}
                                    />
                                </TextField.Slot>
                            </TextField.Root>
                        </Box>
                    </Flex>
                    
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button style={{
                                backgroundColor: '#475569',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 15px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}>
                                Annuler
                            </Button>
                        </Dialog.Close>
                        <Button onClick={addSet} style={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 15px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}>
                            Enregistrer
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
                    />
                    {renderAddSetDialog()}
                </>
            )}
        </>
    );
};

export default QuickMatchPage; 