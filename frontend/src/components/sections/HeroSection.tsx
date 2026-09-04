import { Button } from "@/src/components/ui/Button";
import { AtelierBackdrop } from "../ui/BackgroundImage";
import { TextInView } from "../motion/TextInView";

export function HeroSection() {
  return (
    <section className="">
      <TextInView className="relative min-h-140 sm:aspect-video sm:min-h-0">
        <AtelierBackdrop videoSrc="/Komorebi_promotional_video_prod.mp4" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-r from-black/50 via-black/60 to-transparent" />

        <div className="padding-inline absolute inset-0 z-30 flex items-end pb-10 sm:items-center sm:pb-0">
          <div className="relative z-30 max-w-xl space-y-4 sm:space-y-5">
            <TextInView
              className="meta-font text-secondary border-secondary bg-secondary/15 inline-flex rounded-full border px-3 py-1 text-xs tracking-[0.12em]"
              delay={0.12}
            >
              <p>Tokyo's Curated Sanctuary</p>
            </TextInView>
            <TextInView delay={0.16}>
              <h1 className="title-font text-3xl leading-tight font-semibold sm:text-5xl">
                Curating Moments of Joy
              </h1>
            </TextInView>
            <TextInView
              className="text-text-muted text-sm leading-relaxed sm:text-base"
              delay={0.24}
            >
              <p
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
            </TextInView>
            <TextInView
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              delay={0.36}
            >
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
            </TextInView>
          </div>
        </div>
      </TextInView>
    </section>
  );
}
