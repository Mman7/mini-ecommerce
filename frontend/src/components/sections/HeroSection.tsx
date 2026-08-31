import { Button } from "@/src/components/ui/Button";
import { BackgroundImage } from "../ui/BackgroundImage";

export function HeroSection() {
  return (
    <section className="">
      <div className="reveal relative min-h-140 sm:aspect-video sm:min-h-0">
        <BackgroundImage />
        {/* gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-r from-black/50 via-black/60 to-transparent" />

        <div className="padding-inline absolute inset-0 z-30 flex items-end pb-10 sm:items-center sm:pb-0">
          <div className="relative z-30 max-w-xl space-y-4 sm:space-y-5">
            <p className="meta-font reveal text-secondary border-secondary bg-secondary/15 inline-flex rounded-full border px-3 py-1 text-xs tracking-[0.12em] delay-1">
              Tokyo's Curated Sanctuary
            </p>
            <h1 className="title-font reveal text-3xl leading-tight font-semibold delay-1 sm:text-5xl">
              Curating Moments of Joy
            </h1>
            <p
              className="reveal text-text-muted text-sm leading-relaxed delay-2 sm:text-base"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              Discover an exquisite collection of luxury plushies, handcrafted
              stationery, and artisanal treasures from the heart of Tokyo's
              boutique culture.
            </p>
            <div className="reveal flex flex-col gap-3 delay-3 sm:flex-row sm:flex-wrap">
              <Button
                href="/products"
                variant="primary"
                className="bg-primary-soft w-full text-black! sm:w-auto"
              >
                Shop Now
              </Button>
              <Button
                href="/products"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Explore Collections
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
