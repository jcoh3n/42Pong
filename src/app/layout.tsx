import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";

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
			<Protected>{children}</Protected>
		</AuthProvider>
      </body>
    </html>
  );
}
