import { Lexend, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@workspace/ui/components/sonner";
import AuthWatcher from "@/components/providers/auth-watcher";
import HeaderWrapper from "@/components/layouts/header-wrapper";
import { auth } from "@dentora/auth/auth";
import { headers } from "next/headers";

const fontSans = Lexend({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "600",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers session={session}>
          <AuthWatcher />
          <HeaderWrapper />
          <main>{children}</main>
        </Providers>

        <Toaster richColors />
      </body>
    </html>
  );
}
