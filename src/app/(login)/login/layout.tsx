"use client";

import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/components/AuthProvider";
import ThemeLayout from "@/components/ThemeLayout";
import { Box } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Header } from "@/components/header/Header";
import { Squares } from "@/components/ui/squares-background";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>42Pong</title>
        <meta name="description" content="A Pong game for 42 students" />
        <link rel="icon" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#060606" />
      </head>
      <body>
        <Toaster />
        <AuthProvider>
          <ThemeLayout>
            <Box className="min-h-screen w-full bg-[#060606] relative">
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
              {/* Content */}
              <div className="relative z-10 h-full">
                {children}
              </div>
            </Box>
          </ThemeLayout>
        </AuthProvider>
      </body>
    </html>
  );
}