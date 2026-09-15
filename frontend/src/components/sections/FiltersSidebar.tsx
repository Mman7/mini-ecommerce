"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Category } from "../../api/category.api";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";

const PRICE_MAX = 5000;
const PRICE_STEP = 100;
const PRICE_UPDATE_DELAY = 300;

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
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const priceUpdateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>(() => [
    normalizePrice(searchParams.get("minPrice"), 0),
    normalizePrice(searchParams.get("maxPrice"), PRICE_MAX),
  ]);

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
    return () => {
      cancelPriceUpdate();
    };
  }, []);

  function cancelPriceUpdate() {
    if (!priceUpdateTimeout.current) return;
    clearTimeout(priceUpdateTimeout.current);
    priceUpdateTimeout.current = null;
  }

  function updatePriceRange(value: number | readonly number[]) {
    if (!Array.isArray(value)) return;
    const [minPrice, maxPrice] = value;
    setPriceRange([minPrice, maxPrice]);

    cancelPriceUpdate();
    priceUpdateTimeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("minPrice", String(minPrice));
      params.set("maxPrice", String(maxPrice));
      params.delete("page");
      router.push(`/products?${params.toString()}`);
      priceUpdateTimeout.current = null;
    }, PRICE_UPDATE_DELAY);
  }

  function updateFilter(key: string, value: string) {
    cancelPriceUpdate();
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <aside className="space-y-6">
      <div className="bg-surface-1 rounded-[14px] border border-(--outline-strong)/35 p-6 shadow-[inset_0_1px_0_rgba(230,225,228,0.03)]">
        <h3 className="heading-font text-foreground mb-6 text-4xl leading-none font-semibold">
          Filters
        </h3>
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
            <FieldLabel className="sr-only" htmlFor="price-range">
              Price range
            </FieldLabel>
            <Slider
              id="price-range"
              aria-label="Price range"
              min={0}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={priceRange}
              onValueChange={updatePriceRange}
              className="py-2"
            />
            <div className="text-text-muted flex justify-between text-xs">
              <span>RM {priceRange[0].toLocaleString()}</span>
              <span>RM {priceRange[1].toLocaleString()}</span>
            </div>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal" className="items-center gap-3">
          <Checkbox
            id="in-stock"
            checked={searchParams.get("inStock") === "true"}
            onCheckedChange={(checked) =>
              updateFilter("inStock", checked ? "true" : "")
            }
          />
          <FieldLabel htmlFor="in-stock" className="cursor-pointer">
            In stock only
          </FieldLabel>
        </Field>
        <button
          type="button"
          onClick={() => {
            cancelPriceUpdate();
            setPriceRange([0, PRICE_MAX]);
            router.push("/products");
          }}
          className="meta-font hover:bg-primary-soft text-primary-soft border-primary-soft mt-3 w-full rounded border bg-transparent px-3 py-2 text-sm font-semibold transition hover:cursor-pointer hover:text-white"
        >
          Clear filters
        </button>
      </div>

      <div className="group relative overflow-hidden rounded-[14px] border border-[rgba(255,174,218,0.22)] bg-[linear-gradient(160deg,rgba(111,49,87,0.28),rgba(38,22,33,0.82))] p-6">
        <div className="absolute -top-8 -right-8 h-32 w-32 bg-[rgba(255,174,218,0.14)] blur-3xl transition-all group-hover:blur-2xl"></div>
        <h3 className="title-font text-secondary mb-3 text-4xl font-semibold">
          Monthly Crate
        </h3>
        <p className="text-body-md mb-5 text-(--foreground)/92">
          Get a curated box of Tokyo surprises every month.
        </p>
        <button
          type="button"
          onClick={() =>
            toast.add({
              title: "Subscriptions are coming soon",
              description: "We will let you know when the Monthly Crate opens.",
              type: "info",
            })
          }
          className="meta-font bg-secondary w-full rounded-md py-2.5 text-lg font-semibold text-[#541a3f] transition-all hover:scale-[1.02] active:scale-95"
        >
          Subscribe Now
        </button>
      </div>
    </aside>
  );
}
