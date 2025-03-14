"use client";

import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import { Flex } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Sidebar from "@/components/sidebar/Sidebar";
import ThemeLayout from "@/components/ThemeLayout";
import { Header } from "@/components/header/Header";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Toaster } from 'react-hot-toast'


// Les métadonnées doivent être dans un fichier séparé ou dans un layout serveur
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery(MEDIA_QUERIES['2xl']);
  
  // Verrouiller le défilement lorsque le sidebar est ouvert sur mobile
  useScrollLock(isSidebarOpen && !isDesktop);
  
  // Fermer automatiquement le sidebar sur mobile lors du changement de page
  useEffect(() => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);
  
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
		<Toaster />
        <AuthProvider>
          <ThemeLayout>
            <Flex
              style={{ 
                width: '100vw', 
                height: '100vh', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <Header onMenuClick={toggleSidebar} />
              
              <Flex style={{ 
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
              }}>
                {/* Zone de contenu principal */}
                <main 
                  className="bg-gradient-to-b from-[var(--page-gradient-from)] to-[var(--page-gradient-to)]"
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'auto',
                    paddingTop: 'var(--header-padding)',
                  }}
                >
                  <Protected>
                    {children}
                  </Protected>
                </main>

                {/* Sidebar - responsive */}
                <div 
                  className={`
                    fixed top-4 bottom-4 left-4 z-50
                    transform transition-all duration-300 ease-in-out
                    ${!isDesktop && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
                  `}
                  style={{ 
                    width: '300px',
                    height: 'calc(100vh - 32px)',
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