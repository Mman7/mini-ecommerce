import { getRecommendedProducts, type Product } from "@/src/api/product.api";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { FavoriteButton } from "@/src/components/ui/FavoriteButton";
import { ImageWithFallback } from "../ui/ImageWithFallback";

export type SeasonalItem = {
  id: string;
  name: string;
  price: string;
  label: string;
  imageSrc: string;
};

type SeasonalCardProps = {
  product: SeasonalItem;
};

function SeasonalCard({ product }: SeasonalCardProps) {
  return (
    <article className="group relative aspect-square overflow-hidden">
      <section className="relative aspect-square w-full overflow-hidden rounded-sm">
        <ImageWithFallback
          src={product.imageSrc}
          alt={product.name}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="rounded-sm object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <button
          aria-label={`View ${product.name}`}
          className="bg-primary absolute bottom-4 left-1/2 z-20 -translate-x-1/2 translate-y-4 rounded-sm px-4 py-2 text-sm font-medium text-(--outline-strong) opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick Add
        </button>
      </section>

      <FavoriteButton productId={product.id} productName={product.name} />
      <div className="space-y-2 p-4 text-center">
        <div className="flex items-baseline justify-center gap-4">
          <h3 className="heading-font text-base leading-tight">
            {product.name}
          </h3>
          <p className="meta-font text-primary-soft text-sm font-semibold">
            {product.price}
          </p>
        </div>
        <p className="meta-font text-secondary mx-auto inline-flex items-center rounded-full border border-(--outline-strong) bg-[rgba(255,174,218,0.15)] px-2 py-0.5 text-[11px]">
          {product.label}
        </p>
      </div>
    </article>
  );
}

function SeasonalItemListSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading recommended products"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <article key={index} className="space-y-4" aria-hidden="true">
          <div className="aspect-square animate-pulse rounded-sm bg-gray-300" />
          <div className="space-y-2 px-4 text-center">
            <div className="mx-auto h-5 w-3/4 animate-pulse rounded-sm bg-gray-300" />
            <div className="mx-auto h-4 w-1/3 animate-pulse rounded-full bg-gray-300" />
          </div>
        </article>
      ))}
    </div>
  );
}

export async function SeasonalEditSection() {
  console.log("SeasonalEditSection started");

  let products: SeasonalItem[] = [];
  let error = false;

  try {
    console.log("Before getRecommendedProducts");

    const res = await getRecommendedProducts();

    if (!res || res.length === 0) {
      throw new Error("Failed to load recommendations");
    }

    const recommendedProducts = res as Product[];
    products = recommendedProducts.map(toSeasonalItem);

    console.log("Recommended products:", products);
  } catch (err) {
    console.error("SeasonalEditSection error:", err);
    error = true;
  }

  return (
    <section className="padding-inline mt-16 space-y-6">
      <SectionHeading title="The Seasonal Edit" />

      {error ? (
        <SeasonalItemListSkeleton />
      ) : products.length === 0 ? (
        <p className="text-text-muted text-sm">No recommended products yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <SeasonalCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function toSeasonalItem(product: Product): SeasonalItem {
  const image =
    product.productImages.find((productImage) => productImage.isThumbnail) ??
    product.productImages[0];

  return {
    id: String(product.productId),
    name: product.name,
    price: `$${product.price}`,
    label: "Recommended",
    imageSrc: normalizeImageUrl(image?.url),
  };
}

function normalizeImageUrl(url?: string): string {
  if (!url) return "";

  const normalizedUrl = url.replaceAll("\\", "/");
  const uploadsIndex = normalizedUrl.toLowerCase().lastIndexOf("/uploads/");

  return uploadsIndex >= 0 ? normalizedUrl.slice(uploadsIndex) : normalizedUrl;
}
