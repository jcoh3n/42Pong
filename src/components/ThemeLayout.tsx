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
	const savedTheme = global?.window?.localStorage.getItem('theme') as 'system' | 'dark' | 'light' || 'system';
	const [theme, setTheme] = useState<'dark' | 'light' | undefined>(
		savedTheme === 'system' ? undefined : savedTheme as 'dark' | 'light'
	);

	useEffect(() => {
		if (isLoading) return;
		if (!currentUser) return;

		// Set theme based on user preferences if valid
		if (currentUser?.theme && ['system', 'dark', 'light'].includes(currentUser.theme)) {
			if (currentUser.theme === 'system') {
				setTheme(undefined);
				global?.window?.localStorage.setItem('theme', 'system');
			} else {
				setTheme(currentUser.theme as 'dark' | 'light');
				global?.window?.localStorage.setItem('theme', currentUser.theme);
			}
		}
	}, [currentUser, isLoading]);

  return (
	<Theme
		accentColor="blue"
		appearance={theme}
		grayColor="slate"
		scaling="100%"
		radius="medium"
	>
		{children}
	</Theme>
  );
}
