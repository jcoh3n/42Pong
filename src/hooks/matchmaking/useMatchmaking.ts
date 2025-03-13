'use client';

import useSWR from 'swr';
import { KeyedMutator } from 'swr';

import fetcher from '@/libs/fetcher';
import { toast } from 'react-hot-toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MatchmakingResponse } from '@/app/api/matchmaking/route';
import { now } from 'next-auth/client/_utils';

const useMatchmaking = (): {
	data: MatchmakingResponse | undefined;
	error: Error | undefined;
	isLoading: boolean;
	mutate: KeyedMutator<any>;
	startMatchmaking: () => Promise<void>;
	stopMatchmaking: () => Promise<void>;
	timeInQueue: string | null;
} => {
	const { data, error, isLoading, mutate } = useSWR('/api/matchmaking', fetcher);

	const [timeInQueue, setTimeInQueue] = useState<number | null>(null);
	const [isStarting, setIsStarting] = useState(false);
	const [isStopping, setIsStopping] = useState(false);

	const matchmakingData = data as MatchmakingResponse;

	const startMatchmaking = useCallback(async () => {
		setIsStarting(true);
		
		try {
			const response = await fetch('/api/matchmaking', { method: 'POST' });
			
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				toast.error(errorData.message || 'Failed to start matchmaking');
				return;
			}
			mutate();
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
			mutate();
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