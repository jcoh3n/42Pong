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

	return {
		data: data as MatchmakingResponse,
		error,
		isLoading,
		mutate,
		startMatchmaking,
		stopMatchmaking,
	};
}

export default useMatchmaking;