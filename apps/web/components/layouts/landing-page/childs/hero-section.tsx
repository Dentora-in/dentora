import { Button } from "@workspace/ui/components/button";

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2">
          <p className="text-sm font-medium text-primary">✨ Introducing Dentora Pro</p>
        </div>

        <h1 className="text-balance text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Smart Dental Management for Modern Practices
        </h1>

        <p className="text-balance text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Streamline your dental clinic with intelligent appointment scheduling, patient management, billing, and
          detailed analytics—all in one intuitive platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <a href="/user/signup">Start for Free</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/appointment">Schedule Demo</a>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">500+</div>
            <p className="text-sm text-muted-foreground">Active Practices</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">50K+</div>
            <p className="text-sm text-muted-foreground">Patients Managed</p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </section>
  )
}
