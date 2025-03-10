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
		// Implement search functionality here
		console.log("Searching for:", query);
	};

	return (
		<Box 
			style={{ 
				borderBottom: '1px solid var(--gray-5)',
				position: 'sticky',
				top: 0,
				zIndex: 10,
				backgroundColor: 'var(--background)',
			}}
		>
			<Flex 
				align="center" 
				justify="between" 
				px="5" 
				py="3"
				style={{ height: '64px' }}
			>
				{/* Left side - Menu button on mobile, User Profile on desktop */}
				<Flex align="center" gap="2">
					{/* Menu button - visible only on mobile */}
					<MobileOnly>
						<Box 
							onClick={onMenuClick} 
							className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
							aria-label="Menu"
						>
							<HamburgerMenuIcon width="24" height="24" />
						</Box>
					</MobileOnly>
					
					{/* User profile - hidden on small screens */}
					<DesktopOnly>
						<Link href="/profile" prefetch style={{ textDecoration: 'none', color: 'system' }}>
							<Flex align="center" px='4' gap="2">
								<Box style={{ 
									display: 'flex', 
									alignItems: 'center', 
									justifyContent: 'center',
									width: '32px',
									height: '32px'
								}}>
									{user && (
										<>
											<Avatar
												size="2"
												src={user.avatar_url || undefined}
												fallback={user.login?.[0]?.toUpperCase() || "U"}
												radius="full"
											/>
											<Box style={{ marginLeft: '8px', fontWeight: 500, color: 'var(--gray-12)' }}>
												{user.login}
											</Box>
										</>
									)}
								</Box>
							</Flex>
						</Link>
					</DesktopOnly>
				</Flex>

				{/* Center - Search Bar - responsive width */}
				<Box className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[600px] mx-2 md:mx-6">
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