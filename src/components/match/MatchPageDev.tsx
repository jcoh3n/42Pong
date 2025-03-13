import React, { useState, useEffect } from 'react';
import { Box, Container, Text, Flex, Button, Card, Heading, Separator, Badge, Dialog, TextField } from "@radix-ui/themes";
import MatchInfo from './MatchInfo';
import WinPopup from './WinPopup';
import LosePopup from './LosePopup';

// Type pour le match
type MockMatch = {
    id: string;
    status: string;
    user_1_id: string;
    user_2_id: string;
    user_1_score: number;
    user_2_score: number;
    winner_id: string | null;
    sets_history?: SetResult[];  // Historique des sets
};

// Type pour le format de match
type MatchFormat = {
    name: string;
    setsToWin: number;
    maxSets: number;
};

// Type pour un set
type SetResult = {
    winner: 'player1' | 'player2';
    player1Score: number;
    player2Score: number;
};

// Mock data for development
const mockMatch: MockMatch = {
    id: 'dev-match-1',
    status: 'in_progress',
    user_1_id: 'current-user',
    user_2_id: 'opponent',
    user_1_score: 0,
    user_2_score: 0,
    winner_id: null,
};

const mockCurrentUser = {
    id: 'current-user',
    login: 'Developer',
    avatar_url: '',
    created_at: '2023-01-01',
    elo_score: 1000,
    language: 'fr',
    notifications: true,
    theme: 'dark'
};

const mockOpponent = {
    id: 'opponent',
    login: 'Test Opponent',
    avatar_url: '',
    created_at: '2023-01-01',
    elo_score: 1000,
    language: 'fr',
    notifications: true,
    theme: 'dark'
};

// Formats de match disponibles
const MATCH_FORMATS: MatchFormat[] = [
    { name: "Best of 3", setsToWin: 2, maxSets: 3 },
    { name: "Best of 5", setsToWin: 3, maxSets: 5 },
    { name: "Best of 7", setsToWin: 4, maxSets: 7 },
];

/**
 * Version de développement de la page de match
 * 
 * Cette page permet de développer et tester les fonctionnalités
 * de la page de match sans avoir besoin d'être dans un vrai match.
 * 
 * Utilisez cette page comme base pour votre développement, puis
 * transférez les modifications vers MatchPage.tsx une fois terminé.
 */
