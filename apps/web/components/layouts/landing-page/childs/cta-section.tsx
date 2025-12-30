import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { AnimatedBackground } from "../../animation";

export function CTASection() {
  return (
    <section className="relative w-full py-24 md:py-32 px-6 overflow-hidden">
      {/* Subtle animated background */}
      <AnimatedBackground variant="cta" />

      <div className="mx-auto max-w-3xl text-center relative z-10">
        {/* Headline */}
        <h2 className="text-balance text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
          Ready to Simplify Your Dental Care?
        </h2>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Join patients who trust our platform for convenient, secure, and
          modern dental appointments.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" className="min-w-[200px] h-12 text-base" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[200px] h-12 text-base border-border/60 hover:border-border"
            asChild
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Fine Print */}
        <p className="text-sm text-muted-foreground">
          No credit card required • Free to start • Cancel anytime
        </p>
      </div>
    </section>
  );
}
