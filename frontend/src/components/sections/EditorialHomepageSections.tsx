import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";
import { TextInView } from "@/src/components/motion/TextInView";
import { Button } from "@/src/components/ui/Button";
import { moments, guides, EditorialTile, gallery } from "@/src/path/Image_path";

function ImageTile({ item, index }: { item: EditorialTile; index: number }) {
  return (
    <a
      href={item.href ?? "/products"}
      className="group bg-surface-2 relative block min-h-90 overflow-hidden rounded-sm"
    >
      <ImageWithFallback
        src={item.image}
        alt={item.title}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ objectPosition: index === 1 ? "center" : "center" }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-3">
        <TextInView delay={0.2}>
          <h3 className="heading-font text-xl font-medium text-white">
            {item.title}
          </h3>
        </TextInView>
        <ArrowUpRight className="text-primary-soft size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </a>
  );
}

export function GiftMomentsSection() {
  return (
    <section className="padding-inline mt-28 md:mt-36">
      <div className="mb-8 max-w-xl">
        <TextInView delay={0.1}>
          <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
            Shop by feeling
          </p>
        </TextInView>
        <TextInView delay={0.2}>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-4xl">
            Find a Gift for Every Moment
          </h2>
        </TextInView>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {moments.map((item, index) => (
          <ImageTile key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export function AtelierPhilosophySection() {
  return (
    <section className="mt-32 overflow-hidden">
      <div className="relative min-h-130 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-center"
        >
          <source src="/Komorebi_promotional_video_prod.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-transparent" />
        <div className="padding-inline absolute inset-0 flex items-end pb-14 md:pb-20">
          <div className="max-w-lg space-y-4">
            <TextInView delay={0.1}>
              <p className="meta-font text-tertiary text-xs tracking-[0.2em] uppercase">
                Our philosophy
              </p>
            </TextInView>
            <TextInView delay={0.2}>
              <h2 className="title-font text-4xl leading-tight font-semibold sm:text-6xl">
                Small objects. Beautiful moments.
              </h2>
            </TextInView>
            <TextInView delay={0.3}>
              <a
                href="/about"
                className="meta-font text-primary-soft inline-flex items-center gap-2 text-sm"
              >
                Our Philosophy <ArrowUpRight className="size-4" />
              </a>
            </TextInView>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TokyoBoutiqueStorySection() {
  const rows = [
    {
      eyebrow: "Tokyo inspiration",
      title: "A little city magic",
      copy: "From neighborhood stationery stores to quiet shelves of keepsakes, Komorebi follows the details that make Tokyo feel personal.",
      image: "/homepage/lamp-on-desk-with-books-and-notebook.png",
    },
    {
      eyebrow: "The atelier",
      title: "Chosen with feeling",
      copy: "Every object is selected for its texture, charm, and ability to make an everyday ritual feel newly yours.",
      image: "/homepage/photo-stationery-notebooks-quill-candle.png",
    },
  ];
  return (
    <section className="padding-inline mt-32 space-y-20 md:mt-36">
      {rows.map((row, index) => (
        <div
          key={row.title}
          className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${index % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
        >
          <div className="bg-surface-2 relative aspect-3/2 overflow-hidden rounded-sm">
            <ImageWithFallback
              src={row.image}
              alt={row.title}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
          <div className="max-w-md space-y-4">
            <TextInView delay={0.1}>
              <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
                {row.eyebrow}
              </p>
            </TextInView>
            <TextInView delay={0.2}>
              <h2 className="title-font text-3xl font-semibold sm:text-4xl">
                {row.title}
              </h2>
            </TextInView>
            <TextInView delay={0.3}>
              <p className="text-text-muted text-sm leading-7 sm:text-base">
                {row.copy}
              </p>
            </TextInView>
            <TextInView delay={0.4}>
              <a
                href="/about"
                className="meta-font text-primary-soft inline-flex items-center gap-2 text-sm"
              >
                Explore Our Story <ArrowUpRight className="size-4" />
              </a>
            </TextInView>
          </div>
        </div>
      ))}
    </section>
  );
}

const values = [
  ["Thoughtfully Curated", "Every piece is selected for character."],
  ["Beautifully Packaged", "Gifts arrive ready for the moment."],
  ["Tokyo-Inspired", "Inspired by Japanese boutique culture."],
  ["Made for Joy", "Small objects with lasting charm."],
];

export function WhyShopSection() {
  return (
    <section className="padding-inline mt-32 md:mt-36">
      <div className="grid border-y border-(--outline-strong) md:grid-cols-4">
        {values.map(([title, copy], index) => (
          <TextInView
            key={title}
            className="border-b border-(--outline-strong) py-7 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            delay={index * 0.08}
          >
            <p className="meta-font text-primary-soft text-sm tracking-[0.18em]">
              0{index + 1}
            </p>
            <h3 className="heading-font mt-4 text-xl font-medium">{title}</h3>
            <p className="text-text-muted mt-2 text-sm leading-6">{copy}</p>
          </TextInView>
        ))}
      </div>
    </section>
  );
}

export function GiftGuideSection() {
  return (
    <section className="padding-inline mt-32 md:mt-36">
      <div className="mb-8">
        <TextInView delay={0.1}>
          <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
            A thoughtful starting point
          </p>
        </TextInView>
        <TextInView delay={0.2}>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-4xl">
            Not Sure What to Gift?
          </h2>
        </TextInView>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map((item, index) => (
          <ImageTile key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export function VisualGallerySection() {
  return (
    <section className="padding-inline mt-32 md:mt-36">
      <div className="mb-8">
        <TextInView delay={0.1}>
          <p className="meta-font text-tertiary text-xs tracking-[0.2em] uppercase">
            From the atelier
          </p>
        </TextInView>
        <TextInView delay={0.2}>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-4xl">
            Little moments, collected
          </h2>
        </TextInView>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {gallery.map(([image, label], index) => (
          <TextInView
            key={image}
            className={`${index === 0 ? "col-span-2 row-span-2" : ""} group bg-surface-2 relative aspect-square overflow-hidden rounded-sm ${index === 0 ? "md:aspect-auto" : ""}`}
            delay={index * 0.06}
          >
            <ImageWithFallback
              src={image}
              alt={label}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="text-small absolute bottom-3 left-3 bg-black/75 px-2 py-1 tracking-wide text-white">
              {label}
            </span>
          </TextInView>
        ))}
      </div>
    </section>
  );
}

export function FinalCtaSection() {
  return (
    <section className="mt-32 md:mt-36">
      <div className="relative h-120 overflow-hidden rounded-sm">
        <ImageWithFallback
          src="/homepage/komorebi-gift-atelier-store-display.png"
          alt="A beautifully wrapped gift ready to be given"
          fill
          className="object-cover object-center transition-transform duration-1400 hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="max-w-xl space-y-5">
            <TextInView delay={0.1}>
              <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
                Your next little treasure
              </p>
            </TextInView>
            <TextInView delay={0.2}>
              <h2 className="title-font text-3xl font-semibold sm:text-5xl">
                Ready to Find Something Special?
              </h2>
            </TextInView>
            <TextInView delay={0.3}>
              <p className="text-text-muted">
                Discover little treasures curated with care.
              </p>
            </TextInView>
            <TextInView delay={0.4}>
              <Button href="/products" variant="primary" className="rounded-sm">
                Explore the Atelier
              </Button>
            </TextInView>
          </div>
        </div>
      </div>
    </section>
  );
}
