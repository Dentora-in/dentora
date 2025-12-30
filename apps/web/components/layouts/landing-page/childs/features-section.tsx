import {
  Calendar,
  Users,
  Shield,
  ChartBar,
  Lock,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Automated appointment scheduling with instant confirmations and intelligent conflict detection.",
  },
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Complete patient profiles with medical history, treatment plans, and seamless communication.",
  },
  {
    icon: ChartBar,
    title: "Practice Analytics",
    description:
      "Real-time insights into appointments, revenue trends, and patient engagement metrics.",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description:
      "Enterprise-grade security with end-to-end encryption and compliant data storage.",
  },
  {
    icon: Lock,
    title: "Secure Records",
    description:
      "Protected patient data with role-based access control and audit trails for peace of mind.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description:
      "Access your practice from anywhere with our fully responsive web application.",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full py-24 md:py-32 px-6 bg-muted/20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-balance text-4xl md:text-5xl font-bold mb-5 text-foreground tracking-tight">
            Everything You Need to Run Your Practice
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive tools designed specifically for dental practices of
            all sizes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Icon */}
                <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
