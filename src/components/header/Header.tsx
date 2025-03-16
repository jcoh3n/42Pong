"use client";

import { Flex, Box, Avatar } from "@radix-ui/themes";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";
import useCurrentUser from "@/hooks/useCurrentUser";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { MobileOnly } from "@/components/ui/ResponsiveContainer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { MatchmakingBubble } from "./MatchmakingBubble";

interface HeaderProps {
	onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
	const { data: user } = useCurrentUser();
	const isDesktop = useMediaQuery(MEDIA_QUERIES['2xl']);
	
	return (
		<Box 
			className={`
				fixed top-0 right-0 z-40
				${isDesktop ? 'left-[332px]' : 'left-0'}
				transition-all duration-300 p-4
			`}
		>
			<div 
				className={`
					relative rounded-2xl
					border border-gray-800/50 
					${window.scrollY > 70 ? 'shadow-xl shadow-black/10' : 'shadow-none'}
					overflow-hidden
				`} // to remove transparency: bg-gray-900/95
			>
				{/* Blur effect background */}
				<div 
					className="absolute inset-0 bg-gradient-to-b from-[var(--page-gradient-from)]/50 to-[var(--page-gradient-to)]/0"
					style={{
						WebkitBackdropFilter: 'blur(8px)',
						backdropFilter: 'blur(8px)',
					}}
				/>
				
				{/* Content container */}
				<Flex 
					align="center" 
					justify="between" 
					px="4" 
					py="3"
					className="relative h-12"
				>
					{/* Left side - Menu button on mobile */}
					<MobileOnly>
						<Box 
							onClick={onMenuClick} 
							className="
								cursor-pointer p-2 hover:bg-white/5 rounded-full
								transition-all duration-200 active:scale-95
							"
							aria-label="Menu"
							role="button"
							tabIndex={0}
							onKeyDown={(e) => e.key === 'Enter' && onMenuClick && onMenuClick()}
						>
							<HamburgerMenuIcon width="20" height="20" className="text-gray-400" />
						</Box>
					</MobileOnly>

					{/* Center - Title */}
					<Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<span className="text-sm font-medium text-gray-300">42Pong</span>
					</Box>

					{/* Right side - User Profile (mobile) and Notifications */}
					<Flex align="center" gap="3" className="ml-auto">
						<MatchmakingBubble />
						<MobileOnly>
							{user && (
								<Link href="/profile" className="no-underline text-current">
									<Avatar
										size="2"
										src={user.avatar_url || undefined}
										fallback={user.login?.[0]?.toUpperCase() || "U"}
										radius="full"
										className="
											border border-gray-800 
											transition-all duration-200 
											hover:ring-2 hover:ring-blue-500/50
										"
									/>
								</Link>
							)}
						</MobileOnly>
						<NotificationBell />
					</Flex>
				</Flex>
			</div>
		</Box>
	);
} 