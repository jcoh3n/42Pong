'use client';

import useSWR from 'swr';

import fetcher from '@/libs/fetcher';
import { User } from '@/services';

const useCurrentUser = () => {
	const { data, error, isLoading, mutate } = useSWR('/api/user', fetcher);

	return {
		data: data as User | null,
		error,
		isLoading,
		mutate
	};
}

export default useCurrentUser;