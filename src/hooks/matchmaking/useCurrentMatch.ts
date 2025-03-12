'use client';

import useSWR from 'swr';
import { KeyedMutator } from 'swr';
import fetcher from '@/libs/fetcher';
import useCurrentUser from '@/hooks/useCurrentUser';
import useMatchmaking from './useMatchmaking';
import { Match, matchService, User } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useUser from '../users/useUser';

interface MatchData {
	match?: Match,
	currentUser: {
		isLoading: boolean;
		error: any;
		data: User | null;
	},
	opponent: {
		isLoading: boolean;
		error: any;
		user?: User | null;
	},
}

const useCurrentMatch = (): {
	data?: MatchData | null;
	error: Error | undefined;
	isLoading: boolean;
	mutate: KeyedMutator<any>;
	forfeitMatch: () => Promise<void>;
	incrementScore: () => Promise<void>;
	leaveMatch: () => boolean;
} => {
	const { data, error, isLoading, mutate } = useMatchmaking();
	const currentUserData = useCurrentUser();
	const [match, setMatch] = useState<Match | null>(null);

	useEffect(() => {
		// Set match from data if it's null
		if (!match && data?.data?.matchData) {
			setMatch(data.data.matchData);
		} else if (match?.id && match.id === data?.data?.matchData?.id) {
			setMatch(data.data.matchData);
		}
	}, [match?.id, data?.data?.matchData])

	// Check if match is completed and set it to null if it is
	const leaveMatch = useCallback(() => {
		if (match?.status === 'completed') {
			setMatch(null);
			mutate();
			return true;
		}

		return false;
	}, [match?.status, mutate]);

	const { data: currentUser } = currentUserData;

	// Get the opponent's ID
	const opponentId = currentUser?.id 
		? (match?.user_1_id === currentUser.id ? match?.user_2_id : match?.user_1_id)
		: undefined;
	
	// Fetch opponent user data
	const opponentData = useUser(undefined, opponentId);

	const forfeitMatch = useCallback(async () => {
		if (!match?.id) {
			return;
		}

		try {
			await matchService.forfeitMatch(match.id, match.user_1_id);

			mutate();
		} catch (error) {
			console.error('Error stopping match:', error);
		}
	}, [match?.id, match?.user_1_id, mutate]);

	// Periodically refresh match data every 3 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			mutate();
		}, 1000);
		
		// Clean up interval on component unmount
		return () => clearInterval(interval);
	}, [mutate]);

	const incrementScore = useCallback(async () => {
		if (!match?.id || !currentUser?.id) {
			return;
		}

		try {
			// Check if the score update was successful
			const response = await matchService.incrementUserScore(match.id, currentUser?.id);

			if (response.error) {
				console.error('Failed to increment score:', response.error.message);
				toast.error(`Failed to update score: ${response.error.message}`);
				return;
			}

			// Log the updated score for debugging
			console.log('Score updated successfully:', response.data?.updated_score);
			toast.success(`Score updated successfully`);

			// Refresh the data
			mutate();
		} catch (error) {
			console.error('Error incrementing score:', error);
		}
	}, [match?.id, match?.user_1_id, match?.user_2_id, match?.user_1_score, match?.user_2_score, currentUser?.id, mutate]);

	return {
		data: {
			match: match as Match,
			currentUser: {...currentUserData},
			opponent: {...opponentData},
		},
		error,
		isLoading,
		mutate,
		incrementScore,
		forfeitMatch,
		leaveMatch,
	};
};

export default useCurrentMatch;
