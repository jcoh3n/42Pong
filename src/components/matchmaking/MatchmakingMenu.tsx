import React, { useState } from 'react';
import { FaTrophy, FaUserFriends } from 'react-icons/fa';
import { GiPingPongBat } from 'react-icons/gi';
import useMatchmaking from '@/hooks/matchmaking/useMatchmaking';
import GameModeCard from './GameModeCard';
import QueueTimer from './QueueTimer';
import { Database } from '@/types/database.types';
import { IconType } from 'react-icons';
import { MatchType } from '@/services';
import UserSearchModal from './UserSearchModal';
import { InvitationService } from '@/services/invitationService';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

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
		color: "#22c55e", // Vert (comme Victoires dans profile)
		bgColor: "rgba(34, 197, 94, 0.12)",
		glowColor: "rgba(34, 197, 94, 0.3)",
		mode: 'normal',
	},
	{
		title: "Ranked Match",
		icon: FaTrophy,
		color: "#3b82f6", // Bleu (comme Total dans profile)
		bgColor: "rgba(59, 130, 246, 0.12)",
		glowColor: "rgba(59, 130, 246, 0.3)",
		mode: 'ranked'
	},
	{
		title: "Challenge Friend",
		icon: FaUserFriends,
		color: "#f59e0b", // Orange (comme Win Rate dans profile)
		bgColor: "rgba(245, 158, 11, 0.12)",
		glowColor: "rgba(245, 158, 11, 0.3)",
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

	const { data: session } = useSession();
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
	const invitationService = new InvitationService();

	const isInQueue = matchmakingData?.data?.inQueue;

	const handleGameModeClick = async (mode: MatchType) => {
		if (mode === 'friendly') {
			setIsSearchModalOpen(true);
			return;
		}

		if (isInQueue) {
			stopMatchmaking();
		} else {
			startMatchmaking(mode);
		}
	};

	const handleUserSelect = async (userId: string) => {
		if (!session?.user?.id) return;

		try {
			await invitationService.createFriendlyInvitation(session.user.id, userId);
		} catch (error) {
			console.error('Error sending invitation:', error);
			toast.error('Failed to send invitation. Please try again.');
		}
	};

	const handleUserDeselect = async (userId: string) => {
		if (!session?.user?.id) return;

		try {
			// First, find the invitation between current user and selected user
			const invitations = await invitationService.getFriendlyInvitations(session.user.id);
			const targetInvitation = invitations.find(inv => 
				inv.status === 'pending' && (
					(inv.sender_id === session.user.id && inv.receiver_id === userId) ||
					(inv.sender_id === userId && inv.receiver_id === session.user.id)
				)
			);

			if (targetInvitation) {
				await invitationService.updateInvitationStatus(targetInvitation.id, 'cancelled');
			} else {
				toast.error('Could not find the invitation to cancel.');
			}
		} catch (error) {
			console.error('Error cancelling invitation:', error);
			toast.error('Failed to cancel invitation. Please try again.');
		}
	};

	return (
		<div 
			className="h-full w-full grid place-items-center"
		>
			<div className="w-full py-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 h-full">
				{/* Layout pour centrer les 3 éléments */}
				<div className="flex flex-col items-center justify-center h-full space-y-6 sm:space-y-8 py-8">
					{/* Quick Match - En haut */}
					{GAME_MODES.filter(mode => mode.mode === 'normal').map((mode) => {
						const inModeQueue = isInQueue && matchmakingData.data?.queueData?.matche_type === mode.mode;
						const isActive = !isInQueue || inModeQueue;
						const hasMatchmaking = mode.mode === 'normal' || mode.mode === 'ranked';

						return (
							<div key={mode.title} className="w-full max-w-2xl">
								<GameModeCard
									title={mode.title}
									icon={mode.icon}
									color={mode.color}
									bgColor={mode.bgColor}
									glowColor={mode.glowColor}
									isLoading={matchmakingIsLoading}
									isActive={isActive}
									onClick={() => handleGameModeClick(mode.mode)}
									additionalContent={hasMatchmaking && isInQueue &&
										<QueueTimer time={timeInQueue} />
									}
								/>
							</div>
						);
					})}

					{/* Ranked Match - Au centre */}
					{GAME_MODES.filter(mode => mode.mode === 'ranked').map((mode) => {
						const inModeQueue = isInQueue && matchmakingData.data?.queueData?.matche_type === mode.mode;
						const isActive = !isInQueue || inModeQueue;
						const hasMatchmaking = mode.mode === 'normal' || mode.mode === 'ranked';

						return (
							<div key={mode.title} className="w-full max-w-2xl">
								<GameModeCard
									title={mode.title}
									icon={mode.icon}
									color={mode.color}
									bgColor={mode.bgColor}
									glowColor={mode.glowColor}
									isLoading={matchmakingIsLoading}
									isActive={isActive}
									onClick={() => handleGameModeClick(mode.mode)}
									additionalContent={hasMatchmaking && isInQueue &&
										<QueueTimer time={timeInQueue} />
									}
								/>
							</div>
						);
					})}

					{/* Challenge Friends - En bas */}
					{GAME_MODES.filter(mode => mode.mode === 'friendly').map((mode) => {
						const inModeQueue = isInQueue && matchmakingData.data?.queueData?.matche_type === mode.mode;
						const isActive = !isInQueue || inModeQueue;
						const hasMatchmaking = mode.mode === 'normal' || mode.mode === 'ranked';

						return (
							<div key={mode.title} className="w-full max-w-2xl">
								<GameModeCard
									title={mode.title}
									icon={mode.icon}
									color={mode.color}
									bgColor={mode.bgColor}
									glowColor={mode.glowColor}
									isLoading={matchmakingIsLoading}
									isActive={isActive}
									onClick={() => handleGameModeClick(mode.mode)}
									additionalContent={hasMatchmaking && isInQueue &&
										<QueueTimer time={timeInQueue} />
									}
								/>
							</div>
						);
					})}
				</div>
			</div>

			<UserSearchModal
				isOpen={isSearchModalOpen}
				onClose={() => setIsSearchModalOpen(false)}
				onSelectUser={handleUserSelect}
				onDeselectUser={handleUserDeselect}
				currentUserId={session?.user?.id || ''}
			/>
		</div>
	);
};

export default MatchmakingMenu;