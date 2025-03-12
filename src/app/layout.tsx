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
		<Toaster />
        <AuthProvider>
          <ThemeLayout>
            <Flex 
              style={{ 
                width: '100%', 
                height: '100vh', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              {/* Sidebar - responsive */}
              <div 
                className={`
                  ${!isDesktop ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
                  transform transition-transform duration-300 ease-in-out
                  ${!isDesktop && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
                `}
                style={{ 
                  width: '300px',
                  flexShrink: 0,
                  height: '100%'
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
                  className="fixed inset-0 bg-black opacity-40 z-20 lg:hidden transition-opacity duration-300 ease-in-out"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}
              
              {/* Contenu principal */}
              <Flex 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  overflow: 'hidden', 
                  flexDirection: 'column',
                  flexGrow: 1
                }}
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