import { ArrowRight, Heart } from "lucide-react";
import { productApi, type Product } from "@/src/api/product.api";
import { FavoriteButton } from "@/src/components/ui/FavoriteButton";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";
import { TextInView } from "@/src/components/motion/TextInView";
import {
  DisplayProduct,
  fallbackProducts2,
} from "@/src/path/fallback_image_path";
import { DEFAULT_PRODUCT_IMAGE } from "@/src/path/product_image_path";

function toDisplayProduct(
  product: Product,
  index: number,
  fallbackProducts: DisplayProduct[],
): DisplayProduct {
  const image =
    product.productImages.find((item) => item.isThumbnail) ??
    product.productImages[0];
  const imageUrl = normalizeImageUrl(image?.url);
  return {
    slug: product.slug ?? `product-${index}`,
    id: String(product.productId ?? `product-${index}`),
    name: product.name,
    category: "From the atelier",
    price: `RM ${product.price.toFixed(2)}`,
    image: imageUrl || DEFAULT_PRODUCT_IMAGE,
    label: index === 0 ? "Recommended" : "Curated",
    isFallback: !imageUrl,
  };
}

function normalizeImageUrl(url?: string) {
  if (!url) return "";
  const normalized = url.replaceAll("\\", "/");
  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
  return uploadsIndex >= 0 ? normalized.slice(uploadsIndex) : normalized;
}

async function loadProducts(
  loader: () => Promise<Product[]>,
  fallbackSet = fallbackProducts2,
) {
  try {
    const products = await loader();
    return products.length
      ? products
          .slice(0, 4)
          .map((product, index) =>
            toDisplayProduct(product, index, fallbackSet),
          )
      : fallbackSet;
  } catch {
    return fallbackSet;
  }
}

function ProductTile({
  product,
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
          fallbackSrc={DEFAULT_PRODUCT_IMAGE}
          alt={product.name}
          sizes={
            large
              ? "(min-width: 768px) 50vw, 100vw"
              : "(min-width: 768px) 25vw, 50vw"
          }
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="meta-font text-primary-soft absolute top-3 left-3 bg-black/70 px-2 py-1 text-sm tracking-wide">
          {product.label}
        </span>
        <FavoriteButton productId={product.id} productName={product.name} />
      </div>
      <div className="space-y-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="heading-font truncate text-base font-medium">
            {product.name}
          </h3>
          {!product.isFallback && (
            <span className="meta-font text-primary-soft shrink-0 text-sm">
              {product.price}
            </span>
          )}
        </div>
        <p className="meta-font text-text-muted text-[11px] tracking-wide uppercase">
          {product.category}
        </p>
      </div>
    </article>
  );
}

export async function KomorebiEditSection() {
  // TODO get recommended products from API or context if needed
  const products = await loadProducts(
    () => productApi.recommended(4),
    fallbackProducts2,
  );
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
          <TextInView key={product.id} delay={index * 0.1}>
            <ProductTile key={product.id} product={product} index={index} />
          </TextInView>
        ))}
      </div>
    </section>
  );
}

export async function NewArrivalsSection() {
  const products = await loadProducts(async () => {
    const response = await productApi.list({
      page: 1,
      limit: 4,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    return response.items;
  }, fallbackProducts2);
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <TextInView key={product.id} delay={index * 0.1}>
            <ProductTile product={product} index={index} />
          </TextInView>
        ))}
      </div>
      <div className="sr-only">
        <Heart aria-hidden="true" />
      </div>
    </section>
  );
}
