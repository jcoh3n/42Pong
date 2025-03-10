"use client";

import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import { Box, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "next-themes";
import ThemeLayout from "@/components/ThemeLayout";
import { Header } from "@/components/header/Header";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { useScrollLock } from "@/hooks/useScrollLock";

// Les métadonnées doivent être dans un fichier séparé ou dans un layout serveur
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery(MEDIA_QUERIES.lg);
  
  // Verrouiller le défilement lorsque le sidebar est ouvert sur mobile
  useScrollLock(isSidebarOpen && !isDesktop);
  
  // Fermer automatiquement le sidebar sur mobile lors du changement de page
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [children, isDesktop]);
  
  // Ouvrir automatiquement le sidebar sur desktop
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    }
  }, [isDesktop]);

  // Gérer l'ouverture/fermeture du sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <head>
        <title>42Pong</title>
        <meta name="description" content="A Pong game for 42 students" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <ThemeLayout>
            <Flex style={{ width: '100%', height: '100vh', overflow: 'hidden', flexDirection: 'row' }}>
              {/* Sidebar - responsive */}
              <div className={`
                fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}>
                <Sidebar 
                  isOpen={isSidebarOpen} 
                  onClose={() => setIsSidebarOpen(false)} 
                />
              </div>
              
              {/* Overlay pour mobile quand le sidebar est ouvert */}
              {isSidebarOpen && !isDesktop && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300 ease-in-out"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              
              {/* Contenu principal */}
              <Flex 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  overflow: 'hidden', 
                  flexDirection: 'column' 
                }}
                className={`
                  transition-all duration-300 ease-in-out
                  ${isDesktop && isSidebarOpen ? 'ml-[300px]' : 'ml-0'}
                `}
              >
                <Header onMenuClick={toggleSidebar} />
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--gray-2)', overflow: 'auto' }}>
                  <Protected>
                    {children}
                  </Protected>
                </div>
              </Flex>
            </Flex>
          </ThemeLayout>
        </AuthProvider>
      </body>
    </html>
  );
}