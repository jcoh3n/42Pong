'use client';

import useCurrentUser from './useCurrentUser';

export type Preferences = {
	theme: 'system' | 'dark' | 'light',
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

	const theme = currentUser?.theme as 'system' | 'dark' | 'light'
		|| global?.window?.localStorage.getItem('theme') as 'system' | 'dark' | 'light'
		|| 'system';
	
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