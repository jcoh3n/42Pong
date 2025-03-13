'use client';

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import React, { useEffect, useState } from "react";
import MatchmakingMenu from "@/components/matchmaking/MatchmakingMenu";
import MatchPage from "@/components/match/MatchPage";
import MatchPageDev from "@/components/match/MatchPageDev";
import useCurrentMatch from "@/hooks/matchmaking/useCurrentMatch";

/**
 * ORGANISATION DU DÉVELOPPEMENT
 * 
 * 1. Mode développement :
 *    - Activez DEV_MODE = true pendant le développement
 *    - Travaillez dans le composant MatchPageDev.tsx
 *    - Testez toutes les fonctionnalités dans cet environnement isolé
 * 
 * 2. Processus de développement :
 *    - Modifiez l'interface et ajoutez des fonctionnalités dans MatchPageDev
 *    - Testez différents scénarios (victoire, défaite, forfait)
 *    - Les données de test sont déjà configurées (mockMatch, mockCurrentUser, mockOpponent)
 * 
 * 3. Mise en production :
 *    - Une fois le développement terminé, copiez les modifications vers MatchPage.tsx
 *    - Désactivez le mode développement (DEV_MODE = false)
 *    - Testez en conditions réelles
 */

// Constante pour activer/désactiver le mode développement
const DEV_MODE = true;

export default function GamePage() {
	const matchmakingData = useMatchmaking();
	const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

	useEffect(() => {
		if (matchmakingData.data?.data?.inMatch) {
			setCurrentMatchId(matchmakingData.data?.data?.matchData?.id || null);
		}
	}, [matchmakingData.data?.data?.inMatch, matchmakingData.data?.data?.matchData?.id]);

	const onCurrentMatchLeave = () => {
		setCurrentMatchId(null);
	}

	// Si on est en mode développement, on affiche directement la page de match en mode dev
	if (DEV_MODE) {
		return <MatchPageDev />;
	}

	if (currentMatchId) {
		return <MatchPage matchId={currentMatchId} onLeave={onCurrentMatchLeave} />;
	} else if (matchmakingData.data?.data?.inQueue) {
		// return queue page
	} else {
		// return matchmaking menu
	}

	return <MatchmakingMenu />;
}