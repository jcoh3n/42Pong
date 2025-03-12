import React from 'react';
import { Box, Container, Text, Flex, Button } from "@radix-ui/themes";
import Loading from "@/components/Loading";
import useCurrentMatch, { MatchData } from '@/hooks/matchmaking/useCurrentMatch';
import MatchInfo from './MatchInfo';
import ScoreButtons from './ScoreButtons';
import WinPopup from './WinPopup';
import LosePopup from './LosePopup';
import toast from 'react-hot-toast';

export type MatchPageProps = {
	matchId: string,
	onLeave: () => void;
};

// Main MatchPage component
const MatchPage: React.FC<MatchPageProps> = ({
	matchId,
	onLeave,
}) => {
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

	// Determine if the current user is the winner
	const isWinner = match?.status === 'completed' && match.winner_id === currentUser.data?.id;

	// Determine if the current user is the loser
	const isLoser = match?.status === 'completed' && match.winner_id === opponent.user?.id;

	if (!match) {
		onLeave()
	}

	return (
		<Box className="min-h-screen">
			<Container size="3" py="9">
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

				<Flex direction="column" gap="6" align="center">
					{/* Match information */}
					<MatchInfo
						currentUser={currentUser.data}
						opponent={opponent.user}
						match={match}
					/>

					{/* Score buttons */}
					<ScoreButtons
						currentUser={currentUser.data}
						opponent={opponent.user}
						onIncrement={incrementScore}
					/>

					{/* Forfeit button */}
					<Button
						size="2"
						variant="soft"
						color="red"
						disabled={isForfeiting}
						onClick={forfeitMatch}
						className="mt-4 transition-all duration-200 hover:bg-red-200"
					>
						Forfeit Match
					</Button>
				</Flex>
			</Container>
		</Box>
	);
};

export default MatchPage; 