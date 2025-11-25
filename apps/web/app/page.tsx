import Landingpage from "@/components/layouts/landingpage";

export const metadata = {
  title: "Dentora – Modern Dental Management System",
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
  openGraph: {
    title: "Dentora – Smart Dental Clinic Management",
    description:
      "Streamline your dental clinic with Dentora. Appointments, patient records, billing, reminders and more.",
    url: "https://yourdomain.com",
    siteName: "Dentora",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentora – Smart Dental Clinic Software",
    description:
      "Powerful software for dental clinics — appointments, records, billing & dashboard.",
    images: ["https://yourdomain.com/og-image.png"],
  },
};

export default function Page() {
  return <Landingpage />;
}
