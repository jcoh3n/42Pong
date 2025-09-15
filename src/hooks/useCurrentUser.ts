'use client';

import useSWR, { KeyedMutator } from 'swr';

import fetcher from '@/libs/fetcher';
import { User } from '@/services';

export type currentUserType = {
	data: User | null;
    error: any;
    isLoading: boolean;
    mutate: KeyedMutator<any>;
};

const useCurrentUser = (): currentUserType => {
	const { data, error, isLoading, mutate } = useSWR('/api/user', fetcher);

	return {
		data: data as User | null,
		error,
		isLoading,
		mutate
	};
}

export default useCurrentUser;