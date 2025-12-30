"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] md:min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-4xl text-center relative z-10">
        {/* Badge */}
        <div
          className={`mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full bg-muted/50 px-4 py-1.5 text-sm border border-border/40 backdrop-blur-sm transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground font-medium">
            Simplifying Dental Care
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className={`text-balance text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 md:mb-6 text-foreground leading-tight transition-all duration-700 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Smarter Online Scheduling for Your Dental Care
        </h1>

        {/* Subheadline */}
        <p
          className={`text-balance text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Connect with experienced dentists and book appointments in seconds.
          Modern, secure, and built for convenience.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 md:mb-12 px-4 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[180px] h-12 text-base font-medium shadow-lg hover:shadow-xl transition-shadow"
            asChild
          >
            <Link href="/appointment">Book Appointment</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[180px] h-12 text-base font-medium border-2"
            asChild
          >
            <Link href="/signup">Start for Free</Link>
          </Button>
        </div>

        {/* Social Proof / Stats */}
        <div
          className={`mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto px-4 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/20">
            <div className="text-3xl md:text-3xl font-bold text-foreground mb-1">
              24/7
            </div>
            <p className="text-sm md:text-sm text-muted-foreground">
              Book appointments anytime
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/20">
            <div className="text-3xl md:text-3xl font-bold text-foreground mb-1">
              100%
            </div>
            <p className="text-sm md:text-sm text-muted-foreground">
              Secure data encryption
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/20">
            <div className="text-3xl md:text-3xl font-bold text-foreground mb-1">
              0 Hassle
            </div>
            <p className="text-sm md:text-sm text-muted-foreground">
              Smooth and simple experience
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
