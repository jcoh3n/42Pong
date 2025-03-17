import React, { useState, useEffect } from 'react';
import { Box, Container, Text, Flex, Button, Dialog } from "@radix-ui/themes";
import Loading from "@/components/Loading";
import useCurrentMatch, { MatchData } from '@/hooks/matchmaking/useCurrentMatch';
import PongField from './PongField';
import { FaMinus, FaPlus } from 'react-icons/fa';
import WinPopup from './WinPopup';
import LosePopup from './LosePopup';
import { useRouter } from 'next/navigation';

export type MatchPageProps = {
	matchId: string,
	onLeave: () => void;
	maxSets?: number; // Nombre maximum de sets possible dans le match
};

// Type pour un set
type SetScore = {
    player1Score: number;
    player2Score: number;
};

// Main MatchPage component
const MatchPage: React.FC<MatchPageProps> = ({
	matchId,
	onLeave,
	maxSets = 5, // Par défaut, on utilise 5 sets (best of 5)
}) => {
	const router = useRouter();
	
	// Use the useCurrentMatch hook to get all match-related data and functions
	const {
		match,
		currentUser,
		opponent,
		isLoading,
		error,
		forfeitMatch,
		incrementScore,
		isForfeiting
	} = useCurrentMatch(matchId);

	// État pour les scores des sets
    const [setScores, setSetScores] = useState<SetScore[]>([]);
    
    // État pour le dialogue d'ajout de set
    const [showAddSetDialog, setShowAddSetDialog] = useState(false);
    const [currentSetPlayer1Score, setCurrentSetPlayer1Score] = useState<number>(0);
    const [currentSetPlayer2Score, setCurrentSetPlayer2Score] = useState<number>(0);

	// Calcul des sets gagnés par chaque joueur
    const player1SetsWon = setScores.filter(set => set.player1Score > set.player2Score).length;
    const player2SetsWon = setScores.filter(set => set.player1Score < set.player2Score).length;

	// Déterminer si le match est terminé
    const [isMatchOver, setIsMatchOver] = useState(false);
    const [isWinner, setIsWinner] = useState(false);

    // Calculer le nombre de sets nécessaires pour gagner en fonction de maxSets
    const setsToWin = Math.ceil(maxSets / 2);

    // Vérifier si le match est terminé après chaque ajout de set
    useEffect(() => {
        if (!match) return;

        // Vérifier si un joueur a gagné
        if (player1SetsWon >= setsToWin || player2SetsWon >= setsToWin) {
            // Ajouter un délai avant d'afficher le popup
            setTimeout(() => {
                setIsMatchOver(true);
                
                // Déterminer si le joueur actuel est le gagnant
                const isCurrentUserPlayer1 = currentUser.data?.id === match.user_1_id;
                const currentUserSetsWon = isCurrentUserPlayer1 ? player1SetsWon : player2SetsWon;
                setIsWinner(currentUserSetsWon >= setsToWin);
            }, 1000); // Délai de 1 seconde
        }
    }, [player1SetsWon, player2SetsWon, match, currentUser.data?.id, setsToWin]);

	// Fonctions pour incrémenter/décrémenter les scores
    const incrementSetScore = (player: 'player1' | 'player2') => {
        if (player === 'player1') {
            setCurrentSetPlayer1Score(prev => prev + 1);
        } else {
            setCurrentSetPlayer2Score(prev => prev + 1);
        }
    };

    const decrementSetScore = (player: 'player1' | 'player2') => {
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

		// Mettre à jour le score dans le match
		if (currentSetPlayer1Score > currentSetPlayer2Score) {
			// Si le joueur 1 gagne le set
			if (currentUser.data?.id === match?.user_1_id) {
				incrementScore();
			}
		} else {
			// Si le joueur 2 gagne le set
			if (currentUser.data?.id === match?.user_2_id) {
				incrementScore();
			}
		}
    };

    // Fonction pour gérer la fin du match
    const handleMatchEnd = () => {
        // Rediriger vers la page d'accueil ou une autre page
        onLeave();
        router.push('/');
    };

    // Fonction pour gérer l'abandon du match
    const handleForfeit = () => {
        try {
            // Vérifier si le match est déjà terminé
            if (match?.status === 'completed' || match?.status === 'cancelled') {
                // Si le match est déjà terminé, simplement quitter
                handleMatchEnd();
                return;
            }
            
            // Sinon, abandonner le match
            forfeitMatch();
            handleMatchEnd();
        } catch (error) {
            console.error("Erreur lors de l'abandon du match:", error);
            // En cas d'erreur, quitter quand même
            handleMatchEnd();
        }
    };

    // Styles de base pour les boutons
    const baseButtonStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };

    const decrementButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    };

    const incrementButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#1a56db',
        border: 'none',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    };

    const scoreDisplayStyle = {
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
    };

    const buttonEventHandlers = {
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(0.95)',
        onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1)',
        onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1)',
        onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(0.95)',
        onTouchEnd: (e: React.TouchEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'scale(1)'
    };

	// Dialogue pour ajouter un set
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
                        <Text size="3" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
							{currentUser.data?.login || "Joueur 1"}
						</Text>
                        <Flex align="center" gap="4">
                            <button 
                                onClick={() => decrementSetScore('player1')}
                                style={decrementButtonStyle}
                                {...buttonEventHandlers}
                            >
                                <FaMinus />
                            </button>
                            <div style={scoreDisplayStyle}>
                                {currentSetPlayer1Score}
                            </div>
                            <button 
                                onClick={() => incrementSetScore('player1')}
                                style={incrementButtonStyle}
                                {...buttonEventHandlers}
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
                        <Text size="3" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
							{opponent.user?.login || "Joueur 2"}
						</Text>
                        <Flex align="center" gap="4">
                            <button 
                                onClick={() => decrementSetScore('player2')}
                                style={decrementButtonStyle}
                                {...buttonEventHandlers}
                            >
                                <FaMinus />
                            </button>
                            <div style={scoreDisplayStyle}>
                                {currentSetPlayer2Score}
                            </div>
                            <button 
                                onClick={() => incrementSetScore('player2')}
                                style={incrementButtonStyle}
                                {...buttonEventHandlers}
                            >
                                <FaPlus />
                            </button>
                        </Flex>
                    </Flex>
                    
                    {/* Boutons de validation */}
                    <Flex gap="3" justify="center" style={{ marginTop: '20px' }}>
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

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return (
			<Box className="min-h-screen">
				<Container size="3" py="9">
					<Text>Error loading match: {error.message}</Text>
				</Container>
			</Box>
		);
	}

	if (!match) {
		onLeave();
		return null;
	}

	return (
		<>
			<PongField 
				player1={{
					name: currentUser.data?.login || "Joueur 1",
					avatar: currentUser.data?.avatar_url || "/default-avatar.png",
					score: player1SetsWon
				}}
				player2={{
					name: opponent.user?.login || "Joueur 2",
					avatar: opponent.user?.avatar_url || "/default-avatar.png",
					score: player2SetsWon
				}}
				setScores={setScores}
				onAddSet={() => setShowAddSetDialog(true)}
				onCancel={handleForfeit}
				maxSets={maxSets}
			/>
			{renderAddSetDialog()}
			
			{/* Popups de victoire et défaite */}
            <WinPopup 
                isOpen={isMatchOver && isWinner} 
                onClose={handleMatchEnd}
                onPlayAgain={handleMatchEnd}
            />
            <LosePopup 
                isOpen={isMatchOver && !isWinner} 
                onClose={handleMatchEnd}
                onPlayAgain={handleMatchEnd}
            />
		</>
	);
};

export default MatchPage; 