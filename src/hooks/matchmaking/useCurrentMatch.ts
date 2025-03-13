'use client';

import useSWR, { mutate } from 'swr';
import { KeyedMutator } from 'swr';
import fetcher from '@/libs/fetcher';
import useCurrentUser from '@/hooks/useCurrentUser';
import useMatchmaking from './useMatchmaking';
import { Match, matchService, User } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useUser from '../users/useUser';
import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import useMatch from '../matches/useMatch';

export type MatchData = {
	match: Match | null;
	isLoading: boolean;
	isForfeiting: boolean;
	error: any;
	currentUser: {
		isLoading: boolean;
		error: any;
		data: User | null;
	};
	opponent: {
		isLoading: boolean;
		error: any;
		user?: User | null;
	};
	mutate: any;
	forfeitMatch: () => Promise<void>;
	incrementScore: () => Promise<void>;
};

const useCurrentMatch = (match_id: string): MatchData => {
	const currentUserData = useCurrentUser();
	const { data: currentUser } = currentUserData;
	
	const { match, isLoading: isMatchLoading, error: matchError, mutate: matchMutate} = useMatch(match_id);

	// Get the opponent's ID
	const opponentId = currentUser?.id 
		? (match?.user_1_id === currentUser.id ? match?.user_2_id : match?.user_1_id)
		: undefined;

	// Fetch opponent user data
	const opponentData = useUser(undefined, opponentId);

	const [isForfeiting, setIsForfeiting] = useState(false);
	
	// Set up an interval to refresh match data every second
	useEffect(() => {
		// Only set up the interval if we have an active match
		if (match?.id) {
			const intervalId = setInterval(() => {
				matchMutate();
			}, 1000);
			
			// Clean up the interval when the component unmounts or match changes
			return () => clearInterval(intervalId);
		}
	}, [match?.id, matchMutate]);

	const forfeitMatch = useCallback(async () => {
		if (!match?.id || isForfeiting || !currentUser) {
			return;
		}

		try {
			setIsForfeiting(true);
			await matchService.forfeitMatch(match.id, currentUser.id);
			matchMutate();
		} catch (error) {
			console.error('Error stopping match:', error);
		} finally {
			setIsForfeiting(false);
		}
	}, [match?.id, match?.user_1_id, matchMutate, isForfeiting, currentUser?.id]);

	const incrementScore = useCallback(async () => {
		if (!match?.id || !currentUser?.id) {
			return;
		}

		try {
			// Check if the score update was successful
			const response = await matchService.incrementUserScore(match.id, currentUser.id);

			if (response.error) {
				console.error('Failed to increment score:', response.error.message);
				toast.error(`Failed to update score: ${response.error.message}`);
				return;
			}

			// Log the updated score for debugging
			console.log('Score updated successfully:', response.data?.updated_score);
			toast.success(`Score updated successfully`);

			matchMutate();
		} catch (error) {
			console.error('Error incrementing score:', error);
		}
	}, [match?.id, currentUser?.id, matchMutate]);

	return {
		match: match || null,
		error: matchError,
		currentUser: currentUserData,
		opponent: opponentData,
		isLoading: isMatchLoading,
		isForfeiting,
		mutate: matchMutate,
		incrementScore,
		forfeitMatch,
	};
};

export default useCurrentMatch;
