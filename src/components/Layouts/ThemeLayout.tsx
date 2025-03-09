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

	const [theme, setTheme] = useState('inherit');
	const { data: currentUser, isLoading } = useCurrentUser();

	useEffect(() => {
		if (isLoading) return;
		if (!currentUser) return;

		// Set theme based on user preferences if valid
		if (currentUser?.theme && ['inherit', 'dark', 'light'].includes(currentUser.theme)) {
			setTheme(currentUser.theme);
		}
	}, [isLoading, currentUser]);

  return (
	<Theme accentColor="blue" appearance={theme as 'inherit' | 'dark' | 'light'} grayColor="slate" scaling="100%" radius="medium">
		{children}
	</Theme>
  );
}
