import { ArrowRight, Calendar, UserCheck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "Find Your Dentist",
    description:
      "Browse verified dental professionals in your area with detailed profiles and availability.",
  },
  {
    icon: UserCheck,
    title: "Book Instantly",
    description:
      "Select a time slot that works for you and book your appointment in just a few clicks.",
  },
  {
    icon: CheckCircle2,
    title: "Get Confirmation",
    description:
      "Receive instant confirmation with reminders sent before your appointment.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-24 md:py-32 px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-balance text-4xl md:text-5xl font-bold mb-5 text-foreground tracking-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Book your dental appointment in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connector Line (hidden on mobile, shown on desktop between cards) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border via-border to-transparent" />
                )}

                {/* Step Number Badge */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                  <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" strokeWidth={2} />
                  </div>
                  {/* Step number overlay */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
