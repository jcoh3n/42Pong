import React from 'react';
import { FaTrophy, FaUserFriends } from 'react-icons/fa';
import { GiPingPongBat } from 'react-icons/gi';
import useMatchmaking from '@/hooks/matchmaking/useMatchmaking';
import GameModeCard from './GameModeCard';
import QueueTimer from './QueueTimer';
import { Database } from '@/types/database.types';
import { IconType } from 'react-icons';
import { MatchType } from '@/services';

type GameMode = {
	title: string;
	icon: IconType;
	color: string;
	bgColor: string;
	glowColor: string;
	mode: MatchType;
};

const GAME_MODES: GameMode[] = [
	{
		title: "Quick Match",
		icon: GiPingPongBat,
		color: "#4CAF50",
		bgColor: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
		glowColor: "rgba(76, 175, 80, 0.3)",
		mode: 'normal',
	},
	{
		title: "Ranked Match",
		icon: FaTrophy,
		color: "#007BFF",
		bgColor: "linear-gradient(135deg, #007BFF 0%, #0056B3 100%)",
		glowColor: "rgba(0, 123, 255, 0.3)",
		mode: 'ranked'
	},
	{
		title: "Challenge Friend",
		icon: FaUserFriends,
		color: "#FF9800",
		bgColor: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
		glowColor: "rgba(255, 152, 0, 0.3)",
		mode: 'friendly'
	}
];


const MatchmakingMenu = () => {
	const { 
		data: matchmakingData, 
		error: matchmakingError, 
		isLoading: matchmakingIsLoading, 
		startMatchmaking, 
		stopMatchmaking,
		timeInQueue 
	} = useMatchmaking();

	const isInQueue = matchmakingData?.data?.inQueue;

	return (
		<div 
			className="h-full w-full flex items-center justify-center overflow-y-auto"
			style={{
				background: "linear-gradient(135deg, #121826 0%, #1E2A38 100%)",
				minHeight: "100%"
			}}
		>
			<div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] max-w-3xl mx-auto py-8 sm:py-12">
				<div className="space-y-6 sm:space-y-8 md:space-y-10">
					{GAME_MODES.map((mode) => {
						const inModeQueue = isInQueue && matchmakingData.data?.queueData?.matche_type === mode.mode;
						const isActive = !isInQueue || inModeQueue;
	
						const hasMatchmaking = mode.mode === 'normal' || mode.mode === 'ranked';

						return (
						<GameModeCard
							key={mode.title}
							title={mode.title}
							icon={mode.icon}
							color={mode.color}
							bgColor={mode.bgColor}
							glowColor={mode.glowColor}
							isLoading={matchmakingIsLoading}
							isActive={isActive}
							onClick={isInQueue ? stopMatchmaking : () => startMatchmaking(mode.mode)}
							additionalContent={hasMatchmaking && isInQueue &&
								<QueueTimer time={timeInQueue} />
							}
						/>
					)})}
				</div>
			</div>
		</div>
	);
};

export default MatchmakingMenu;