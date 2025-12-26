import { Lexend, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers/providers";
import { Toaster } from "@workspace/ui/components/sonner";

const fontSans = Lexend({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "600",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Dentora – Modern Dental Management System",
    template: "%s | Dentora",
  },
  description:
    "Dentora is a smart dental management platform for clinics. Manage appointments, patients, billing and records with ease.",
  keywords: [
    "dental software",
    "dentora",
    "dental management system",
    "clinic software",
    "patient management",
    "appointment booking",
  ],
  authors: [{ name: "Dentora" }],
  creator: "Dentora",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Dentora",
    title: "Dentora – Smart Dental Clinic Management",
    description:
      "Streamline your dental clinic with Dentora. Appointments, patient records, billing, reminders and more.",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dentora - Dental Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentora – Smart Dental Clinic Software",
    description:
      "Powerful software for dental clinics — appointments, records, billing & dashboard.",
    images: ["https://yourdomain.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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
        <Providers session={null}>{children}</Providers>

        <Toaster richColors />
      </body>
    </html>
  );
}
