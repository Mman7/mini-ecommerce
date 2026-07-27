import { Button } from "@/src/components/ui/Button";
import { BackgroundImage } from "../ui/BackgroundImage";

export function HeroSection() {
  return (
    <section className="">
      <div className="reveal relative" style={{ paddingTop: "56.25%" }}>
        <BackgroundImage />
        {/* gradient linear */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/40 to-transparent" />

        <div className="padding-inline absolute inset-0 z-20 flex items-center">
          <div className="relative max-w-xl space-y-5">
            <p className="meta-font reveal text-secondary inline-flex rounded-full border border-(--outline-strong) bg-[rgba(255,174,218,0.14)] px-3 py-1 text-xs tracking-[0.12em] delay-1">
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
                href="#"
                variant="primary"
                className="bg-primary-soft text-black!"
              >
                Shop Now
              </Button>
              <Button href="#" variant="secondary">
                Explore Collections
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
