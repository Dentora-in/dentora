import type { Metadata } from "next";
import { PublicHeader } from "@/components/layouts/public-header";
import { AppointmentClient } from "./appointment-client";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Schedule your dental consultation in minutes. Book an appointment with Dentora's easy online booking system.",
  keywords: [
    "book dental appointment",
    "dental consultation",
    "dentist appointment",
    "online booking",
  ],
  openGraph: {
    title: "Book Your Dental Appointment | Dentora",
    description:
      "Schedule your dental consultation quickly and easily with Dentora's online booking system.",
    url: "https://yourdomain.com/appointment",
    siteName: "Dentora",
    images: [
      {
        url: "https://yourdomain.com/og-appointment.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/appointment",
  },
};

export default function AppointmentPage() {
  return (
    <>
      <PublicHeader />
      <AppointmentClient />
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600;
