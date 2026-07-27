import { Button } from "@/src/components/ui/Button";

export function NewsletterSection() {
  return (
    <section className="padding-inline">
      <div className="bg-surface-3 mt-16 overflow-hidden rounded-sm p-4 py-10">
        <div className="grid items-stretch gap-0 md:grid-cols-[1.1fr_1fr]">
          <div
            className="mr-1 min-h-56 rounded-md bg-cover bg-center md:min-h-65"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80')",
            }}
          />

          <div className="mx-10 flex items-center">
            <div className="w-full space-y-4">
              <h3 className="heading-font text-2xl font-semibold">
                Join our Atelier Circle
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Receive early access to seasonal collections, artisan stories,
                and exclusive gift-giving guides directly from Tokyo.
              </p>

              <form className="flex flex-col gap-3">
                <input
                  className="focus-amber placeholder:text-text-muted w-full rounded-md border border-(--glass-border) bg-[rgba(20,19,21,0.9)] px-3 py-2.5 text-sm"
                  name="email"
                  placeholder="Your Email Address"
                  type="email"
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-secondary rounded-sm whitespace-nowrap"
                >
                  Subscribe to Joy
                </Button>
              </form>

              <p className="meta-font text-text-muted text-xs">
                By joining, you agree to our privacy policy and boutique terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
