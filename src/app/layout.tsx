import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import { Box, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { ThemeProvider } from "next-themes";
import ThemeLayout from "@/components/ThemeLayout";

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
    <html lang="en">
      <body>
        <AuthProvider>
			<ThemeProvider attribute="class" enableSystem>
				<ThemeLayout>
					<Flex style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
						<Sidebar />
							<div style={{ width: '100%', height: '100%', backgroundColor: 'var(--gray-2)', overflow: 'auto' }}>
								<Protected>
									{children}
								</Protected>
							</div>
					</Flex>
				</ThemeLayout>
		    </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
