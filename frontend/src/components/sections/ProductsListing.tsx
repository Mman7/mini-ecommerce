"use client";

import Link from "next/link";
import type { Product } from "../../api/product.api";
import { Button } from "../ui/Button";
import { useProductFilters } from "@/src/hooks/useProductFilters";
import { LoadMore } from "../products/LoadMore";
import ProductGrid, { PRODUCT_GRID_CLASS } from "./ProductGrid";

function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="bg-surface-container-high aspect-square animate-pulse rounded-2xl" />
      <div className="mt-3 space-y-1 px-1">
        <div className="bg-surface-container-high h-6 w-3/4 animate-pulse rounded" />
        <div className="bg-surface-container-high mt-1 h-4 w-1/3 animate-pulse rounded" />
        <div className="bg-surface-container-high mt-1 h-5 w-1/4 animate-pulse rounded" />
      </div>
    </div>
  );
}

function ProductListingSkeleton() {
  return (
    <div
      className={PRODUCT_GRID_CLASS}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProductLoadError() {
  return (
    <div className="px-4 py-40 text-center">
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
  );
}

function EmptyProductList({ onClear }: { onClear: () => void }) {
  return (
    <div className="bg-surface-2 rounded-2xl border border-white/10 px-6 py-20 text-center">
      <h2 className="heading-font text-3xl font-semibold">
        No pieces match these filters
      </h2>
      <p className="text-text-muted mt-3">
        Try a different category, price range, or sort.
      </p>
      <Button
        variant="secondary"
        onClick={onClear}
        className="mt-6 rounded-full"
      >
        Clear filters
      </Button>
    </div>
  );
}

export default function ProductsListing({
  products,
  total,
  hasError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  products: Product[] | undefined;
  total: number;
  hasError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  const loaded = products?.length ?? 0;
  const { clear } = useProductFilters();
  let content;

  if (hasError) {
    content = <ProductLoadError />;
  } else if (!products) {
    content = <ProductListingSkeleton />;
  } else if (products.length === 0) {
    content = <EmptyProductList onClear={clear} />;
  } else {
    content = (
      <>
        <ProductGrid products={products} />
        <LoadMore
          loaded={loaded}
          total={total}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
        />
      </>
    );
  }

  return (
    <div
      id="catalog"
      className="mx-auto max-w-[1680px] px-4 pb-16 min-[820px]:px-16"
    >
      {content}
    </div>
  );
}
