"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
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

// This component handles the display of the product listing, including error states and empty states.
export default function ProductsListing({
  result,
  hasError,
}: {
  result: ProductListResponse | undefined;
  hasError: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("name") ?? "";
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => setSearchInput(query), [query]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedValue = value.trim();
    if (normalizedValue) params.set("name", normalizedValue);
    else params.delete("name");
    params.delete("page");
    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products", {
      scroll: false,
    });
  }, 300);

  return (
    <div id="catalog" className="md:col-span-9">
      <label className="bg-surface-2 border-surface-3 mb-5 flex max-w-xl items-center gap-3 rounded-md border px-4 py-3">
        <Search size={18} className="text-text-muted shrink-0" />
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search the collection..."
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
            debouncedSearch(event.target.value);
          }}
          className="text-foreground placeholder:text-text-muted w-full bg-transparent text-sm outline-none"
        />
      </label>
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
