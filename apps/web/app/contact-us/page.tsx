import type { Metadata } from "next";
import { PublicHeader } from "@/components/layouts/public-header";
import { Footer } from "@/components/layouts/landing-page/childs/footer";
import { PageHeader } from "@/components/shared/page-header";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ContactForm } from "@/components/forms/contact-form";
import { Mail, Building2, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Dentora. We're here to help with your questions about our dental appointment platform.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "General Support",
    detail: "support@dentora.com",
    description: "For questions about using the platform",
  },
  {
    icon: Building2,
    title: "Business Inquiries",
    detail: "business@dentora.com",
    description: "Partnership and collaboration opportunities",
  },
  {
    icon: MapPin,
    title: "Location",
    detail: "San Francisco, CA",
    description: "Based in the United States",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <SectionWrapper className="pt-20 md:pt-28">
          <PageHeader
            title="Get in Touch"
            description="Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours."
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Left Section - Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Reach out through any of these channels and we'll respond as
                  quickly as possible.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <Card
                      key={index}
                      className="border-border/50 hover:border-border transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base mb-1">
                              {info.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {info.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm font-medium text-foreground pl-11">
                          {info.detail}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Section - Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}
