'use client';

import useSWR, { mutate } from 'swr';
import { KeyedMutator } from 'swr';
import fetcher from '@/libs/fetcher';
import useCurrentUser from '@/hooks/useCurrentUser';
import useMatchmaking from './useMatchmaking';
import { Match, matchService, User } from '@/services';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useUser from '../users/useUser';
import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import useMatch from '../matches/useMatch';
import { useRouter } from 'next/navigation';

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
};

const useCurrentMatch = (match_id: string): MatchData => {
	const router = useRouter();
	const currentUserData = useCurrentUser();
	const { data: currentUser } = currentUserData;
	const supabase = createClient();
	
	const { match, isLoading: isMatchLoading, error: matchError, mutate: matchMutate} = useMatch(match_id);

	// Get the opponent's ID
	const opponentId = currentUser?.id 
		? (match?.user_1_id === currentUser.id ? match?.user_2_id : match?.user_1_id)
		: undefined;

	// Fetch opponent user data
	const opponentData = useUser(undefined, opponentId);

	const [isForfeiting, setIsForfeiting] = useState(false);
	const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
	const hasSetupRealtimeRef = useRef(false);
	
	// Set up real-time subscription to match updates
	useEffect(() => {
		// Only subscribe if we have a valid match ID and haven't set up yet
		if (!match_id || hasSetupRealtimeRef.current) {
			return;
		}

		matchMutate();
		
		console.log('Setting up real-time subscription for match:', match_id);
		
		// Create handler for match updates
		const handler = (payload: any) => {
			console.log('Match updated:', payload);
			// Refresh match data when any update happens
			matchMutate();
		};
		
		// Subscribe to changes for this match using direct channel
		const channel = supabase.channel(`match-${match_id}`)
			.on('postgres_changes', {
				event: '*',  // Listen for all events
				schema: 'public',
				table: 'Matches',
				filter: `id=eq.${match_id}`  // Only for this specific match
			}, handler)
			.subscribe();

		// Store unsubscribe function for cleanup
		unsubscribeRef.current = () => supabase.removeChannel(channel);
		hasSetupRealtimeRef.current = true;

		// Clean up on unmount or when match_id changes
		return () => {
			if (unsubscribeRef.current) {
				console.log('Cleaning up realtime subscription for match:', match_id);
				unsubscribeRef.current();
				hasSetupRealtimeRef.current = false;
			}
		};

	}, [match_id, matchMutate, supabase]);

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
	}, [match?.id, matchMutate, isForfeiting, currentUser]);

	return {
		match: match || null,
		error: matchError,
		currentUser: currentUserData,
		opponent: opponentData,
		isLoading: isMatchLoading,
		isForfeiting,
		mutate: matchMutate,
		forfeitMatch,
	};
};

export default useCurrentMatch;
