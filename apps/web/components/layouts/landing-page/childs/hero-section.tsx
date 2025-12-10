import { Button } from "@workspace/ui/components/button";

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2">
          <p className="text-sm font-light text-primary">
            {/* Introducing Dentora Pro */}
            ✨ Simplifying Dental Care.
          </p>
        </div>

        <h1 className="text-balance text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Smarter Online Scheduling for Your Dental Care
        </h1>

        <p className="text-balance text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with experienced dentists and book online appointments in
          seconds — making quality oral care more accessible than ever.
        </p>
        {/* <p className="text-balance text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Streamline your dental clinic with intelligent appointment scheduling, patient management, billing, and
          detailed analytics—all in one intuitive platform.
        </p> */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <a href="/appointment">Book Appointment</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/user/signup">Start for Free</a>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-lg font-bold text-primary">24/7</div>
            <p className="text-sm">Book appointments anytime</p>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">100%</div>
            <p className="text-sm">Secure data encryption</p>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">0 Hassle</div>
            <p className="text-sm">Smooth and simple experience</p>
          </div>
        </div>
      </div>
    </section>
  );
}
