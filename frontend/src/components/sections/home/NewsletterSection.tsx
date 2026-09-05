import { Button } from "@/src/components/ui/Button";
import Image from "next/image";
export function NewsletterSection() {
  return (
    <section className="padding-inline">
      <div className="bg-surface-3 mt-16 overflow-hidden rounded-sm p-4 px-12 py-10">
        <div className="grid items-stretch gap-12 md:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-56 overflow-hidden rounded-sm md:min-h-65">
            <Image
              className="object-cover object-center"
              src="/Shared/Atelier.jpg"
              alt="Atelier"
              fill
              sizes="(min-width: 768px) 60vw, 120vw"
            />
          </div>

          <div className="flex items-center">
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
