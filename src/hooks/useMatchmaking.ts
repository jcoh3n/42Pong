'use client';

import useSWR from 'swr';

import fetcher from '@/libs/fetcher';
import { toast } from 'react-hot-toast';
import { useCallback } from 'react';
import { MatchmakingResponse } from '@/app/api/matchmaking/route';

const useMatchmaking = () => {
	const { data, error, isLoading, mutate } = useSWR('/api/matchmaking', fetcher);

	const startMatchmaking = useCallback(async () => {
		const response = await fetch('/api/matchmaking', {
			method: 'POST',
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			toast.error('Failed to start matchmaking');
			return;
		}

		toast.success('Matchmaking started');
	}, []);

	const stopMatchmaking = useCallback(async () => {
		const response = await fetch('/api/matchmaking', {
			method: 'DELETE',
		});

		if (!response.ok) {
			toast.error('Failed to stop matchmaking');
			return;
		}

		toast.success('Matchmaking stopped');
	}, []);

	const timeInQueue = useCallback(() => {
		if (!data?.data?.queueData?.joined_at) {
			return null;
		}

		const joinedAt = new Date(data.data.queueData.joined_at);
		const now = new Date();
		return Math.floor((now.getTime() - joinedAt.getTime()) / 1000);
	}, [data?.data?.queueData?.joined_at]);

	return {
		data: data as MatchmakingResponse,
		error,
		isLoading,
		mutate,
		startMatchmaking,
		stopMatchmaking,
		timeInQueue,
	};
}

export default useMatchmaking;