'use client';

import useSWR from 'swr';
import { KeyedMutator } from 'swr';
import fetcher from '@/libs/fetcher';
import useCurrentUser from '@/hooks/useCurrentUser';
import useMatchmaking from './useMatchmaking';
import { Match, matchService, User } from '@/services';
import { useCallback } from 'react';
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
} => {
	const { data, error, isLoading, mutate } = useMatchmaking();
	const currentUserData = useCurrentUser();
	const match = data?.data?.matchData;

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
	};
};

export default useCurrentMatch;
