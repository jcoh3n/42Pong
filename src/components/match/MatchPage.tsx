import React, { useState } from 'react';
import { Box, Container, Text, Flex, Button } from "@radix-ui/themes";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";
import useCurrentMatch from '@/hooks/matchmaking/useCurrentMatch';
import WinPopup from './WinPopup';
import LosePopup from './LosePopup';
import toast from 'react-hot-toast';
import { matchService } from '@/services';

export type MatchPageProps = {
	matchId: string,
	onLeave: () => void;
};

// Main MatchPage component
const MatchPage: React.FC<MatchPageProps> = ({
	matchId,
	onLeave,
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
		isForfeiting,
		mutate
	} = useCurrentMatch(matchId);

	// State for score inputs
	const [user1Score, setUser1Score] = useState<number>(match?.user_1_score || 0);
	const [user2Score, setUser2Score] = useState<number>(match?.user_2_score || 0);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Update score states when match data changes
	React.useEffect(() => {
		if (match) {
			setUser1Score(match.user_1_score || 0);
			setUser2Score(match.user_2_score || 0);
		}
	}, [match]);

	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return (
			<Box className="h-full">
				<Container size="3" py="9">
					<Text>Error loading match: {error.message}</Text>
				</Container>
			</Box>
		);
	}

	// Determine if the current user is the winner
	const isWinner = match?.status === 'completed' && match.winner_id === currentUser.data?.id;

	// Determine if the current user is the loser
	const isLoser = match?.status === 'completed' && match.winner_id === opponent.user?.id;

	// Determine which user is which
	const isUser1 = currentUser.data?.id === match?.user_1_id;
	const currentUserScore = isUser1 ? user1Score : user2Score;
	const opponentScore = isUser1 ? user2Score : user1Score;

	// Handle score submission
	const handleSubmitScores = async () => {
		if (!match?.id) return;
		
		// Validate scores
		if (user1Score < 0 || user2Score < 0) {
			toast.error("Scores cannot be negative");
			return;
		}
		
		// Check if at least one player reached the winning score
		const scoreToWin = match.score_to_win || 5;
		if (user1Score < scoreToWin && user2Score < scoreToWin) {
			toast.error(`At least one player must reach ${scoreToWin} points to finish the match`);
			return;
		}
		
		// Check if both players reached the winning score (invalid)
		if (user1Score >= scoreToWin && user2Score >= scoreToWin) {
			toast.error("Only one player can win the match");
			return;
		}
		
		try {
			setIsSubmitting(true);
			
			// Update scores in the database
			await matchService.updateScores(match.id, user1Score, user2Score);
			
			// Determine winner and update match status
			let winnerId = null;
			if (user1Score >= scoreToWin) {
				winnerId = match.user_1_id;
			} else if (user2Score >= scoreToWin) {
				winnerId = match.user_2_id;
			}
			
			// Update match status if there's a winner
			if (winnerId) {
				await matchService.updateMatch(match.id, {
					winner_id: winnerId,
					status: 'completed',
					finished_at: new Date().toISOString()
				});
			}
			
			// Refresh match data
			mutate();
			
			toast.success("Scores updated successfully!");
		} catch (error) {
			console.error("Error submitting scores:", error);
			toast.error("Failed to submit scores");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!match) {
		onLeave()
		return null;
	}

	return (
		<Box className="h-full w-full relative overflow-hidden">
			<Container size="4" className="relative z-10 h-full overflow-hidden">
								<Flex 
					direction="column" 
					align="center" 
					justify="center" 
					className="h-full py-4 px-4 sm:py-8 overflow-hidden"
					gap={{ initial: "5", sm: "7", md: "8" }}
				>
					{/* Win Popup */}
					<WinPopup
						isOpen={isWinner}
						onClose={() => onLeave()}
					/>

					{/* Lose Popup */}
					<LosePopup
						isOpen={isLoser}
						onClose={() => onLeave()}
					/>

					{/* Match Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="w-full max-w-2xl text-center overflow-hidden"
					>
						<Box
							style={{
								borderRadius: '20px',
								background: 'rgba(255, 255, 255, 0.1)',
								backdropFilter: 'blur(20px)',
								WebkitBackdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
								overflow: 'hidden',
								transition: 'all 0.3s ease',
							}}
							className="w-full"
						>
							<Flex 
								direction="column" 
								p={{ initial: "4", sm: "5" }}
								gap={{ initial: "3", sm: "4" }}
							>
								<Text
									size={{ initial: "6", sm: "7" }}
									weight="bold"
									className="text-white mix-blend-exclusion"
									style={{ 
										letterSpacing: '-0.02em',
										fontSize: 'clamp(1.5rem, 4vw, 2rem)'
									}}
								>
									Match en cours
								</Text>
								
								<Text 
									size={{ initial: "2", sm: "3" }}
									className="text-white mix-blend-exclusion opacity-80"
									style={{ fontWeight: '500' }}
								>
									Match ID: {match.id.substring(0, 8)}...
								</Text>
							</Flex>
						</Box>
					</motion.div>

					{/* Player Scores Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="w-full max-w-2xl overflow-hidden"
					>
						<Box
							style={{
								borderRadius: '20px',
								background: 'rgba(255, 255, 255, 0.1)',
								backdropFilter: 'blur(20px)',
								WebkitBackdropFilter: 'blur(20px)',
								border: '1px solid rgba(255, 255, 255, 0.2)',
								boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
								overflow: 'hidden',
								transition: 'all 0.3s ease',
							}}
						>
							<Flex 
								direction={{ initial: "column", sm: "row" }} 
								justify="between" 
								p="5"
								align="center"
								gap="6"
							>
								{/* Current User */}
								<Flex direction="column" align="center" gap="3" className="flex-1">
									<Box
										style={{
											width: '80px',
											height: '80px',
											borderRadius: '50%',
											overflow: 'hidden',
											border: '3px solid rgba(255, 255, 255, 0.3)',
											boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
										}}
									>
										{currentUser.data?.avatar_url ? (
											<img 
												src={currentUser.data?.avatar_url} 
												alt={currentUser.data?.login || "Current user"}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											/>
										) : (
											<Box
												style={{
													width: '100%',
													height: '100%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													background: 'rgba(96, 165, 250, 0.2)',
													color: 'white',
													fontWeight: 'bold',
													fontSize: '2rem'
												}}
											>
												{currentUser.data?.login?.charAt(0).toUpperCase() || "?"}
											</Box>
										)}
									</Box>
									<Text size="3" weight="bold" className="text-white">
										{currentUser.data?.login || "Player 1"}
									</Text>
									<Box
										style={{
											background: 'rgba(255, 255, 255, 0.12)',
											backdropFilter: 'blur(12px)',
											WebkitBackdropFilter: 'blur(12px)',
											border: '1px solid rgba(255, 255, 255, 0.25)',
											borderRadius: '12px',
											padding: '12px',
											boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
											width: '100px',
											textAlign: 'center'
										}}
									>
										<input
											type="number"
											value={currentUserScore}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const value = parseInt(e.target.value) || 0;
												if (isUser1) {
													setUser1Score(value);
												} else {
													setUser2Score(value);
												}
											}}
											min="0"
											disabled={match.status === 'completed'}
											style={{
												textAlign: 'center',
												fontSize: '1.5rem',
												fontWeight: 'bold',
												color: 'white',
												background: 'transparent',
												border: 'none',
												width: '100%'
											}}
										/>
									</Box>
								</Flex>

								{/* VS Indicator */}
								<Box className="text-center">
									<Text size="6" weight="bold" className="text-white mix-blend-exclusion">
										VS
									</Text>
									<Box className="mt-2">
										<Text size="2" className="text-white/70">
											Score to win: {match.score_to_win || 5}
										</Text>
									</Box>
								</Box>

								{/* Opponent */}
								<Flex direction="column" align="center" gap="3" className="flex-1">
									<Box
										style={{
											width: '80px',
											height: '80px',
											borderRadius: '50%',
											overflow: 'hidden',
											border: '3px solid rgba(255, 255, 255, 0.3)',
											boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
										}}
									>
										{opponent.user?.avatar_url ? (
											<img 
												src={opponent.user?.avatar_url} 
												alt={opponent.user?.login || "Opponent"}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											/>
										) : (
											<Box
												style={{
													width: '100%',
													height: '100%',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													background: 'rgba(96, 165, 250, 0.2)',
													color: 'white',
													fontWeight: 'bold',
													fontSize: '2rem'
												}}
											>
												{opponent.user?.login?.charAt(0).toUpperCase() || "?"}
											</Box>
										)}
									</Box>
									<Text size="3" weight="bold" className="text-white">
										{opponent.user?.login || "Player 2"}
									</Text>
									<Box
										style={{
											background: 'rgba(255, 255, 255, 0.12)',
											backdropFilter: 'blur(12px)',
											WebkitBackdropFilter: 'blur(12px)',
											border: '1px solid rgba(255, 255, 255, 0.25)',
											borderRadius: '12px',
											padding: '12px',
											boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
											width: '100px',
											textAlign: 'center'
										}}
									>
										<input
											type="number"
											value={opponentScore}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const value = parseInt(e.target.value) || 0;
												if (isUser1) {
													setUser2Score(value);
												} else {
													setUser1Score(value);
												}
											}}
											min="0"
											disabled={match.status === 'completed'}
											style={{
												textAlign: 'center',
												fontSize: '1.5rem',
												fontWeight: 'bold',
												color: 'white',
												background: 'transparent',
												border: 'none',
												width: '100%'
											}}
										/>
									</Box>
								</Flex>
							</Flex>
						</Box>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="w-full max-w-2xl overflow-hidden"
					>
						<Flex direction="column" gap="4" align="center">
							{match.status !== 'completed' ? (
								<>
									<Button
										size="3"
										variant="solid"
										className="w-full max-w-xs"
										onClick={handleSubmitScores}
										disabled={isSubmitting}
										style={{
											borderRadius: '12px',
											background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
											border: '1px solid rgba(255, 255, 255, 0.2)',
											boxShadow: '0 4px 20px rgba(96, 165, 250, 0.3)',
											padding: '16px 24px',
											fontWeight: 'bold',
											transition: 'all 0.3s ease'
										}}
									>
										{isSubmitting ? "Submitting..." : "Submit Final Scores"}
									</Button>
									
									<Button
										size="2"
										variant="soft"
										color="red"
										disabled={isForfeiting}
										onClick={forfeitMatch}
										className="w-full max-w-xs transition-all duration-200 hover:bg-red-200"
									>
										{isForfeiting ? "Forfeiting..." : "Forfeit Match"}
									</Button>
								</>
							) : (
								<Button
									size="3"
									variant="solid"
									onClick={() => onLeave()}
									className="w-full max-w-xs"
									style={{
										borderRadius: '12px',
										background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
										border: '1px solid rgba(255, 255, 255, 0.2)',
										boxShadow: '0 4px 20px rgba(96, 165, 250, 0.3)',
										padding: '16px 24px',
										fontWeight: 'bold',
										transition: 'all 0.3s ease'
									}}
								>
									Return to Menu
								</Button>
							)}
						</Flex>
					</motion.div>
				</Flex>
			</Container>
		</Box>
	);
};

export default MatchPage;