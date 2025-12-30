import { Shield, Lock, Heart, Zap } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description:
      "Your data is protected with industry-leading security standards and compliance.",
  },
  {
    icon: Lock,
    title: "Encrypted & Secure",
    description:
      "End-to-end encryption ensures your health information stays private and safe.",
  },
  {
    icon: Heart,
    title: "Built for Patients",
    description:
      "Designed with your convenience in mind—simple, fast, and accessible.",
  },
  {
    icon: Zap,
    title: "Always Reliable",
    description:
      "99.9% uptime ensures you can book appointments whenever you need them.",
  },
];

export function TrustSection() {
  return (
    <section className="w-full py-24 md:py-32 px-6 bg-muted/10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-balance text-4xl md:text-5xl font-bold mb-5 text-foreground tracking-tight">
            Built on Trust & Security
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Healthcare-grade infrastructure designed for clinics and patients
          </p>
        </div>

        {/* Trust Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div className="mb-5 p-4 rounded-2xl bg-background border border-border/40 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                  <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {point.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-16 pt-12 border-t border-border/30">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
