import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-1.5 text-sm border border-border/40 backdrop-blur-sm">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground font-medium">
            Simplifying Dental Care
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-balance text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
          Smarter Online Scheduling for Your Dental Care
        </h1>

        {/* Subheadline */}
        <p className="text-balance text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with experienced dentists and book appointments in seconds.
          Modern, secure, and built for convenience.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="min-w-[180px] h-12 text-base" asChild>
            <Link href="/appointment">Book Appointment</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[180px] h-12 text-base border-border/60 hover:border-border"
            asChild
          >
            <Link href="/signup">Start for Free</Link>
          </Button>
        </div>

        {/* Social Proof / Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
            <p className="text-sm text-muted-foreground">
              Book appointments anytime
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">100%</div>
            <p className="text-sm text-muted-foreground">
              Secure data encryption
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              0 Hassle
            </div>
            <p className="text-sm text-muted-foreground">
              Smooth and simple experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
