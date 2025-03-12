import React from 'react';
import { Box, Container, Text, Flex, Button } from "@radix-ui/themes";
import { MatchmakingProps } from "@/components/matchmaking/MatchmakingMenu";
import Loading from "@/components/Loading";
import useCurrentMatch from '@/hooks/matchmaking/useCurrentMatch';
import MatchInfo from './MatchInfo';
import ScoreButtons from './ScoreButtons';
import WinPopup from './WinPopup';

// Main MatchPage component
const MatchPage = (props: MatchmakingProps) => {
	// Use the useCurrentMatch hook to get all match-related data and functions
	const { data, isLoading, error, forfeitMatch, incrementScore, leaveMatch } = useCurrentMatch();

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

	// Extract data
	const match = data?.match;
	const currentUser = data?.currentUser?.data;
	const opponent = data?.opponent?.user;

	// Determine if the current user is the winner
	const isWinner = match?.status === 'completed' && (
		(match.user_1_id === currentUser?.id && match.user_1_score > match.user_2_score) ||
		(match.user_2_id === currentUser?.id && match.user_2_score > match.user_1_score)
	);

	if (!match) {
		return (
			<Box className="min-h-screen">
				<Container size="3" py="9">
					<Text>No active match found</Text>
				</Container>
			</Box>
		);
	}

	return (
		<Box className="min-h-screen">
			<Container size="3" py="9">
				<WinPopup
					isOpen={isWinner}
					onClose={() => leaveMatch()}
				/>
				<Flex direction="column" gap="6" align="center">
					{/* Match information */}
					<MatchInfo
						currentUser={currentUser}
						opponent={opponent}
						match={match}
					/>

					{/* Score buttons */}
					<ScoreButtons
						currentUser={currentUser}
						opponent={opponent}
						onIncrement={incrementScore}
					/>

					{/* Forfeit button */}
					<Button
						size="2"
						variant="soft"
						color="red"
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