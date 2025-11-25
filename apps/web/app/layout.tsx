import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@workspace/ui/components/sonner";
import AuthWatcher from "@/components/providers/auth-watcher";
import { Header } from "@/components/child/header";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <AuthWatcher />
          <Header />
          <main>
            {children}
          </main>
        </Providers>

        <Toaster richColors />
      </body>
    </html>
  );
}
