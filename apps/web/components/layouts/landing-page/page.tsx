"use client";

import { HeroSection } from "./childs/hero-section";
import { FeaturesSection } from "./childs/features-section";
import { CTASection } from "./childs/cta-section";

export default function Landingpage() {

  return (
    <>
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  );
}
