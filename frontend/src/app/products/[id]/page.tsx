import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { mockProducts } from "../../../lib/mock-products";
import type { Product } from "../../../types/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const galleryImages = [
  "/homepage/pink-plush-bunny.jpg",
  "/homepage/plush-toy-lineup.jpg",
  "/homepage/acrylic-figurines-display.jpg",
  "/homepage/gift-wrap-display.jpg",
];

const recommendationIds = [
  "totoro-velour",
  "neo-shogun-neko",
  "sakura-bunbun",
  "soot-sprite-fluff",
];

function yen(value: number) {
  return `¥${value.toLocaleString("en-US")}`;
}

const fallbackProduct: Product = {
  id: "mock-sakura-showcase",
  name: "Sakura Bun-Bun Showcase",
  price: 3200,
  image: "/homepage/acrylic-figurines-display.jpg",
  category: "Plush Toys",
  brand: "Harajuku Artisans",
  rating: 5,
  label: "Mock Item",
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product =
    mockProducts.find((item) => item.id === id) ??
    mockProducts[0] ??
    fallbackProduct;

  const picks = recommendationIds
    .map((pickId) => mockProducts.find((item) => item.id === pickId))
    .filter((item): item is (typeof mockProducts)[number] => Boolean(item))
    .filter((item) => item.id !== product.id);

  const fallbackPicks = mockProducts.filter(
    (item) =>
      item.id !== product.id && !picks.some((pick) => pick.id === item.id),
  );

  const completePicks = [...picks, ...fallbackPicks].slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-360 px-4 pt-28 pb-16 sm:px-6 lg:px-16">
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-4 lg:sticky lg:top-28">
            <div className="col-span-12 flex gap-3 overflow-x-auto pb-1 md:col-span-2 md:flex-col md:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`focus-amber h-18 w-18 shrink-0 overflow-hidden rounded-xl border transition-transform hover:scale-[1.03] ${
                    index === 0 ? "border-primary" : "border-(--glass-border)"
                  }`}
                  aria-label={`Preview image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt="Product thumbnail"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="col-span-12 md:col-span-10">
              <div className="shelf-surface bg-surface-2 relative aspect-4/5 overflow-hidden rounded-[1.6rem] border border-(--glass-border)">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="focus-amber text-primary-soft absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur-md"
                >
                  <Heart className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <span className="meta-font border-secondary/40 bg-secondary/15 text-secondary inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase">
            Collector&apos;s Edition
          </span>

          <h1 className="heading-font text-foreground mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="title-font text-primary-soft text-2xl font-semibold">
              {yen(product.price)}
            </p>
            <div className="text-primary-soft flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current opacity-70" />
              <span className="meta-font text-text-muted ml-1 text-xs">
                (48 Reviews)
              </span>
            </div>
          </div>

          <p className="text-text-muted mt-5 max-w-[54ch] text-[17px] leading-8">
            Inspired by the fleeting beauty of cherry blossoms in Tokyo&apos;s
            Ueno Park, this piece is hand-finished with premium high-density
            plush and delicate silk embroidery, bringing a quiet touch of magic
            to any shelf.
          </p>

          <div className="mt-8">
            <p className="meta-font text-foreground mb-3 text-sm font-semibold">
              Quantity
            </p>
            <div className="bg-surface-2 inline-flex h-11 w-34 items-center overflow-hidden rounded-xl border border-(--outline-strong)">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="focus-amber text-text-muted hover:bg-surface-3 inline-flex h-full w-11 items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="meta-font text-foreground inline-flex h-full flex-1 items-center justify-center text-sm font-semibold">
                1
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="focus-amber text-text-muted hover:bg-surface-3 inline-flex h-full w-11 items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="meta-font focus-amber bg-primary-soft inline-flex h-13 min-w-55 items-center justify-center gap-2 rounded-2xl px-8 text-[15px] font-bold text-(--primary-ink) shadow-[0_12px_32px_rgba(233,139,44,0.35)] transition hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Bag
            </button>
            <button
              type="button"
              className="meta-font focus-amber text-foreground hover:bg-surface-3 inline-flex h-13 min-w-35 items-center justify-center rounded-2xl border border-(--outline-strong) px-8 text-[15px] font-bold transition"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-surface-2 rounded-2xl border border-white/8 px-4 py-4">
              <Sparkles className="text-tertiary h-4 w-4" />
              <p className="meta-font text-foreground mt-2 text-sm font-semibold">
                Premium Silk
              </p>
              <p className="text-text-muted mt-1 text-xs">
                Sourced from Kanazawa
              </p>
            </div>
            <div className="bg-surface-2 rounded-2xl border border-white/8 px-4 py-4">
              <Leaf className="text-tertiary h-4 w-4" />
              <p className="meta-font text-foreground mt-2 text-sm font-semibold">
                Sustainable Fill
              </p>
              <p className="text-text-muted mt-1 text-xs">
                100% recycled cotton
              </p>
            </div>
          </div>

          <div className="mt-9 border-t border-white/10 pt-5">
            <details className="group border-b border-white/7 py-4" open>
              <summary className="heading-font text-foreground flex cursor-pointer list-none items-center justify-between text-[28px] leading-tight font-medium">
                Fabric &amp; Texture
                <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
              </summary>
              <p className="text-text-muted mt-3 max-w-[58ch] text-[15px] leading-7">
                Crafted from bespoke cloud-soft synthetic fur fibers mixed with
                organic Japanese silk and reinforced stitching for
                heirloom-level durability.
              </p>
            </details>

            <details className="group border-b border-white/7 py-4">
              <summary className="heading-font text-foreground flex cursor-pointer list-none items-center justify-between text-[28px] leading-tight font-medium">
                Dimensions &amp; Care
                <ChevronDown className="h-5 w-5 transition group-open:rotate-180" />
              </summary>
              <div className="text-text-muted mt-3 space-y-1 text-[15px] leading-7">
                <p>Height: 24cm (Sitting)</p>
                <p>Width: 18cm</p>
                <p>
                  Care: Surface clean with a damp cloth, then air dry away from
                  direct sunlight.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="mt-18">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="heading-font text-foreground text-4xl leading-tight font-semibold sm:text-5xl">
              You might also love
            </h2>
            <p className="text-text-muted mt-2">
              Curated companion pieces for your collection.
            </p>
          </div>
          <Link
            href="/products"
            className="meta-font group text-primary-soft inline-flex items-center gap-1.5 text-sm font-semibold"
          >
            Explore All
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {completePicks.map((item) => (
            <article
              key={item.id}
              className="group bg-surface-2 overflow-hidden rounded-2xl border border-white/8"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-4 py-4">
                <h3 className="heading-font text-foreground group-hover:text-primary-soft text-2xl leading-tight font-medium transition">
                  {item.name}
                </h3>
                <p className="title-font text-primary-soft mt-1.5 text-lg font-semibold">
                  {yen(item.price)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
