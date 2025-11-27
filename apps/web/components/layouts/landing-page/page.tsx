"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Header } from "../../child/header";
import { HeroSection } from "./childs/hero-section";
import { FeaturesSection } from "./childs/features-section";
import { CTASection } from "./childs/cta-section";

export default function Landingpage() {
  const router = useRouter();

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
