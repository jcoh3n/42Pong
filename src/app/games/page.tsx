'use client';

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import React, { useEffect, useState } from "react";
import MatchmakingMenu from "@/components/matchmaking/MatchmakingMenu";
import MatchPage from "@/components/match/MatchPage";
import QuickMatchPage from "@/components/match/QuickMatchPage";
import { FaLaptopHouse } from "react-icons/fa";

/**
 * ORGANISATION DU FONCTIONNEMENT DE LA PARTIE MATCH
 * 
 * 1. Choix des 3 modes de jeu :
 *    - Quick Match : Match rapide avec 1 set par défaut
 *    - Ranked Match : Match classé avec 5 sets (3 sets gagnants)
 *    - Challenge Friend : Invitation d'un ami pour un match (nombre de sets au choix)
 * 
 * 2. Flux de navigation :
 *    - Quick Match : 
 *      -> Redirection directe vers la page de match avec 1 set
 * 
 *    - Ranked Match : 
 *      -> Redirection directe vers la page de match avec 5 sets
 * 
 *    - Challenge Friend :
 *      -> Sélection d'un ami et du nombre de sets
 *      -> Redirection vers la page de match après acceptation
 */

// MODES DE JEU
// 1. QUICK_MATCH_MODE : Mode match rapide avec 1 set par défaut
// 2. RANKED_MATCH_MODE : Mode match classé avec 5 sets par défaut
// 3. FRIEND_MATCH_MODE : Mode match entre amis (via invitation)
const QUICK_MATCH_MODE = true;
const RANKED_MATCH_MODE = true;
const FRIEND_MATCH_MODE = true;

// Nombre de sets par défaut pour chaque mode
const DEFAULT_QUICK_SETS = 1;
const DEFAULT_RANKED_SETS = 5;
const DEFAULT_FRIEND_SETS = 3;

export default function GamePage() {
	const matchmakingData = useMatchmaking();
	const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
	const [matchType, setMatchType] = useState<'quick' | 'ranked' | 'friend' | null>(null);

	useEffect(() => {
		if (matchmakingData.data?.data?.inMatch) {
			setCurrentMatchId(matchmakingData.data?.data?.matchData?.id || null);
			
			// Déterminer le type de match en fonction du mode
			// Vérifier le mode de jeu à partir des données du match
			const matchType = matchmakingData.data?.data?.matchData?.match_type;
			
			if (matchType === 'normal') {
				setMatchType('quick');
			} else if (matchType === 'ranked') {
				setMatchType('ranked');
			} else if (matchType === 'friendly') {
				setMatchType('friend');
			} else {
				// Par défaut, si le mode n'est pas spécifié
				setMatchType('quick');
			}
		}
	}, [matchmakingData.data?.data?.inMatch, matchmakingData.data?.data?.matchData]);

	const onCurrentMatchLeave = () => {
		setCurrentMatchId(null);
		setMatchType(null);
	}

	// Si l'utilisateur est en match, afficher la page de match
	if (matchmakingData.data?.data?.inMatch && currentMatchId) {
		// Déterminer le nombre de sets en fonction du type de match
		let maxSets = DEFAULT_RANKED_SETS; // Par défaut
		
		if (matchType === 'quick') {
			maxSets = DEFAULT_QUICK_SETS;
		} else if (matchType === 'ranked') {
			maxSets = DEFAULT_RANKED_SETS;
		} else if (matchType === 'friend') {
			maxSets = DEFAULT_FRIEND_SETS;
		}
		
		return <MatchPage 
			matchId={currentMatchId} 
			onLeave={onCurrentMatchLeave} 
			maxSets={maxSets}
		/>;
	}

	// Par défaut, afficher le menu de matchmaking
	return <MatchmakingMenu />;
}