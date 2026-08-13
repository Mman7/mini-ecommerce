import { Button } from "@/src/components/ui/Button";
import { BackgroundImage } from "../ui/BackgroundImage";

export function HeroSection() {
  return (
    <section className="">
      <div className="reveal relative" style={{ paddingTop: "56.25%" }}>
        <BackgroundImage />
        {/* gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-r from-black/50 via-black/60 to-transparent" />

        <div className="padding-inline absolute inset-0 z-30 flex items-center">
          <div className="relative z-30 max-w-xl space-y-5">
            <p className="meta-font reveal text-secondary border-secondary bg-secondary/15 inline-flex rounded-full border px-3 py-1 text-xs tracking-[0.12em] delay-1">
              Tokyo's Curated Sanctuary
            </p>
            <h1 className="title-font reveal text-4xl leading-tight font-semibold delay-1 sm:text-5xl">
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
            <div className="reveal flex flex-wrap gap-3 delay-3">
              <Button
                href="/products"
                variant="primary"
                className="bg-primary-soft text-black!"
              >
                Shop Now
              </Button>
              <Button href="/products" variant="secondary">
                Explore Collections
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
