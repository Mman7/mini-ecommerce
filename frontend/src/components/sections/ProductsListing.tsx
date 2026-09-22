import Link from "next/link";
import type { ProductListResponse } from "../../api/product.api";
import ProductGrid from "./ProductGrid";
import SortingBar from "./SortingBar";

function ProductCardSkeleton() {
  return (
    <div className="bg-surface-2 overflow-hidden rounded-md border border-white/6">
      <div className="bg-surface-container-high aspect-square animate-pulse" />
      <div className="space-y-3 p-4">
        <div className="bg-surface-container-high h-5 w-3/4 animate-pulse rounded" />
        <div className="bg-surface-container-high h-3 w-1/2 animate-pulse rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="bg-surface-container-high h-5 w-1/4 animate-pulse rounded" />
          <div className="bg-surface-container-high h-8 w-16 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

function ProductListingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 3 }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function ProductsListing({
  result,
  hasError,
}: {
  result: ProductListResponse | undefined;
  hasError: boolean;
}) {
  return (
    <div id="catalog" className="md:col-span-9">
      <SortingBar total={result?.pagination.total ?? 0} />
      {hasError ? (
        <div className="padding-inline py-40 text-center">
          <h2 className="heading-font text-3xl font-semibold">
            The Atelier is taking a moment
          </h2>
          <p className="text-text-muted mt-3">
            We couldn&apos;t load the collection right now.
          </p>
          <Link
            href="/products"
            className="meta-font text-primary-soft mt-6 inline-block font-semibold"
          >
            Try again
          </Link>
        </div>
      ) : !result ? (
        <ProductListingSkeleton />
      ) : result.items.length > 0 ? (
        <ProductGrid products={result.items} />
      ) : (
        <div className="bg-surface-2 rounded-md border border-(--outline-strong) px-6 py-20 text-center">
          <h2 className="heading-font text-3xl font-semibold">
            No treasures found
          </h2>
          <p className="text-text-muted mt-3">
            We couldn&apos;t find any pieces matching your current selection.
          </p>
          <Link
            href="/products"
            className="meta-font text-primary-soft mt-6 inline-block font-semibold"
          >
            Explore all products
          </Link>
        </div>
      )}
    </div>
  );
}
