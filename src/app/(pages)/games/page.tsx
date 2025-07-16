'use client';

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import React, { useEffect, useState } from "react";
import MatchmakingMenu from "@/components/matchmaking/MatchmakingMenu";
import MatchPage from "@/components/match/MatchPage";
import useCurrentMatch from "@/hooks/matchmaking/useCurrentMatch";


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

	if (currentMatchId) {
		return <MatchPage matchId={currentMatchId} onLeave={onCurrentMatchLeave} />;
	} else if (matchmakingData.data?.data?.inQueue) {
		// return queue page
	} else {
		// return matchmaking menu
	}

	return <MatchmakingMenu />;
}