const MatchPageDev = () => {
    // État local pour simuler un match
    const [match, setMatch] = useState<MockMatch>(mockMatch);
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [showLosePopup, setShowLosePopup] = useState(false);
    
    // États pour le nouveau système de suivi de match
    const [matchStarted, setMatchStarted] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<MatchFormat | null>(null);
    const [sets, setSets] = useState<SetResult[]>([]);
    const [showAddSetDialog, setShowAddSetDialog] = useState(false);
    const [newSetWinner, setNewSetWinner] = useState<'player1' | 'player2'>('player1');
    const [player1SetScore, setPlayer1SetScore] = useState<number>(0);
    const [player2SetScore, setPlayer2SetScore] = useState<number>(0);

    // Calculer les scores des sets
    const player1SetsWon = sets.filter(set => set.winner === 'player1').length;
    const player2SetsWon = sets.filter(set => set.winner === 'player2').length;

    // Vérifier si un joueur a gagné le match
    const checkMatchWinner = () => {
        if (selectedFormat && (player1SetsWon >= selectedFormat.setsToWin || player2SetsWon >= selectedFormat.setsToWin)) {
            // Mettre à jour le match avec l'historique des sets
            const updatedMatch = {
                ...match,
                status: 'completed',
                winner_id: player1SetsWon >= selectedFormat.setsToWin ? 'current-user' : 'opponent',
                sets_history: [...sets]
            };
            
            setMatch(updatedMatch);
            
            // Afficher la popup appropriée
            if (player1SetsWon >= selectedFormat.setsToWin) {
                setShowWinPopup(true);
            } else {
                setShowLosePopup(true);
            }
            
            // Enregistrer les statistiques du match
            saveMatchStats(updatedMatch);
        }
    };

    // Enregistrer les statistiques du match
    const saveMatchStats = (matchData: MockMatch) => {
        console.log("Match terminé! Statistiques enregistrées:", matchData);
        
        // Calculer les statistiques des sets
        const setStats = {
            totalSets: sets.length,
            player1: {
                setsWon: player1SetsWon,
                totalPoints: sets.reduce((sum, set) => sum + set.player1Score, 0)
            },
            player2: {
                setsWon: player2SetsWon,
                totalPoints: sets.reduce((sum, set) => sum + set.player2Score, 0)
            }
        };
        
        console.log("Statistiques des sets:", setStats);
        
        // Dans une application réelle, vous enverriez ces données à votre API
        // Exemple: api.saveMatchStats(matchData.id, setStats);
    };
    
    // Vérifier la victoire après chaque ajout de set
    useEffect(() => {
        if (sets.length > 0) {
            checkMatchWinner();
        }
    }, [sets]);

    // Démarrer un match avec le format sélectionné
    const startMatch = (format: MatchFormat) => {
        setSelectedFormat(format);
        setMatchStarted(true);
        setSets([]);
    };

    // Ajouter un nouveau set
    const addSet = () => {
        // Déterminer le gagnant réel en fonction des scores
        const realWinner = player1SetScore > player2SetScore ? 'player1' : 'player2';
        
        const newSet: SetResult = {
            winner: realWinner, // Utiliser le gagnant réel basé sur les scores
            player1Score: player1SetScore,
            player2Score: player2SetScore,
        };
        
        setSets(prev => [...prev, newSet]);
        setShowAddSetDialog(false);
        setPlayer1SetScore(0);
        setPlayer2SetScore(0);
    };

    // Réinitialiser le match
    const resetMatch = () => {
        setMatch({...mockMatch});
        setShowWinPopup(false);
        setShowLosePopup(false);
        setMatchStarted(false);
        setSelectedFormat(null);
        setSets([]);
    };

    // Simuler l'abandon du match
    const forfeitMatch = () => {
        setMatch(prev => ({
            ...prev,
            status: 'completed',
            winner_id: 'opponent',
        }));
        setShowLosePopup(true);
    };

    // Rendu du tableau de score
    const renderScoreboard = () => {
        if (!selectedFormat) return null;
        
        return (
            <Card className="w-full max-w-md mx-auto shadow-xl rounded-xl overflow-hidden border-0"
                style={{
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                }}
            >
                <Flex direction="column" p="6" gap="4">
                    <Heading size="4" align="center" className="mb-3 text-blue-100">
                        {selectedFormat.name} - {player1SetsWon} vs {player2SetsWon}
                    </Heading>
                    
                    <Flex justify="between" align="center" className="mb-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                        <Box className="text-center px-4">
                            <Badge size="2" color="blue" className="mb-2 px-3 py-1 font-bold">{player1SetsWon}</Badge>
                            <Text size="2" weight="bold" className="text-blue-100">{mockCurrentUser.login}</Text>
                            {match.sets_history && (
                                <Text size="1" className="mt-1 text-blue-300">
                                    Total: {match.sets_history.reduce((sum, set) => sum + set.player1Score, 0)} pts
                                </Text>
                            )}
                        </Box>
                        
                        <Text size="5" weight="bold" className="text-gray-400">VS</Text>
                        
                        <Box className="text-center px-4">
                            <Badge size="2" color="crimson" className="mb-2 px-3 py-1 font-bold">{player2SetsWon}</Badge>
                            <Text size="2" weight="bold" className="text-blue-100">{mockOpponent.login}</Text>
                            {match.sets_history && (
                                <Text size="1" className="mt-1 text-blue-300">
                                    Total: {match.sets_history.reduce((sum, set) => sum + set.player2Score, 0)} pts
                                </Text>
                            )}
                        </Box>
                    </Flex>
                    
                    {/* Afficher le statut du match */}
                    {match.status === 'completed' && (
                        <Box className="text-center my-2">
                            <Badge 
                                size="2" 
                                className="px-4 py-1 font-bold animate-pulse"
                                style={{ 
                                    background: match.winner_id === 'current-user' 
                                        ? 'linear-gradient(135deg, #047857 0%, #10b981 100%)' 
                                        : 'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)',
                                    color: 'white',
                                    borderRadius: '999px'
                                }}
                            >
                                {match.winner_id === 'current-user' ? 'Victoire' : 'Défaite'}
                            </Badge>
                        </Box>
                    )}
                    
                    <Separator size="4" className="my-3" style={{ background: 'rgba(148, 163, 184, 0.2)' }} />
                    
                    {/* Tableau des sets */}
                    <Box className="my-2">
                        <Text size="2" weight="bold" className="text-blue-100 mb-2">Historique des sets</Text>
                        <Box className="overflow-x-auto rounded-lg p-3" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                            <Flex>
                                {Array.from({ length: selectedFormat.maxSets }).map((_, index) => (
                                    <Box 
                                        key={index} 
                                        className="min-w-[70px] p-2 text-center border-r border-gray-600 last:border-r-0"
                                    >
                                        <Text size="1" weight="bold" className="mb-2 text-gray-400">Set {index + 1}</Text>
                                        {sets[index] ? (
                                            <Flex direction="column" gap="2" align="center">
                                                <Text 
                                                    size="3" 
                                                    weight="bold" 
                                                    className={sets[index].player1Score > sets[index].player2Score ? 'text-blue-400' : 'text-gray-500'}
                                                >
                                                    {sets[index].player1Score}
                                                </Text>
                                                <Text 
                                                    size="3" 
                                                    weight="bold" 
                                                    className={sets[index].player2Score > sets[index].player1Score ? 'text-red-400' : 'text-gray-500'}
                                                >
                                                    {sets[index].player2Score}
                                                </Text>
                                            </Flex>
                                        ) : (
                                            <Flex direction="column" gap="2" align="center">
                                                <Text size="3" className="text-gray-600">-</Text>
                                                <Text size="3" className="text-gray-600">-</Text>
                                            </Flex>
                                        )}
                                    </Box>
                                ))}
                            </Flex>
                        </Box>
                    </Box>
                    
                    <Button 
                        size="3" 
                        className="mt-3 py-4 font-medium transition-all duration-300 hover:scale-105 rounded-xl text-base"
                        style={{
                            background: match.status === 'completed' || (selectedFormat && (player1SetsWon >= selectedFormat.setsToWin || player2SetsWon >= selectedFormat.setsToWin))
                                ? 'rgba(6, 95, 70, 0.5)'
                                : 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
                            color: 'white',
                            border: 'none',
                        }}
                        onClick={() => setShowAddSetDialog(true)}
                        disabled={match.status === 'completed' || (selectedFormat && (player1SetsWon >= selectedFormat.setsToWin || player2SetsWon >= selectedFormat.setsToWin))}
                    >
                        {match.status === 'completed' 
                            ? 'Match terminé' 
                            : (
                                <Flex align="center" justify="center" gap="2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    <span>Ajouter un set</span>
                                </Flex>
                            )
                        }
                    </Button>
                </Flex>
            </Card>
        );
    };

    // Rendu de l'interface mobile face-à-face
    const renderMobileInterface = () => (
        <Flex direction="column" className="h-screen" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
            {/* Joueur 2 (Adversaire) en haut */}
            <Box className="p-4 text-center pt-16" style={{ background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)' }}>
                <Flex align="center" justify="center" gap="3">
                    <Box className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        style={{ 
                            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
                        }}
                    >
                        <Text size="4">TE</Text>
                    </Box>
                    <Box>
                        <Text size="3" weight="bold" className="text-blue-100">{mockOpponent.login}</Text>
                        <Text size="7" weight="bold" className="text-white">{player2SetsWon}</Text>
                    </Box>
                </Flex>
            </Box>
            
            {/* Tableau de score au centre */}
            <Box className="flex-grow flex items-center justify-center p-4 overflow-y-auto">
                <Box className="w-full max-w-md">
                    {!matchStarted ? renderFormatSelector() : renderScoreboard()}
                </Box>
            </Box>
            
            {/* Joueur 1 (Utilisateur) en bas */}
            <Box className="p-4 text-center" style={{ background: 'linear-gradient(0deg, #1e40af 0%, #1e3a8a 100%)' }}>
                <Flex align="center" justify="center" gap="3">
                    <Box>
                        <Text size="3" weight="bold" className="text-blue-100">{mockCurrentUser.login}</Text>
                        <Text size="7" weight="bold" className="text-white">{player1SetsWon}</Text>
                    </Box>
                    <Box className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        style={{ 
                            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
                        }}
                    >
                        <Text size="4">DE</Text>
                    </Box>
                </Flex>
            </Box>
            
            {/* Contrôles de développement */}
            <Flex gap="4" p="3" justify="center" style={{ background: 'rgba(15, 23, 42, 0.9)' }}>
                <Button
                    size="2"
                    className="px-4 py-2 transition-all duration-300 hover:scale-105 rounded-lg"
                    style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                        color: 'white',
                        border: 'none'
                    }}
                    onClick={resetMatch}
                >
                    <Flex align="center" gap="2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 2v6h6"></path>
                            <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                        </svg>
                        <span>Réinitialiser</span>
                    </Flex>
                </Button>
                <Button
                    size="2"
                    className="px-4 py-2 transition-all duration-300 hover:scale-105 rounded-lg"
                    style={{
                        background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
                        color: 'white',
                        border: 'none'
                    }}
                    onClick={forfeitMatch}
                >
                    <Flex align="center" gap="2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                        <span>Abandonner</span>
                    </Flex>
                </Button>
            </Flex>
        </Flex>
    );

    // Rendu du sélecteur de format de match
    const renderFormatSelector = () => (
        <Box className="w-full max-w-md mx-auto p-6 rounded-xl">
            <Heading size="5" align="center" mb="6" className="text-blue-100 font-bold">
                Sélectionnez le format du match
            </Heading>
            <Text size="2" align="center" mb="4" className="text-blue-200">
                Choisissez le nombre de sets nécessaires pour gagner
            </Text>
            <Flex direction="column" gap="5">
                {MATCH_FORMATS.map((format) => (
                    <Button 
                        key={format.name}
                        size="3"
                        variant="soft"
                        className="h-16 text-lg font-medium transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:text-white rounded-xl shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none'
                        }}
                        onClick={() => startMatch(format)}
                    >
                        {format.name} ({format.setsToWin} sets pour gagner)
                    </Button>
                ))}
            </Flex>
        </Box>
    );

    // Dialogue pour ajouter un set
    const renderAddSetDialog = () => (
        <Dialog.Root open={showAddSetDialog} onOpenChange={setShowAddSetDialog}>
            <Dialog.Content className="max-w-md rounded-xl border-0 shadow-2xl"
                style={{
                    background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
                    color: '#e2e8f0'
                }}
            >
                <Dialog.Title className="text-blue-100 text-xl">Ajouter un set</Dialog.Title>
                <Dialog.Description size="2" mb="4" className="text-blue-200">
                    Entrez les scores du set terminé
                </Dialog.Description>

                <Flex direction="column" gap="4">
                    <Box className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                        <Text as="label" size="2" mb="3" weight="bold" className="text-blue-100 block">Score du set</Text>
                        <Flex gap="4" className="mt-3" align="center">
                            <Box className="flex-1 text-center">
                                <Text size="2" weight="bold" className="text-blue-100 mb-2">{mockCurrentUser.login}</Text>
                                <TextField.Root className="mt-1">
                                    <TextField.Slot>
                                        <input 
                                            type="number" 
                                            value={player1SetScore.toString()} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayer1SetScore(parseInt(e.target.value) || 0)}
                                            min="0"
                                            className="w-full p-3 border rounded-lg bg-gray-800 text-white border-gray-700 text-center text-lg"
                                        />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>
                            
                            <Text size="3" weight="bold" className="text-gray-400 mx-2">-</Text>
                            
                            <Box className="flex-1 text-center">
                                <Text size="2" weight="bold" className="text-blue-100 mb-2">{mockOpponent.login}</Text>
                                <TextField.Root className="mt-1">
                                    <TextField.Slot>
                                        <input 
                                            type="number" 
                                            value={player2SetScore.toString()} 
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayer2SetScore(parseInt(e.target.value) || 0)}
                                            min="0"
                                            className="w-full p-3 border rounded-lg bg-gray-800 text-white border-gray-700 text-center text-lg"
                                        />
                                    </TextField.Slot>
                                </TextField.Root>
                            </Box>
                        </Flex>
                    </Box>
                    
                    <Box className="mt-2 text-center">
                        <Text size="2" className="text-blue-200">
                            Le gagnant sera déterminé automatiquement en fonction des scores
                        </Text>
                    </Box>
                </Flex>

                <Flex gap="3" mt="5" justify="center">
                    <Dialog.Close>
                        <Button 
                            className="transition-all duration-300 hover:scale-105 rounded-lg px-5 py-2"
                            style={{
                                background: 'rgba(100, 116, 139, 0.3)',
                                color: '#e2e8f0',
                                border: 'none'
                            }}
                        >
                            Annuler
                        </Button>
                    </Dialog.Close>
                    <Button 
                        onClick={addSet}
                        className="transition-all duration-300 hover:scale-105 rounded-lg px-5 py-2"
                        style={{
                            background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        Enregistrer
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );

    return (
        <>
            {/* Popup de victoire */}
            <WinPopup
                isOpen={showWinPopup}
                onClose={resetMatch}
            />

            {/* Popup de défaite */}
            <LosePopup
                isOpen={showLosePopup}
                onClose={resetMatch}
            />
            
            {/* Dialogue pour ajouter un set */}
            {renderAddSetDialog()}
            
            {/* Interface mobile */}
            {renderMobileInterface()}
        </>
    );
};

export default MatchPageDev; 