'use client';

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import React from "react";
import MatchmakingMenu, { MatchmakingProps } from "@/components/matchmaking/MatchmakingMenu";
import MatchPage from "@/components/match/MatchPage";


export default function GamePage() {
	const matchmakingData = useMatchmaking();
	
	const props: MatchmakingProps = {
		matchmakingData: matchmakingData.data,
		matchmakingError: matchmakingData.error,
		matchmakingIsLoading: matchmakingData.isLoading,
		startMatchmaking: matchmakingData.startMatchmaking,
		stopMatchmaking: matchmakingData.stopMatchmaking,
		timeInQueue: matchmakingData.timeInQueue
	};

	if (matchmakingData.data?.data?.inMatch) {
		return <MatchPage {...props} />;
	} else if (matchmakingData.data?.data?.inQueue) {
		// return queue page
	} else {
		// return matchmaking menu
	}

	return <MatchmakingMenu {...props} />;
}