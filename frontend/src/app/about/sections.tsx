"use client";

import { ArrowUpRight, CheckCircle2, Gift, Gem, Handshake } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";
import { TextInView } from "@/src/components/motion/TextInView";
import { Button } from "@/src/components/ui/Button";

const categories = [
  {
    title: "Luxury Plush",
    description: "Soft companions with a little story to tell.",
    image: "/homepage/plush-toys-on-wooden-shelf.png",
  },
  {
    title: "Stationery Stories",
    description: "Beautiful tools for notes, lists, and daydreams.",
    image: "/homepage/photo-stationery-notebooks-quill-candle.png",
  },
  {
    title: "Designer Trinkets",
    description: "Tiny keepsakes that make a shelf feel like yours.",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
  },
  {
    title: "Atelier Gift Sets",
    description: "Thoughtful pairings, ready for the best kind of reveal.",
    image: "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
  },
];

const principles = [
  [
    "01",
    "Curated with intention",
    "Every object has a lineage, an artisan's mark, and a reason to exist. We never stock mass factory surplus; we collaborate directly with multi-generational workshops in Kyoto, Kanazawa, and Asakusa.",
  ],
  [
    "02",
    "Made to be cherished",
    "Created to outlive trends — timeless keepsakes designed to age gracefully alongside you. Materials like vegetable-tanned leather, heavy linen, and natural stoneware deepen in beauty over years.",
  ],
  [
    "03",
    "Given with joy",
    "Honoring the ritual of Japanese gift-giving where the wrapping is as meaningful as what lies inside. The anticipation of untying a furoshiki knot is an essential part of the emotional journey.",
  ],
];

const gallery = [
  [
    "/homepage/cozy-bookstore-interior-armchairs-lamp-books.png",
    "A quiet corner",
  ],
  [
    "/homepage/black-two-tailed-cat-plush-display-case.png",
    "Curious companions",
  ],
  ["/homepage/opening-blue-gift-box.png", "The little reveal"],
  ["/homepage/lamp-on-desk-with-books-and-notebook.png", "Slow afternoon"],
  [
    "/homepage/blue-and-gold-mythical-creature-plush-toy-wooden-shelf.png",
    "A touch of magic",
  ],
];

function Eyebrow({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: "amber" | "cyan";
}) {
  return (
    <p
      className={`meta-font text-sm tracking-[0.22em] uppercase ${tone === "cyan" ? "text-tertiary" : "text-primary-soft"}`}
    >
      {children}
    </p>
  );
}

function StoryImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface-2 relative overflow-hidden rounded-sm ${className}`}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 hover:scale-[1.03]"
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-145 overflow-hidden rounded-sm sm:h-170"
      >
        <ImageWithFallback
          src="/homepage/komorebi-gift-atelier-store-display.png"
          alt="A warmly arranged Komorebi gift atelier"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/5" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="absolute inset-x-6 bottom-8 max-w-xl sm:inset-x-12 sm:bottom-12"
        >
          <Eyebrow>The Komorebi Atelier</Eyebrow>
          <h1 className="title-font mt-4 max-w-lg text-4xl leading-[1.08] font-semibold sm:text-6xl">
            Our Little Corner of Tokyo
          </h1>
          <p className="text-text-muted mt-5 max-w-sm text-base leading-7 sm:text-lg">
            A sanctuary for little things worth keeping.
          </p>
          <Button href="/products" className="mt-7 rounded-sm">
            Explore the Collection <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="padding-inline mt-28 grid items-center gap-10 md:mt-40 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
      <TextInView className="aspect-4/5">
        <StoryImage
          src="/homepage/woman-holding-gift-in-cafe.png"
          alt="A carefully chosen gift held in a warm cafe"
          className="size-full"
        />
      </TextInView>
      <div className="max-w-lg space-y-5">
        <TextInView>
          <Eyebrow>Our story</Eyebrow>
        </TextInView>
        <TextInView delay={0.08}>
          <h2 className="title-font text-3xl leading-tight font-semibold sm:text-5xl">
            A Story Told Through Little Things
          </h2>
        </TextInView>
        <TextInView delay={0.16}>
          <p className="text-text-muted text-sm leading-7 sm:text-base">
            In the historic lanes of Tokyo’s Yanaka district, time behaves
            differently. Wood smoke mingles with the aroma of roasted hojicha
            tea, and small neighborhood workshops preserve centuries of quiet
            patience. It was here that Komorebi was born—from a profound
            reverence for <em>omiyage</em>, the Japanese art of returning with
            meaningful tokens for loved ones.
          </p>
        </TextInView>
        <TextInView delay={0.24}>
          <p className="text-text-muted text-sm leading-7 sm:text-base">
            We believe that modern life often moves too quickly past the things
            that evoke tenderness. An artisanal hand-stitched bunny made with
            bouclé wool, a heavy washi-bound sketchbook flecked with gold leaf,
            a hand-painted ceramic maneki-neko that sits vigil upon your desk.
            These are not mere objects. They are gentle anchors in an
            overwhelming world.
          </p>
        </TextInView>
        <TextInView delay={0.32}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--outline-strong) pt-4">
            <span className="meta-font text-text-muted inline-flex items-center gap-2 text-xs">
              <span className="bg-primary-soft size-1.5 rounded-full" />
              Est. 2021 · Kyoto &amp; Tokyo
            </span>
            <span className="meta-font text-tertiary text-xs">
              100% Artisan Provenance
            </span>
          </div>
        </TextInView>
      </div>
    </section>
  );
}

export function KomorebiSection() {
  return (
    <section className="relative mt-32 min-h-130 overflow-hidden py-20 md:mt-44">
      <motion.div
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        <ImageWithFallback
          src="/homepage/cozy-bookstore-interior-armchairs-lamp-books.png"
          alt="Warm sunlight and quiet shelves in a Tokyo-inspired interior"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>
      <div className="relative flex min-h-130 items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <TextInView>
            <span className="meta-font bg-surface-3 text-primary-soft inline-flex items-center gap-2 rounded-full border border-(--outline-strong) px-4 py-2 text-xs tracking-[0.14em] uppercase">
              木漏れ日 <span className="text-text-muted">•</span> Komorebi
            </span>
          </TextInView>
          <TextInView delay={0.1}>
            <h2 className="display-font mt-5 text-4xl leading-tight sm:text-6xl">
              The Beauty Found Between Ordinary Moments
            </h2>
          </TextInView>
          <TextInView delay={0.2}>
            <p className="text-primary-soft mx-auto mt-6 max-w-xl text-base leading-8 italic sm:text-lg">
              “Japanese sunlight filtering through leaves and branches — finding
              quiet wonder in the spaces where warmth meets shadow.”
            </p>
          </TextInView>
          <TextInView delay={0.3}>
            <p className="text-text-muted mx-auto mt-7 max-w-xl text-sm leading-7 sm:text-base">
              This single, untranslatable concept guides every selection in our
              atelier. Just as komorebi cannot be captured or held, true joy
              lives in fleeting tactile experiences: unwrapping crisp handmade
              paper, turning the creamy page of an archival journal, or wrapping
              cold hands around a hand-thrown ceramic cup.
            </p>
          </TextInView>
        </div>
      </div>
    </section>
  );
}

export function CuratedWorldSection() {
  return (
    <section className="padding-inline mt-32 md:mt-44">
      <div className="mb-9 max-w-xl">
        <TextInView>
          <Eyebrow>Our curated world</Eyebrow>
        </TextInView>
        <TextInView delay={0.08}>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-5xl">
            A little something for every kind of wonderful.
          </h2>
        </TextInView>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category, index) => (
          <TextInView
            key={category.title}
            delay={index * 0.07}
            className="group bg-surface-2 relative min-h-90 overflow-hidden rounded-sm"
          >
            <ImageWithFallback
              src={category.image}
              alt={category.title}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-transparent" />
            <div className="absolute inset-x-6 bottom-6">
              <h3 className="heading-font text-2xl font-medium">
                {category.title}
              </h3>
              <p className="text-text-muted mt-2 max-w-xs text-sm leading-6">
                {category.description}
              </p>
              <a
                href="/products"
                className="meta-font text-primary-soft mt-4 inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase"
              >
                Discover{" "}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </TextInView>
        ))}
      </div>
    </section>
  );
}

export function PhilosophySection() {
  return (
    <section className="padding-inline mt-32 md:mt-44">
      <div className="mb-16 text-center">
        <TextInView>
          <Eyebrow>Our guiding principles</Eyebrow>
        </TextInView>
        <TextInView delay={0.08}>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-5xl">
            The Atelier Philosophy
          </h2>
        </TextInView>
        <TextInView delay={0.16}>
          <p className="text-text-muted mx-auto mt-4 max-w-2xl text-sm sm:text-base">
            Every creation we embrace enters through three intentional
            thresholds.
          </p>
        </TextInView>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {principles.map(([number, title, copy], index) => (
          <TextInView
            key={number}
            delay={index * 0.1}
            className="bg-surface-2 min-h-104 rounded-sm border p-9 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-10"
          >
            <p className="display-font bg-surface-3 text-primary-soft inline-flex size-14 items-center justify-center rounded-sm border text-2xl">
              {number}
            </p>
            <h3 className="heading-font mt-9 text-xl leading-tight font-medium uppercase">
              {title}
            </h3>
            <p className="text-text-muted mt-5 text-sm leading-7">{copy}</p>
          </TextInView>
        ))}
      </div>
    </section>
  );
}

export function PackagingSection() {
  return (
    <section className="padding-inline mt-32 md:mt-44">
      <div className="relative min-h-105 overflow-hidden rounded-sm border border-(--outline-strong) bg-black sm:min-h-110">
        <TextInView className="absolute inset-0">
          <StoryImage
            src="/homepage/komorebi-gift-atelier-wrapped-boxes.png"
            alt="Thoughtfully wrapped gifts prepared at the atelier"
            className="size-full rounded-none"
          />
        </TextInView>
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/65 to-black/25" />
        <div className="relative flex min-h-105 items-center px-6 py-14 sm:min-h-110 sm:px-12 md:px-16">
          <div className="max-w-xl space-y-5">
            <TextInView>
              <Eyebrow>Crafted packaging</Eyebrow>
            </TextInView>
            <TextInView delay={0.08}>
              <h2 className="title-font text-3xl font-semibold sm:text-5xl">
                From Tokyo, With Intention
              </h2>
            </TextInView>
            <TextInView delay={0.16}>
              <p className="text-text-muted max-w-lg text-sm leading-7 sm:text-base">
                Thoughtful pieces selected with care, hand-inspected in our
                Yanaka studio and packaged using traditional techniques. Each
                package receives a bespoke wax seal and a sprig of seasonal
                cypress or dried lavender.
              </p>
            </TextInView>
            <TextInView
              delay={0.24}
              className="flex flex-wrap gap-x-7 gap-y-3 pt-5"
            >
              <span className="meta-font text-foreground inline-flex items-center gap-2 text-xs">
                <CheckCircle2 className="text-primary-soft size-4" />
                Furoshiki Linen Cloth
              </span>
              <span className="meta-font text-foreground inline-flex items-center gap-2 text-xs">
                <CheckCircle2 className="text-primary-soft size-4" />
                Custom Wax Imprint
              </span>
            </TextInView>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FounderSection() {
  return (
    <section className="padding-inline mt-32 grid items-center gap-10 md:mt-44 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
      <TextInView className="aspect-4/5">
        <StoryImage
          src="/homepage/lamp-on-desk-with-books-and-notebook.png"
          alt="A calm atelier desk with books and stationery"
          className="size-full"
        />
      </TextInView>
      <div className="max-w-lg space-y-5">
        <TextInView>
          <Eyebrow>The hand behind the atelier</Eyebrow>
        </TextInView>
        <TextInView delay={0.08}>
          <h2 className="title-font text-3xl leading-tight font-semibold sm:text-5xl">
            Thoughtful objects deserve thoughtful stories.
          </h2>
        </TextInView>
        <TextInView delay={0.16}>
          <p className="text-text-muted text-sm leading-7 sm:text-base">
            “I spent my childhood exploring flea markets along the Kamo River in
            Kyoto and tracing the tiny toy alleyways of Asakusa. What struck me
            was never the extravagance of the items, but how deeply they were
            loved. A cracked cup repaired with lacquer and real gold powder
            (kintsugi) was celebrated not despite its scars, but because of
            them.”
          </p>
        </TextInView>
        <TextInView delay={0.24}>
          <p className="text-text-muted text-sm leading-7 sm:text-base">
            When you order from Komorebi, you are connecting directly with
            independent ceramicists, third-generation textile weavers, and
            whimsical toy sculptors who pour their spirit into each piece. We
            personally visit every partner atelier twice a year to ensure our
            shared commitment to sustainable materials and fair remuneration.
          </p>
        </TextInView>
        <TextInView delay={0.32} className="flex items-center gap-4 pt-2">
          <span className="bg-surface-3 text-primary-soft inline-flex size-12 items-center justify-center rounded-full border border-(--outline-strong) font-serif text-lg">
            K
          </span>
          <span>
            <strong className="heading-font block text-base font-medium">
              Kaori Takahashi
            </strong>
            <span className="meta-font text-primary-soft text-xs">
              Founder &amp; Principal Curator
            </span>
          </span>
        </TextInView>
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section className="padding-inline mt-32 md:mt-44">
      <div className="mb-9">
        <TextInView>
          <Eyebrow>From the atelier</Eyebrow>
        </TextInView>
        <TextInView delay={0.08}>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-5xl">
            Little moments, collected.
          </h2>
        </TextInView>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {gallery.map(([image, label], index) => (
          <TextInView
            key={image}
            delay={index * 0.06}
            className={`group relative overflow-hidden rounded-sm ${index === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}
          >
            <ImageWithFallback
              src={image}
              alt={label}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
            <span className="meta-font absolute bottom-3 left-3 bg-black/75 px-2 py-1 text-xs tracking-wide text-white md:text-sm">
              {label}
            </span>
          </TextInView>
        ))}
      </div>
    </section>
  );
}

