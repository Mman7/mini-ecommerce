"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "../../api/category.api";
import SortingBar from "./SortingBar";

const pricePresets = [
  { label: "Any price", minPrice: null, maxPrice: null },
  { label: "Under ¥2,000", minPrice: null, maxPrice: "2000" },
  { label: "¥2,000–5,000", minPrice: "2000", maxPrice: "5000" },
  { label: "¥5,000+", minPrice: "5000", maxPrice: null },
] as const;

const pillBase =
  "meta-font shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors";
const pillActive = "bg-primary text-primary-ink border-transparent";
const pillIdle =
  "bg-surface-2 text-on-surface/75 hover:border-primary/40 hover:text-on-surface border-white/10";

export default function ProductsFilterBar({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeCategoryId = searchParams.get("categoryId");
  const activeMin = searchParams.get("minPrice");
  const activeMax = searchParams.get("maxPrice");
  const inStock = searchParams.get("inStock") === "true";

  return (
    <div className="bg-surface-1/90 border-surface-3 sticky top-(--navbar-height) z-40 border-b backdrop-blur-xl">
      <div className="padding-inline flex items-center gap-3 py-3">
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          <button
            type="button"
            aria-pressed={!activeCategoryId}
            onClick={() => updateParams({ categoryId: null })}
            className={`${pillBase} ${!activeCategoryId ? pillActive : pillIdle}`}
          >
            All
          </button>
          {categories.map((category) => {
            const active = activeCategoryId === String(category.categoryId);
            return (
              <button
                key={category.categoryId}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  updateParams({ categoryId: String(category.categoryId) })
                }
                className={`${pillBase} ${active ? pillActive : pillIdle}`}
              >
                {category.name}
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className="mx-1 h-5 w-px shrink-0 bg-white/10"
          />
          {pricePresets.map((preset) => {
            const active =
              (activeMin ?? null) === preset.minPrice &&
              (activeMax ?? null) === preset.maxPrice;
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  updateParams({
                    minPrice: preset.minPrice,
                    maxPrice: preset.maxPrice,
                  })
                }
                className={`${pillBase} ${active ? pillActive : pillIdle}`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={inStock}
            onClick={() => updateParams({ inStock: inStock ? null : "true" })}
            className={`${pillBase} ${inStock ? pillActive : pillIdle}`}
          >
            In stock
          </button>
        </div>
        <SortingBar />
      </div>
    </div>
  );
}
