import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const features = [
  {
    icon: "📅",
    title: "Smart Scheduling",
    description:
      "Automated appointment scheduling with reminders and conflict detection for your entire team.",
  },
  {
    icon: "👥",
    title: "Patient Management",
    description:
      "Complete patient profiles with medical history, treatment plans, and communication logs.",
  },
  {
    icon: "💰",
    title: "Billing & Payments",
    description:
      "Streamlined invoicing, payment processing, and insurance claim management.",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description:
      "Real-time insights into practice performance, revenue, and patient trends.",
  },
  {
    icon: "🔐",
    title: "Secure Records",
    description:
      "HIPAA-compliant data storage with end-to-end encryption for patient privacy.",
  },
  {
    icon: "📱",
    title: "Mobile App",
    description:
      "Access patient data and schedule appointments on the go with our mobile application.",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-20 md:py-32 px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-balance text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Everything You Need to Run Your Practice
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dentora provides comprehensive tools designed specifically for
            dental practices of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="text-4xl mb-3">{feature.icon}</div>
                <CardTitle className="text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
