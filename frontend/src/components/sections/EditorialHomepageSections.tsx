import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";
import { TextInView } from "@/src/components/motion/TextInView";
import { Button } from "@/src/components/ui/Button";

type EditorialTile = {
  title: string;
  description?: string;
  image: string;
  href?: string;
};

const moments: EditorialTile[] = [
  {
    title: "For Someone Special",
    image: "/homepage/woman-holding-gift-in-cafe.png",
  },
  {
    title: "Just Because",
    image: "/homepage/photo-woman-writing-notebook-desk.png",
  },
  {
    title: "Little Celebrations",
    image: "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
  },
];

const guides: EditorialTile[] = [
  {
    title: "Under RM50",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    href: "/products?maxPrice=50",
  },
  {
    title: "Under RM100",
    image: "/homepage/komorebi-stationery-fountain-pen.png",
    href: "/products?maxPrice=100",
  },
  {
    title: "Little Luxuries",
    image: "/homepage/white-plush-rabbit-on-shelf.png",
    href: "/products",
  },
];

const gallery = [
  ["/homepage/plush-toys-on-wooden-shelf.png", "Plush companions"],
  [
    "/homepage/photo-stationery-notebooks-quill-candle.png",
    "A note worth keeping",
  ],
  ["/homepage/lamp-on-desk-with-books-and-notebook.png", "Quiet corners"],
  ["/homepage/blue-maneki-neko-figurine-display-case.png", "Tiny treasures"],
  ["/homepage/opening-blue-gift-box.png", "The unwrapping"],
  [
    "/homepage/cozy-bookstore-interior-armchairs-lamp-books.png",
    "Tokyo shelves",
  ],
];

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
        <ImageWithFallback
          src="/homepage/cozy-bookstore-interior-armchairs-lamp-books.png"
          alt="Warm Japanese-inspired reading corner with wooden furniture"
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1400 hover:scale-[1.04]"
        />
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
            <p className="meta-font text-primary-soft text-xs tracking-[0.18em]">
              0{index + 1}
            </p>
            <h3 className="heading-font mt-4 text-lg font-medium">{title}</h3>
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
            <span className="absolute bottom-3 left-3 bg-black/65 px-2 py-1 text-[10px] tracking-wide text-white">
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
    <section className="padding-inline mt-32 pb-20 md:mt-36">
      <div className="relative min-h-100 overflow-hidden rounded-sm">
        <ImageWithFallback
          src="/homepage/woman-holding-gift-in-cafe.png"
          alt="A beautifully wrapped gift ready to be given"
          sizes="100vw"
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
