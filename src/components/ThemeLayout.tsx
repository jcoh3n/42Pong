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
	const [mounted, setMounted] = useState(false);

	// Éviter l'hydratation incompatible en attendant le montage côté client
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Éviter le flash de contenu non thémé
	}

	
	return (
		<ThemeProvider attribute="class">
			<Theme
				appearance='dark'
				accentColor="blue"
				grayColor="slate"
				scaling="100%"
				radius="medium"
				// Remove the hardcoded "dark" class that was overriding the theme
				className="radix-themes"
			>
				{children}
			</Theme>
		</ThemeProvider>
	);
}
