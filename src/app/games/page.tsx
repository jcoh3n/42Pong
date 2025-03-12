'use client';

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import React from "react";
import MatchmakingMenu, { MatchmakingProps } from "@/components/matchmaking/MatchmakingMenu";
import MatchPage from "@/components/match/MatchPage";
import useCurrentMatch from "@/hooks/matchmaking/useCurrentMatch";


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

	const currentMatchData = useCurrentMatch();

	if (currentMatchData.data?.match) {
		return <MatchPage {...currentMatchData} />;
	} else if (matchmakingData.data?.data?.inQueue) {
		// return queue page
	} else {
		// return matchmaking menu
	}

	return <MatchmakingMenu {...props} />;
}