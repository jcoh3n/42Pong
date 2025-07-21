"use client";

import "./globals.css";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster } from 'react-hot-toast';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery(MEDIA_QUERIES["2xl"]);

  // Automatically close sidebar on mobile when route changes
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isDesktop]);

  // Open sidebar automatically on desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    }
  }, [isDesktop]);

  // Scroll to top when route changes
  useEffect(() => {
    // Scroll the main container, not the window
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
  }, [pathname]);

  const toggleSidebar = () => {
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
      <body>
        <Toaster />
        <AuthProvider>
          <ThemeLayout>
            <Flex
              style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
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

              <Header onMenuClick={toggleSidebar} />

              <Flex
                style={{
                  flex: 1,
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  zIndex: 10,
                }}
              >
                {/* Zone de contenu principal */}
                <main
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "auto",
                    paddingTop: "var(--header-padding)",
                  }}
                >
                  <div className="p-5 ">
                    <Protected>{children}</Protected>
                  </div>
                </main>

                {/* Sidebar - responsive */}
                <div
                  className={`
                    fixed top-4 bottom-4 left-4 z-50
                    transform transition-all duration-300 ease-in-out
                    ${
                      !isDesktop && !isSidebarOpen
                        ? "-translate-x-full"
                        : "translate-x-0"
                    }
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

                {/* Overlay pour mobile quand le sidebar est ouvert */}
                {isSidebarOpen && !isDesktop && (
                  <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-in-out"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}
              </Flex>
            </Flex>
          </ThemeLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
