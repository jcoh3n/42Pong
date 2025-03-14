'use client';

import useSWR from 'swr';
import { KeyedMutator } from 'swr';
import fetcher from '@/libs/fetcher';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { MatchType } from '@/services/types';
import { toast } from 'react-hot-toast';
import { MatchmakingResponse } from '@/app/api/matchmaking/route';
import useCurrentUser from '@/hooks/useCurrentUser';
import { createClient } from '@/libs/supabase/client';

const useMatchmaking = (): {
	data: MatchmakingResponse | undefined;
	error: Error | undefined;
	isLoading: boolean;
	mutate: KeyedMutator<any>;
	startMatchmaking: (mode?: MatchType) => Promise<void>;
	stopMatchmaking: () => Promise<void>;
	timeInQueue: string | null;
} => {
	const { data: currentUser } = useCurrentUser();
	const userId = currentUser?.id;
	const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
	const hasSetupRealtimeRef = useRef(false);
	const supabase = createClient();

	const { data, error, isLoading, mutate } = useSWR('/api/matchmaking', fetcher);

	const [timeInQueue, setTimeInQueue] = useState<number | null>(null);
	const [isStarting, setIsStarting] = useState(false);
	const [isStopping, setIsStopping] = useState(false);

	const matchmakingData = data as MatchmakingResponse;

	// Setup Supabase Realtime subscription
	useEffect(() => {
		if (!userId || hasSetupRealtimeRef.current) {
			return;
		}
		
		console.log('Setting up real-time subscription for matchmaking queue:', userId);
		
		// Create channel for all event types
		const channel = supabase.channel(`matchmaking-queue-${userId}`)
			.on('postgres_changes', {
				event: 'INSERT',
				schema: 'public',
				table: 'matchmaking_queue',
				filter: `user_id=eq.${userId}`
			}, (payload) => {
				console.log('Matchmaking queue updated (INSERT):', payload);
				// Force refresh data from API to get complete state
				mutate();
			})
			.on('postgres_changes', {
				event: 'UPDATE',
				schema: 'public',
				table: 'matchmaking_queue',
				filter: `user_id=eq.${userId}`
			}, (payload) => {
				console.log('Matchmaking queue updated (UPDATE):', payload);
				// Force refresh data from API to get complete state
				mutate();
			})
			.on('postgres_changes', {
				event: 'DELETE',
				schema: 'public',
				table: 'matchmaking_queue',
				filter: `user_id=eq.${userId}`
			}, (payload) => {
				console.log('Matchmaking queue updated (DELETE):', payload);
				// Reset local state and refresh data
				setTimeInQueue(null);
				mutate();
			})
			.subscribe();
		
		// Store unsubscribe function for cleanup
		unsubscribeRef.current = () => supabase.removeChannel(channel);
		hasSetupRealtimeRef.current = true;
		
		// Clean up on unmount
		return () => {
			if (unsubscribeRef.current) {
				console.log('Cleaning up realtime subscription for matchmaking:', userId);
				unsubscribeRef.current();
				hasSetupRealtimeRef.current = false;
			}
		};
	}, [userId, mutate, supabase]);

	const startMatchmaking = useCallback(async (mode: MatchType = 'normal') => {
		setIsStarting(true);

		try {
			const response = await fetch(`/api/matchmaking?mode=${mode}`, { method: 'POST' });

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				toast.error(errorData.message || 'Failed to start matchmaking');
				return;
			}
			mutate();
			toast.success('Matchmaking started !');
		} catch (error) {
			toast.error('Network error. Please check your connection.');
		} finally {
			setIsStarting(false);
		}
	}, [mutate, setIsStarting]);

	const stopMatchmaking = useCallback(async () => {
		setIsStopping(true);

		const response = await fetch('/api/matchmaking', {
			method: 'DELETE',
		});

		mutate();
		setTimeInQueue(null);
		setIsStopping(false);

		if (!response.ok) {
			toast.error('Failed to stop matchmaking');
			return;
		}
	}, [mutate]);

	useEffect(() => {
		if (!matchmakingData?.data?.inQueue) {
			setTimeInQueue(null);
			return () => {};
		}

		const joinedAt = new Date(matchmakingData.data.queueData?.joined_at || new Date()).getTime();

		const updateTime = () => {
			const now = new Date().getTime();
			setTimeInQueue(Math.floor((now - joinedAt) / 1000));
		};

		// Initial calculation
		updateTime();

		// Update every second
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, [matchmakingData?.data?.inQueue, matchmakingData?.data?.queueData?.joined_at]);

	const formatedTimeInQueue = useMemo(() => {
		if (!timeInQueue) return null;
		
		if (timeInQueue < 60) {
			return `${timeInQueue}s`;
		} else if (timeInQueue < 3600) {
			const minutes = Math.floor(timeInQueue / 60);
			const seconds = timeInQueue % 60;
			return `${minutes}m`;
		} else {
			const hours = Math.floor(timeInQueue / 3600);
			const minutes = Math.floor((timeInQueue % 3600) / 60);
			const seconds = timeInQueue % 60;
			return `${hours}h`;
		}
	}, [timeInQueue]);

	return {
		data: data as MatchmakingResponse,
		error,
		isLoading: isLoading || isStarting || isStopping,
		mutate,
		startMatchmaking,
		stopMatchmaking,
		timeInQueue: formatedTimeInQueue,
	};
}

export default useMatchmaking;