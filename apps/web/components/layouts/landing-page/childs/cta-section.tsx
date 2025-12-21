import { Button } from "@workspace/ui/components/button";

export function CTASection() {
  return (
    <section className="w-full py-20 md:py-32 px-6 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Ready to Transform Your Dental Practice?
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Join hundreds of dental practices that trust Dentora to manage their
          operations efficiently and securely.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild>
            <a href="/user/signup">Get Started Free</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/contact">Contact Sales</a>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          No credit card required. 14-day free trial included.
        </p>
      </div>
    </section>
  );
}
