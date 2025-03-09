import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import { Box, Flex, Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Sidebar from "@/components/sidebar/Sidebar";

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
          <Theme accentColor="blue" grayColor="slate" scaling="100%" radius="medium">
            <Protected>
				<Flex style={{ width: '100%', height: '100vh' }}>
					<Sidebar />
					<div style={{ flex: 1, padding: '20px', width: '100%', height: '100%' }}>
						{children}
					</div>
				</Flex>
			</Protected>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
