"use client";

import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/components/AuthProvider";
import ThemeLayout from "@/components/ThemeLayout";
import { Box } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Header } from "@/components/header/Header";

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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Toaster />
        <AuthProvider>
          <ThemeLayout>
            <Box className="min-h-screen w-full bg-gradient-to-b from-[var(--page-gradient-from)] to-[var(--page-gradient-to)]">
              {children}
            </Box>
          </ThemeLayout>
        </AuthProvider>
      </body>
    </html>
  );
}