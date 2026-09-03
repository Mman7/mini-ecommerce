import { ArrowRight, Heart } from "lucide-react";
import {
  getProducts,
  getRecommendedProducts,
  type Product,
} from "@/src/api/product.api";
import { FavoriteButton } from "@/src/components/ui/FavoriteButton";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";
import { TextInView } from "@/src/components/motion/TextInView";

type DisplayProduct = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  label: string;
};

const fallbackProducts: DisplayProduct[] = [
  {
    id: "atelier-plush",
    name: "Velvet Bunny Companion",
    category: "Luxury Plush",
    price: "RM 68.00",
    image: "/homepage/white-plush-rabbit-on-shelf.png",
    label: "New",
  },
  {
    id: "atelier-journal",
    name: "Floral Daybook",
    category: "Stationery Stories",
    price: "RM 42.00",
    image: "/homepage/komorebi-stationery-fountain-pen.png",
    label: "Curated",
  },
  {
    id: "atelier-charm",
    name: "Lucky Cat Trinket",
    category: "Designer Trinkets",
    price: "RM 36.00",
    image: "/homepage/blue-maneki-neko-figurine-display-case.png",
    label: "Limited",
  },
  {
    id: "atelier-gift",
    name: "A Quiet Celebration",
    category: "Atelier Gift Sets",
    price: "RM 118.00",
    image: "/homepage/komorebi-gift-atelier-wrapped-boxes.png",
    label: "Gift Set",
  },
];

function toDisplayProduct(product: Product, index: number): DisplayProduct {
  const image =
    product.productImages.find((item) => item.isThumbnail) ??
    product.productImages[0];
  return {
    id: String(product.productId ?? `product-${index}`),
    name: product.name,
    category: "From the atelier",
    price: `RM ${product.price.toFixed(2)}`,
    image:
      normalizeImageUrl(image?.url) ||
      fallbackProducts[index % fallbackProducts.length].image,
    label: index === 0 ? "Recommended" : "Curated",
  };
}

function normalizeImageUrl(url?: string) {
  if (!url) return "";
  const normalized = url.replaceAll("\\", "/");
  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
  return uploadsIndex >= 0 ? normalized.slice(uploadsIndex) : normalized;
}

async function loadProducts(loader: () => Promise<Product[]>) {
  try {
    const products = await loader();
    return products.length
      ? products.slice(0, 4).map(toDisplayProduct)
      : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

function ProductTile({
  product,
  index,
  large = false,
}: {
  product: DisplayProduct;
  index: number;
  large?: boolean;
}) {
  return (
    <article className={`group relative ${large ? "md:row-span-2" : ""}`}>
      <div className="bg-surface-2 relative aspect-square overflow-hidden rounded-sm">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          sizes={
            large
              ? "(min-width: 768px) 50vw, 100vw"
              : "(min-width: 768px) 25vw, 50vw"
          }
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="meta-font text-primary-soft absolute top-3 left-3 bg-black/70 px-2 py-1 text-[10px] tracking-wide">
          {product.label}
        </span>
        <FavoriteButton productId={product.id} productName={product.name} />
        <button
          type="button"
          className="meta-font bg-primary-soft absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 px-4 py-2 text-xs font-semibold text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick Add
        </button>
      </div>
      <div className="space-y-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="heading-font text-base font-medium">{product.name}</h3>
          <span className="meta-font text-primary-soft shrink-0 text-sm">
            {product.price}
          </span>
        </div>
        <p className="meta-font text-text-muted text-[11px] tracking-wide uppercase">
          {product.category}
        </p>
      </div>
    </article>
  );
}

export async function KomorebiEditSection() {
  const products = await loadProducts(() => getRecommendedProducts(4));
  return (
    <section className="padding-inline mt-28 md:mt-36">
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
            A small selection
          </p>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-4xl">
            The Komorebi Edit
          </h2>
        </div>
        <a
          href="/products"
          className="meta-font text-primary-soft hidden items-center gap-2 text-xs sm:flex"
        >
          View All <ArrowRight className="size-4" />
        </a>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductTile key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

export async function NewArrivalsSection() {
  const products = await loadProducts(() => getProducts({ page: 1, limit: 4 }));
  return (
    <section className="padding-inline mt-28 md:mt-36">
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="meta-font text-tertiary text-xs tracking-[0.2em] uppercase">
            Fresh from the atelier
          </p>
          <h2 className="title-font mt-3 text-3xl font-semibold sm:text-4xl">
            New Arrivals
          </h2>
          <p className="text-text-muted mt-2 text-sm">
            New arrivals, freshly curated.
          </p>
        </div>
        <a
          href="/products"
          className="meta-font text-primary-soft hidden items-center gap-2 text-xs sm:flex"
        >
          View All <ArrowRight className="size-4" />
        </a>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <TextInView className="md:row-span-2" delay={0}>
          <ProductTile product={products[0]} index={0} large />
        </TextInView>
        <TextInView delay={0.1}>
          <ProductTile product={products[1]} index={1} />
        </TextInView>
        <TextInView delay={0.2}>
          <ProductTile product={products[2]} index={2} />
        </TextInView>
      </div>
      <div className="sr-only">
        <Heart aria-hidden="true" />
      </div>
    </section>
  );
}
