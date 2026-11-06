"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productApi } from "../../api/product.api";
import type { Category } from "../../api/category.api";
import {
  PRICE_FLOOR,
  toProductQuery,
  type ProductFilters,
} from "@/src/lib/product-filters";
import { BottomSheet } from "../ui/BottomSheet";
import { Button } from "../ui/Button";
import { PriceRange } from "./PricePopover";
import { chipClass } from "./CategoryChips";

export type FilterDraft = Pick<
  ProductFilters,
  "category" | "min" | "max" | "stock"
>;

const CLEARED_DRAFT: FilterDraft = {
  category: null,
  min: PRICE_FLOOR,
  max: null,
  stock: false,
};

export function FilterSheet({
  categories,
  filters,
  onApply,
  onClose,
}: {
  categories: Category[];
  filters: ProductFilters;
  onApply: (draft: FilterDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<FilterDraft>({
    category: filters.category,
    min: filters.min,
    max: filters.max,
    stock: filters.stock,
  });

  const draftFilters = { ...filters, ...draft };
  const countQuery = useQuery({
    queryKey: ["products-count", toProductQuery(draftFilters)],
    queryFn: () =>
      productApi.list({
        ...toProductQuery(draftFilters),
        page: 1,
        limit: 1,
      }),
    placeholderData: keepPreviousData,
  });
  const count = countQuery.data?.pagination.total;

  return (
    <BottomSheet
      title="Filters"
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={() => {
              setDraft(CLEARED_DRAFT);
              onApply(CLEARED_DRAFT);
            }}
            className="flex-1 rounded-full"
          >
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="flex-1 rounded-full"
          >
            {count === undefined ? "Show products" : `Show ${count} products`}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6 pt-2">
        <section>
          <h3 className="meta-font mb-3 text-sm font-semibold">Price</h3>
          <PriceRange
            min={draft.min}
            max={draft.max}
            onChange={(min, max) =>
              setDraft((current) => ({ ...current, min, max }))
            }
          />
        </section>

        <section className="flex items-center justify-between">
          <span
            id="stock-toggle-label"
            className="meta-font text-sm font-semibold"
          >
            In stock only
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={draft.stock}
            aria-labelledby="stock-toggle-label"
            onClick={() =>
              setDraft((current) => ({ ...current, stock: !current.stock }))
            }
            className={`focus-amber relative h-7 w-12 rounded-full transition-colors motion-reduce:transition-none ${
              draft.stock ? "bg-primary" : "bg-surface-3"
            }`}
          >
            <span
              className={`bg-on-surface absolute top-1 left-1 size-5 rounded-full transition-transform motion-reduce:transition-none ${
                draft.stock ? "translate-x-5" : ""
              }`}
            />
          </button>
        </section>

        <section>
          <h3 className="meta-font mb-3 text-sm font-semibold">Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={draft.category === null}
              onClick={() =>
                setDraft((current) => ({ ...current, category: null }))
              }
              className={chipClass(draft.category === null)}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                type="button"
                aria-pressed={draft.category === category.categoryId}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    category: category.categoryId,
                  }))
                }
                className={chipClass(draft.category === category.categoryId)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </BottomSheet>
  );
}
