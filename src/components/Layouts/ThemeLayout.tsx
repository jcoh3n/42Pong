import React, { useEffect, useState } from 'react';
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import Sidebar from "@/components/sidebar/Sidebar";
import { Theme as RadixTheme, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import useCurrentUser from '@/hooks/useCurrentUser';
import useUser from '@/hooks/users/useUser';

export default function ThemeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const { data: currentUser, isLoading } = useCurrentUser();

	useEffect(() => {
		if (isLoading) return;
		if (!currentUser) return;

		// Set theme based on user preferences if valid
		if (currentUser?.theme) {
			if (currentUser.theme === 'dark' || currentUser.theme === 'light') {
				setTheme(currentUser.theme);
			}
			// If 'inherit', we default to 'light'
		}
	}, [isLoading, currentUser]);

  return (
	<Theme accentColor="blue" appearance={theme} grayColor="slate" scaling="100%" radius="medium">
		{children}
	</Theme>
  );
}
