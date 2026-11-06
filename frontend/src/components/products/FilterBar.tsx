"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category } from "../../api/category.api";
import { useProductFilters } from "@/src/hooks/useProductFilters";
import { countActiveFilters, type SortValue } from "@/src/lib/product-filters";
import { CategoryChips, chipClass } from "./CategoryChips";
import { PricePopover } from "./PricePopover";
import { SortSelect, SortSheet } from "./SortSelect";
import { FilterSheet } from "./FilterSheet";

// Hides the bar on scroll down; it returns on scroll up. Applied only below 820px via class.
function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 3) return;
      lastY = y;
      setHidden(delta > 0 && y > 200);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-amber text-primary-soft h-9 rounded-full px-2 text-sm font-semibold"
    >
      Clear
    </button>
  );
}

export default function FilterBar({
  categories,
  total,
}: {
  categories: Category[];
  total: number;
}) {
  const { filters, update, clear, hasActiveFilters } = useProductFilters();
  const hidden = useHideOnScrollDown();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const closeSort = useCallback(() => setSortOpen(false), []);

  const activeCount = countActiveFilters(filters);

  return (
    <div
      id="filter-bar"
      className={`bg-surface-1/90 border-surface-3 sticky top-(--navbar-height) z-40 border-b backdrop-blur-xl transition-transform duration-300 motion-reduce:transition-none ${
        hidden ? "max-[819px]:-translate-y-full" : ""
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-2.5 px-4 py-2.5 min-[820px]:flex-row min-[820px]:items-center min-[820px]:gap-3 min-[820px]:px-16 min-[820px]:py-3">
        <CategoryChips
          categories={categories}
          activeId={filters.category}
          onSelect={(id) => update({ category: id })}
          className="min-[820px]:flex-1"
        />

        <div className="flex items-center gap-2 min-[820px]:hidden">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setFiltersOpen(true)}
            className={`${chipClass(activeCount > 0)} inline-flex items-center gap-2`}
          >
            Filters
            {activeCount > 0 && (
              <span className="bg-primary text-primary-ink flex size-5 items-center justify-center rounded-full text-[11px] font-bold">
                {activeCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setSortOpen(true)}
            className={chipClass(false)}
          >
            Sort
          </button>
          {hasActiveFilters && <ClearFiltersButton onClick={clear} />}
          <span className="text-on-surface/75 meta-font ml-auto text-sm">
            {total} products
          </span>
        </div>

        <div className="hidden items-center gap-3 min-[820px]:flex">
          <span aria-hidden="true" className="h-6 w-px bg-white/10" />
          <PricePopover
            min={filters.min}
            max={filters.max}
            onApply={(min, max) => update({ min, max })}
          />
          <button
            type="button"
            aria-pressed={filters.stock}
            onClick={() => update({ stock: !filters.stock })}
            className={chipClass(filters.stock)}
          >
            In stock
          </button>
          <SortSelect
            value={filters.sort}
            onChange={(sort: SortValue) => update({ sort })}
          />
          {hasActiveFilters && <ClearFiltersButton onClick={clear} />}
        </div>
      </div>

      {filtersOpen && (
        <FilterSheet
          categories={categories}
          filters={filters}
          onApply={update}
          onClose={closeFilters}
        />
      )}
      {sortOpen && (
        <SortSheet
          value={filters.sort}
          onChange={(sort) => update({ sort })}
          onClose={closeSort}
        />
      )}
    </div>
  );
}
