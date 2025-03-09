import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import { Box, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "next-themes";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "42Pong",
  description: "A Pong game for 42 students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.add(theme);
                document.documentElement.style.colorScheme = theme;
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            value={{ light: 'light', dark: 'dark' }}
          >
            <Theme accentColor="blue" appearance="inherit" grayColor="slate" scaling="100%" radius="medium">
              <Protected>
                <Flex style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
                  <Sidebar />
                  <div style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: 'var(--gray-2)', overflow: 'auto' }}>
                    {children}
                  </div>
                </Flex>
              </Protected>
            </Theme>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
