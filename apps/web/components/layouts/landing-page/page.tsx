import { HeroSection } from "./childs/hero-section";
import { FeaturesSection } from "./childs/features-section";
import { TrustSection } from "./childs/trust-section";
import { CTASection } from "./childs/cta-section";
import { Footer } from "./childs/footer";
import { AnimatedBackground } from "../animation";
import { HowItWorksSection } from "./childs/how-it-works-section";

export default function Landingpage() {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero background - fixed position */}
      <div className="relative">
        <AnimatedBackground variant="hero" />
        <HeroSection />
      </div>

      {/* Main content sections */}
      <main className="relative z-10">
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
