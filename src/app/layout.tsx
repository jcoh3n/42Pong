import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Protected from "@/components/Protected";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

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
            <Protected>{children}</Protected>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
