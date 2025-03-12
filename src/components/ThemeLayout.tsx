'use client';

import React, { useEffect, useState } from 'react';
import "@radix-ui/themes/styles.css";
import usePreferences from '@/hooks/usePreferences';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from "next-themes";

export default function ThemeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const preferences = usePreferences();
	const [mounted, setMounted] = useState(false);

	// Éviter l'hydratation incompatible en attendant le montage côté client
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Éviter le flash de contenu non thémé
	}

	return (
		<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
			<Theme
				appearance="dark"
				accentColor="blue"
				grayColor="slate"
				scaling="100%"
				radius="medium"
				className="radix-themes dark"
			>
				{children}
			</Theme>
		</ThemeProvider>
	);
}
