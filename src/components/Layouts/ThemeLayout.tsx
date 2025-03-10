'use client';

import React, { useEffect, useMemo, useState } from 'react';
import "@radix-ui/themes/styles.css";
import useCurrentUser from '@/hooks/useCurrentUser';
import { Theme } from '@radix-ui/themes';

export default function ThemeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const { data: currentUser, isLoading } = useCurrentUser();
	const [theme, setTheme] = useState<'inherit' | 'dark' | 'light'>(localStorage.getItem('theme') as 'inherit' | 'dark' | 'light' || 'inherit');

	useEffect(() => {
		if (isLoading) return;
		if (!currentUser) return;

		// Set theme based on user preferences if valid
		if (currentUser?.theme && ['system', 'dark', 'light'].includes(currentUser.theme)) {
			if (currentUser.theme === 'system') {
				setTheme('inherit');
				localStorage.setItem('theme', 'inherit');
			} else {
				setTheme(currentUser.theme);
				localStorage.setItem('theme', currentUser.theme);
			}
		}
	}, [currentUser, isLoading]);

  return (
	<Theme accentColor="blue" appearance={theme as 'inherit' | 'dark' | 'light'} grayColor="slate" scaling="100%" radius="medium">
		{children}
	</Theme>
  );
}
