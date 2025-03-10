"use client";

import { Flex, Box, Avatar } from "@radix-ui/themes";
import { SearchBar } from "./SearchBar";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";
import useCurrentUser from "@/hooks/useCurrentUser";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { MobileOnly, DesktopOnly } from "@/components/ui/ResponsiveContainer";

interface HeaderProps {
	onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
	const { data: user } = useCurrentUser();
	
	const handleSearch = (query: string) => {
		console.log("Searching for:", query);
	};

	return (
		<Box className="border-b border-gray-800 sticky top-0 z-10 bg-background w-full">
			<Flex 
				align="center" 
				justify="between" 
				px="4" 
				py="3"
				className="h-16"
			>
				{/* Left side - Menu button on mobile, User Profile on desktop */}
				<Flex align="center" gap="2">
					{/* Menu button - visible only on mobile */}
					<MobileOnly>
						<Box 
							onClick={onMenuClick} 
							className="cursor-pointer p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
							aria-label="Menu"
							role="button"
							tabIndex={0}
							onKeyDown={(e) => e.key === 'Enter' && onMenuClick && onMenuClick()}
						>
							<HamburgerMenuIcon width="24" height="24" />
						</Box>
					</MobileOnly>
					
					{/* User profile - desktop only */}
					<DesktopOnly>
						<Link 
							href="/profile" 
							prefetch 
							className="no-underline text-current"
						>
							<Flex align="center" gap="3">
								{user && (
									<>
										<Avatar
											size="2"
											src={user.avatar_url || undefined}
											fallback={user.login?.[0]?.toUpperCase() || "U"}
											radius="full"
											className="border border-gray-700"
										/>
										<span className="text-sm font-medium text-gray-200">
											{user.login}
										</span>
									</>
								)}
							</Flex>
						</Link>
					</DesktopOnly>
				</Flex>

				{/* Center - Search Bar - responsive width */}
				<Box className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] mx-4">
					<SearchBar 
						onSearch={handleSearch}
						placeholder="Search item"
					/>
				</Box>

				{/* Right side - Notifications */}
				<Flex align="center" gap="4">
					<NotificationBell count={2} />
				</Flex>
			</Flex>
		</Box>
	);
} 