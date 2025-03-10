'use client';

import React, { useEffect, useMemo, useState } from 'react';
import "@radix-ui/themes/styles.css";
import useCurrentUser from '@/hooks/useCurrentUser';
import { Theme } from '@radix-ui/themes';
import { log } from 'console';
import usePreferences from '@/hooks/usePreferences';

export default function ThemeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const preferences = usePreferences();

  return (
	<Theme
		accentColor="blue"
		appearance={preferences.theme}
		grayColor="slate"
		scaling="100%"
		radius="medium"
	>
		{children}
	</Theme>
  );
}
