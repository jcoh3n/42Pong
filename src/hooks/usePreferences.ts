'use client';

import useSWR from 'swr';

import fetcher from '@/libs/fetcher';
import { useMemo } from 'react';
import useCurrentUser from './useCurrentUser';

export type Preferences = {
	theme: 'inherit' | 'dark' | 'light',
	language: 'en' | 'fr',
	notifications: boolean,
}

export default function usePreferences (): Preferences {
	const { data: currentUser, isLoading} = useCurrentUser();

	const language = currentUser?.language as 'en' | 'fr'
		|| global?.window?.localStorage.getItem('language') as 'en' | 'fr'
		|| 'en';
	
	const notifications = currentUser?.notifications as boolean
		|| (global?.window?.localStorage.getItem('notifications') as 'true' | 'false' === 'true' ? true : false )
		|| true;

	const theme = currentUser?.theme as 'inherit' | 'dark' | 'light'
		|| global?.window?.localStorage.getItem('theme') as 'inherit' | 'dark' | 'light'
		|| 'inherit';
	
	// Save preferences to localStorage when user is available
	if (!isLoading && currentUser && global?.window?.localStorage) {
		localStorage.setItem('theme', theme);
		localStorage.setItem('language', language);
		localStorage.setItem('notifications', notifications.toString());
	}

	return {
		theme,
		language,
		notifications
	};
}