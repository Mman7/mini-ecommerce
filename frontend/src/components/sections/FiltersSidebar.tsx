"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "../../api/category.api";

export default function FiltersSidebar({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
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
        <div className="mb-lg">
          <h4 className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase">
            Category
          </h4>
          <div className="space-y-3">
            <label className="group flex cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="category"
                checked={!searchParams.has("categoryId")}
                onChange={() => updateFilter("categoryId", "")}
              />
              All collectibles
            </label>
            {categories.map((category) => (
              <label
                key={category.categoryId}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="category"
                  checked={
                    searchParams.get("categoryId") ===
                    String(category.categoryId)
                  }
                  onChange={() =>
                    updateFilter("categoryId", String(category.categoryId))
                  }
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-7 mb-7">
          <h4 className="meta-font text-text-muted mb-4 text-[12px] font-semibold tracking-[0.12em] uppercase">
            Price Range
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <input
                aria-label="Minimum price"
                type="number"
                min="0"
                placeholder="Min"
                defaultValue={searchParams.get("minPrice") ?? ""}
                onBlur={(event) => updateFilter("minPrice", event.target.value)}
                className="bg-surface-2 h-10 rounded-md border border-(--outline-strong) px-2"
              />
              <input
                aria-label="Maximum price"
                type="number"
                min="0"
                placeholder="Max"
                defaultValue={searchParams.get("maxPrice") ?? ""}
                onBlur={(event) => updateFilter("maxPrice", event.target.value)}
                className="bg-surface-2 h-10 rounded-md border border-(--outline-strong) px-2"
              />
            </div>
          </div>
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={searchParams.get("inStock") === "true"}
            onChange={(event) =>
              updateFilter("inStock", event.target.checked ? "true" : "")
            }
          />
          In stock only
        </label>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="meta-font text-primary-soft text-sm font-semibold"
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
        <button className="meta-font bg-secondary w-full rounded-md py-2.5 text-lg font-semibold text-[#541a3f] transition-all hover:scale-[1.02] active:scale-95">
          Subscribe Now
        </button>
      </div>
    </aside>
  );
}