export function CommitmentSection() {
  const commitments = [
    [
      Handshake,
      "Thoughtfully Curated",
      "We form lasting, ethical relationships with generational studios across Japan, bringing you genuine pieces steeped in tradition and modern joy.",
    ],
    [
      Gem,
      "Quality First",
      "From natural French-Japanese blended linen and archival fountain pen paper to lead-free heirloom ceramics, we choose permanence.",
    ],
    [
      Gift,
      "Beautifully Gifted",
      "Every parcel leaves our atelier wrapped as artwork. Reusable cloth, botanical wax seals, and handwritten tags make the reveal part of the gift.",
    ],
  ] as const;

  return (
    <section className="padding-inline mt-32 md:mt-44">
      <div className="py-4 text-center sm:py-8">
        <TextInView>
          <Eyebrow>Commitment to quality</Eyebrow>
        </TextInView>
        <TextInView delay={0.08}>
          <h2 className="title-font mt-4 text-3xl font-semibold sm:text-5xl">
            Small Things. Meaningful Moments.
          </h2>
        </TextInView>
        <div className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {commitments.map(([Icon, title, copy], index) => (
            <TextInView
              key={title}
              delay={0.15 + index * 0.08}
              className="bg-surface-2 min-h-76 rounded-sm border px-6 py-9 shadow-[0_16px_40px_rgba(0,0,0,0.16)] sm:px-8 sm:py-10"
            >
              <span className="bg-surface-3 inline-flex size-14 items-center justify-center rounded-full border">
                <Icon className="text-primary-soft size-5" strokeWidth={1.6} />
              </span>
              <h3 className="heading-font mt-8 text-xl font-medium">{title}</h3>
              <p className="text-text-muted mt-4 text-sm leading-6">{copy}</p>
            </TextInView>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CollectionCtaSection() {
  return (
    <section className="mt-32 md:mt-44">
      <div className="bg-surface-2 relative min-h-110 overflow-hidden rounded-sm py-30">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/homepage/opening-blue-gift-box.png"
            alt="A blue gift box ready to reveal a small joy"
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-12">
          <div className="max-w-lg space-y-5">
            <TextInView>
              <Eyebrow>Find your little joy</Eyebrow>
            </TextInView>
            <TextInView delay={0.1}>
              <h2 className="title-font text-3xl font-semibold sm:text-5xl">
                Discover something worth keeping.
              </h2>
            </TextInView>
            <TextInView delay={0.2}>
              <p className="text-text-muted text-sm leading-7 sm:text-base">
                A small treasure, chosen with care, is waiting somewhere in the
                atelier.
              </p>
            </TextInView>
            <TextInView delay={0.3}>
              <Button href="/products" className="rounded-sm">
                Explore the Collection <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </TextInView>
          </div>
        </div>
      </div>
    </section>
  );
}
