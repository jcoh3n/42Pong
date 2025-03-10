'use client';

import React, { useEffect, useMemo, useState } from 'react';
import "@radix-ui/themes/styles.css";
import useCurrentUser from '@/hooks/useCurrentUser';
import { Theme } from '@radix-ui/themes';
import { log } from 'console';

export default function ThemeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const { data: currentUser, isLoading } = useCurrentUser();
	const savedTheme = global?.window?.localStorage.getItem('theme') as 'inherit' | 'dark' | 'light' || 'inherit';
	const [theme, setTheme] = useState<'inherit' | 'dark' | 'light'>(savedTheme);

	useEffect(() => {
		if (isLoading) return;
		if (!currentUser) return;

		// Set theme based on user preferences if valid
		if (currentUser?.theme && ['system', 'dark', 'light'].includes(currentUser.theme)) {
			if (currentUser.theme === 'system') {
				console.log('setting theme to inherit');
				setTheme('inherit');
				global?.window?.localStorage.setItem('theme', 'inherit');
			} else {
				setTheme(currentUser.theme);
				global?.window?.localStorage.setItem('theme', currentUser.theme);
			}
		}
	}, [currentUser, isLoading]);

  return (
	<Theme
		accentColor="blue"
		appearance={theme as 'inherit' | 'dark' | 'light'}
		grayColor="slate"
		scaling="100%"
		radius="medium"
	>
		{children}
	</Theme>
  );
}
