'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Box } from '@radix-ui/themes';
import Loading from './Loading';
import WinPopup from './match/WinPopup';
import LoginContent from '@/app/login/page';
import useSupabase from '@/hooks/useSupabase';
import { generatePassword } from '@/libs/utils/auth';

interface ProtectedProps {
	children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { data: currentUser, isLoading, error } = useCurrentUser();
	const { supabase, isLoading: isSupabaseHookLoading, error: supabaseHookError } = useSupabase();

	const [isAuthChecking, setIsAuthChecking] = useState(true);
	const [isSupabaseLoggedIn, setIsSupabaseLoggedIn] = useState(false);

	useEffect(() => {
		const checkSupabaseLogin = async () => {
			setIsAuthChecking(true);
			
			if (!currentUser || !currentUser.email || !currentUser.login || !supabase) {
				setIsSupabaseLoggedIn(false);
				setIsAuthChecking(false);
				return;
			}
			
			try {
				const { data, error: supabaseError } = await supabase.auth.getUser();
				
				if (supabaseError || !data.user) {
					// User not found, attempt to sign in
					const password = generatePassword(currentUser.login, currentUser.email);
					const { error: signinError } = await supabase.auth.signInWithPassword({
						email: currentUser.email,
						password: password,
					});
					
					if (signinError) {
						console.error('Failed to sign in:', signinError);
						setIsSupabaseLoggedIn(false);
					} else {
						setIsSupabaseLoggedIn(true);
					}
				} else {
					// User found and authenticated
					setIsSupabaseLoggedIn(true);
				}
			} catch (err) {
				console.error('Authentication error:', err);
				setIsSupabaseLoggedIn(false);
			} finally {
				setIsAuthChecking(false);
			}
		};

		if (!isSupabaseHookLoading && !supabaseHookError) {
			checkSupabaseLogin();
		}
	}, [currentUser, supabase, isSupabaseHookLoading, supabaseHookError]);

	// Si l'utilisateur n'est pas authentifié, ne rien afficher (la redirection est gérée par useEffect)
	if (!currentUser || !isSupabaseLoggedIn) {
		return <LoginContent />;
	}

	// Pendant le chargement initial
	if (isLoading || isAuthChecking || isSupabaseHookLoading) {
		return (
			<Box style={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<Loading />
			</Box>
		);
	}

	// Afficher le contenu protégé
	return <>{children}</>;
};

export default Protected;
