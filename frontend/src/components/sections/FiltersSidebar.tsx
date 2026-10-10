"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/src/api/category.api";
import { productApi, type Product } from "@/src/api/product.api";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { formatYen, yenCurrency } from "@/src/lib/currency";

const PRICE_MAX = 5000;
const PRICE_STEP = 100;

function normalizePrice(value: string | null, fallback: number) {
  // Normalize the price value from the URL search params, ensuring it falls within the allowed range.
  if (value === null) return fallback;
  const price = Number(value);
  if (!Number.isFinite(price)) return fallback;
  return Math.min(
    PRICE_MAX,
    Math.max(0, Math.round(price / PRICE_STEP) * PRICE_STEP),
  );
}

export default function FiltersSidebar({
  categories,
  idPrefix = "product-filter",
}: {
  categories: Category[];
  idPrefix?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const lastUrlSearchName = useRef(searchParams.get("name") ?? "");
  const skipNextSearchUpdate = useRef(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchName, setSearchName] = useState(
    () => searchParams.get("name") ?? "",
  );
  const [debouncedSearchName] = useDebounce(searchName, 350);
  const suggestionsQuery = useQuery({
    queryKey: ["product-search-suggestions", debouncedSearchName.trim()],
    queryFn: () => productApi.search(debouncedSearchName.trim()),
    enabled: showSuggestions,
    staleTime: 30_000,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>(() => [
    normalizePrice(searchParams.get("minPrice"), 0),
    normalizePrice(searchParams.get("maxPrice"), PRICE_MAX),
  ]);
  const searchInputId = `${idPrefix}-search`;
  const priceRangeId = `${idPrefix}-price-range`;
  const inStockId = `${idPrefix}-in-stock`;

  function getPriceRange(): [number, number] {
    return [
      normalizePrice(searchParams.get("minPrice"), 0),
      normalizePrice(searchParams.get("maxPrice"), PRICE_MAX),
    ];
  }

  useEffect(() => {
    setPriceRange(getPriceRange());
  }, [searchParams]);

  useEffect(() => {
    const urlSearchName = searchParams.get("name") ?? "";
    if (urlSearchName === lastUrlSearchName.current) return;

    lastUrlSearchName.current = urlSearchName;
    skipNextSearchUpdate.current = true;
    setSearchName(urlSearchName);
  }, [searchParams]);

  useEffect(() => {
    if (skipNextSearchUpdate.current) {
      skipNextSearchUpdate.current = false;
      return;
    }

    const name = debouncedSearchName.trim();
    if (name === (searchParams.get("name") ?? "")) return;

    const params = new URLSearchParams(searchParams.toString());
    if (name) params.set("name", name);
    else params.delete("name");
    params.delete("page");
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [debouncedSearchName, router, searchParams]);

  useEffect(() => {
    const closeSuggestions = (event: PointerEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("pointerdown", closeSuggestions);
    return () => document.removeEventListener("pointerdown", closeSuggestions);
  }, []);

  function previewPriceRange(value: number | readonly number[]) {
    if (!Array.isArray(value)) return;
    const [minPrice, maxPrice] = value;
    setPriceRange([minPrice, maxPrice]);
  }

  function updatePriceRange(value: number | readonly number[]) {
    if (!Array.isArray(value)) return;
    const [minPrice, maxPrice] = value;
    setPriceRange([minPrice, maxPrice]);

    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(minPrice));
    params.set("maxPrice", String(maxPrice));
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function selectSearch(query: string) {
    const name = query.trim();
    setSearchName(name);
    setShowSuggestions(false);

    const params = new URLSearchParams(searchParams.toString());
    if (name) params.set("name", name);
    else params.delete("name");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function renderSuggestions() {
    const suggestions = suggestionsQuery.data ?? [];
    return (
      <div
        id={`${searchInputId}-suggestions`}
        className="bg-surface-1 border-surface-3 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-md border shadow-xl"
      >
        <p className="text-text-muted px-4 pt-3 pb-2 text-xs font-semibold">
          {debouncedSearchName.trim() ? "Matching products" : "Popular picks"}
        </p>
        {suggestionsQuery.isFetching ? (
          <p className="text-text-muted px-4 py-3 text-sm">Searching...</p>
        ) : suggestions.length ? (
          <ul>
            {suggestions.map((product: Product) => (
              <li key={product.productId}>
                <button
                  type="button"
                  onClick={() => selectSearch(product.name)}
                  className="hover:bg-surface-2 flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors"
                >
                  <span className="min-w-0">
                    <span className="text-foreground block truncate text-sm font-medium">
                      {product.name}
                    </span>
                    <span className="text-text-muted block truncate text-xs">
                      {product.category?.name ?? "Atelier selection"}
                    </span>
                  </span>
                  <span className="text-text-muted shrink-0 text-sm">
                    {yenCurrency.format(product.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted px-4 py-3 text-sm">
            No matching products
          </p>
        )}
        {searchName.trim() && (
          <button
            type="button"
            onClick={() => selectSearch(searchName)}
            className="text-primary-soft border-surface-3 w-full border-t px-4 py-3 text-left text-sm font-semibold"
          >
            Search for “{searchName.trim()}”
          </button>
        )}
      </div>
    );
  }

  return (
    <aside className="space-y-6">
      <div className="bg-surface-1 rounded-[14px] border border-(--outline-strong)/35 p-6 shadow-[inset_0_1px_0_rgba(230,225,228,0.03)]">
        <h3 className="heading-font text-foreground mb-6 text-4xl leading-none font-semibold">
          Filters
        </h3>
        <FieldSet className="mb-7 gap-0">
          <FieldLegend
            variant="label"
            className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase"
          >
            Search Products
          </FieldLegend>
          <FieldGroup>
            <FieldLabel className="sr-only" htmlFor={searchInputId}>
              Search products
            </FieldLabel>
            <div ref={searchContainerRef} className="relative">
              <Input
                id={searchInputId}
                type="search"
                value={searchName}
                aria-expanded={showSuggestions}
                aria-controls={`${searchInputId}-suggestions`}
                onFocus={() => setShowSuggestions(true)}
                onChange={(event) => {
                  setSearchName(event.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search products..."
                className="h-10"
              />
              {showSuggestions && renderSuggestions()}
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSet className="mb-lg gap-0">
          <FieldLegend
            variant="label"
            className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase"
          >
            Category
          </FieldLegend>
          <FieldGroup className="gap-3">
            <Toggle
              type="button"
              variant="outline"
              pressed={!searchParams.has("categoryId")}
              onPressedChange={(pressed) => {
                if (pressed) updateFilter("categoryId", "");
              }}
              className="w-full justify-start"
            >
              All collectibles
            </Toggle>
            {categories.map((category) => (
              <Toggle
                key={category.categoryId}
                type="button"
                variant="outline"
                pressed={
                  searchParams.get("categoryId") === String(category.categoryId)
                }
                onPressedChange={(pressed) => {
                  if (pressed) {
                    updateFilter("categoryId", String(category.categoryId));
                  }
                }}
                className="w-full justify-start"
              >
                {category.name}
              </Toggle>
            ))}
          </FieldGroup>
        </FieldSet>
        <FieldSet className="mt-7 mb-7 gap-0">
          <FieldLegend
            variant="label"
            className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase"
          >
            Price Range
          </FieldLegend>
          <FieldGroup className="gap-3">
            <FieldLabel className="sr-only" htmlFor={priceRangeId}>
              Price range
            </FieldLabel>
            <Slider
              id={priceRangeId}
              aria-label="Price range"
              min={0}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange}
              onValueChange={previewPriceRange}
              onValueCommitted={updatePriceRange}
              className="py-2"
            />
            <div className="text-text-muted flex justify-between text-xs">
              <span>{formatYen(priceRange[0])}</span>
              <span>{formatYen(priceRange[1])}</span>
            </div>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal" className="items-center gap-3">
          <Checkbox
            id={inStockId}
            checked={searchParams.get("inStock") === "true"}
            onCheckedChange={(checked) =>
              updateFilter("inStock", checked ? "true" : "")
            }
          />
          <FieldLabel htmlFor={inStockId} className="cursor-pointer">
            In stock only
          </FieldLabel>
        </Field>
        <button
          type="button"
          onClick={() => {
            setPriceRange([0, PRICE_MAX]);
            router.push("/products");
          }}
          className="meta-font hover:bg-primary-soft text-primary-soft border-primary-soft mt-3 w-full rounded border bg-transparent px-3 py-2 text-sm font-semibold transition hover:cursor-pointer hover:text-white"
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}
