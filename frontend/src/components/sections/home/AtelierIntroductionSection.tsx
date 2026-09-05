import { Button } from "@/src/components/ui/Button";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";
import Image from "next/image";
import { TextInView } from "@/src/components/motion/TextInView";

export function AtelierIntroductionSection() {
  return (
    <section className="bg-surface-1 padding-inline mt-28 py-12 md:mt-36 md:py-16">
      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div className="bg-surface-2 relative aspect-4/5 overflow-hidden rounded-sm md:aspect-4/3">
          <Image
            src="/homepage/opening-blue-gift-box.png"
            alt="A warmly arranged Komorebi gift atelier"
            sizes="(min-width: 768px) 55vw, 100vw"
            fill
            className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
          />
        </div>
        <div className="max-w-md space-y-5">
          <TextInView delay={0.1}>
            <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
              The Komorebi way
            </p>
          </TextInView>
          <TextInView delay={0.2}>
            <h2 className="title-font text-3xl leading-tight font-semibold sm:text-4xl">
              The Art of Gifting
            </h2>
          </TextInView>
          <TextInView delay={0.3}>
            <p className="text-text-muted text-sm leading-7 sm:text-base">
              We carefully curate small objects with generous character, so an
              ordinary moment can arrive feeling wonderfully considered. Each
              piece belongs to a slower, warmer way of giving.
            </p>
          </TextInView>
          <TextInView delay={0.4}>
            <Button
              href="/about"
              variant="secondary"
              className="bg-surface-2 rounded-sm border-(--outline-strong)"
            >
              Discover Our Story
            </Button>
          </TextInView>
        </div>
      </div>
    </section>
  );
}
