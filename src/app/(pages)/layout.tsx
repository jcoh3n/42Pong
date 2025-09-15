"use client";

import "./globals.css";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/AuthProvider";
import ThemeLayout from "@/components/ThemeLayout";
import { Header } from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import Protected from "@/components/Protected";
import { Flex } from "@radix-ui/themes";
import { Squares } from "@/components/ui/squares-background";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const isDesktop = useMediaQuery(MEDIA_QUERIES["2xl"]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);

	// Automatically close sidebar on mobile when route changes
	useEffect(() => {
		if (!isDesktop) {
			setIsSidebarOpen(false);
		} else {
			setIsSidebarOpen(true);
		}
	}, [isDesktop]);

	// Scroll to top when route changes
	useEffect(() => {
		// Scroll the main container, not the window
		const mainElement = document.querySelector("main");
		if (mainElement) {
			mainElement.scrollTo(0, 0);
		}
	}, [pathname]);

	const toggleSidebar = (e: any) => {
		e.stopPropagation();
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<html lang="en">
			<head>
				<title>42Pong</title>
				<meta name="description" content="A Pong game for 42 students" />
				<link rel="icon" href="/icon.svg" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
				/>
				<meta name="theme-color" content="#060606" />
			</head>
			<body
				onClick={() => {
					setIsSidebarOpen(false);
				}}
			>
				<Toaster />
				<AuthProvider>
					<ThemeLayout>
						<Flex
							style={{
								width: "100vw",
								height: "full",
								bottom: "0",
								display: "flex",
								flexDirection: "column",
								position: "relative",
								background: "#060606",
							}}
						>
							{/* Background squares */}
							<div className="absolute inset-0 w-full h-full">
								<Squares
									direction="diagonal"
									speed={0.5}
									squareSize={40}
									borderColor="#333"
									hoverFillColor="#222"
								/>
							</div>

							<Header
								onClick={() => setIsSidebarOpen(false)}
								onMenuClick={toggleSidebar}
							/>

							<Flex
								style={{
									flex: 1,
									position: "relative",
									width: "100%",
									zIndex: 10,
								}}
							>
								{/* Zone de contenu principal */}
								<main
									style={{
										width: "100%",
										minHeight: "calc(100vh - 110px)",
										position: "relative",
										marginTop: "var(--header-padding)",
									}}
									className={`mx-4 px-5 py-5
										${isDesktop ? "ml-[350px]" : isSidebarOpen && "overflow-hidden"}
									`}
								>
									<div className="h-full grid place-items-center">
										<Protected>{children}</Protected>
									</div>
								</main>
							</Flex>
						</Flex>

						{/* Sidebar - responsive */}
						{isDesktop ? (
							// Desktop version: Sidebar always visible, no overlay
							<div
								className={`
											fixed left-4 z-50
											translate-x-0
											top-0
											bottom-12
										`}
								style={{
									width: "300px",
									height: "calc(100vh - 110)",
								}}
							>
								<Sidebar
									isOpen={true}
									onClose={() => setIsSidebarOpen(false)}
								/>
							</div>
						) : (
							// Mobile version: Sidebar slides in/out, overlay when open
							<>
								<div
									className={`
												fixed top-4 bottom-0 left-4 z-50
												transform transition-all duration-300 ease-in-out
												${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
											`}
									style={{
										width: "300px",
										height: "calc(100vh - 32px)",
									}}
								>
									<Sidebar
										isOpen={isSidebarOpen}
										onClose={() => setIsSidebarOpen(false)}
									/>
								</div>
								{isSidebarOpen && (
									<div
										className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out"
										onClick={() => setIsSidebarOpen(false)}
									/>
								)}
							</>
						)}
					</ThemeLayout>
				</AuthProvider>
			</body>
		</html>
	);
}
