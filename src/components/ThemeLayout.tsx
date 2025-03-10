'use client';

import React, { useEffect, useMemo, useState } from 'react';
import "@radix-ui/themes/styles.css";
import useCurrentUser from '@/hooks/useCurrentUser';
import { Theme } from '@radix-ui/themes';
import { log } from 'console';
import usePreferences from '@/hooks/usePreferences';
import { ThemeProvider, useTheme } from "next-themes";

export default function ThemeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const preferences = usePreferences();

  return (
	<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
		<Theme
			appearance={preferences.theme === 'system' ? 'inherit' : preferences.theme}
			accentColor="blue"
			grayColor="slate"
			scaling="100%"
			radius="medium"
		>
			{children}
		</Theme>
	</ThemeProvider>
  );
}
