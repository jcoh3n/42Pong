"use client";

import { Flex, Box, Avatar } from "@radix-ui/themes";
import { SearchBar } from "./SearchBar";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";
import { type User } from "@/services/types";
import useCurrentUser from "@/hooks/useCurrentUser";

export function Header() {
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
			}}
		>
			<Flex 
				align="center" 
				justify="between" 
				px="5" 
				py="3"
				style={{ height: '64px' }}
			>
				{/* Left side - User Profile Picture */}
				<Flex align="center" gap="2">
					<Link href="/profile" prefetch style={{ textDecoration: 'none', color: 'inherit' }}>
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
				</Flex>

				{/* Center - Search Bar */}
				<Box style={{ flexGrow: 1, maxWidth: '600px', margin: '0 24px' }}>
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