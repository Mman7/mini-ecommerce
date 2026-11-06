import type { ProductSearchParams } from "@/src/api/product.api";

export const PRICE_FLOOR = 0;
export const PRICE_CEIL = 5000;
export const PRICE_STEP = 100;
export const PRODUCTS_PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  {
    value: "featured",
    label: "Featured",
    sortBy: "productId",
    sortOrder: "asc",
  },
  {
    value: "price-asc",
    label: "Price: low to high",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    value: "price-desc",
    label: "Price: high to low",
    sortBy: "price",
    sortOrder: "desc",
  },
  {
    value: "newest",
    label: "Newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export type ProductFilters = {
  search: string;
  category: number | null;
  min: number;
  // null means no upper bound (the slider's top end)
  max: number | null;
  stock: boolean;
  sort: SortValue;
};

export type FilterKey = "category" | "min" | "max" | "stock" | "sort";

function parseNumber(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function clampPrice(value: number) {
  return Math.min(PRICE_CEIL, Math.max(PRICE_FLOOR, value));
}

export function parseFilters(params: URLSearchParams): ProductFilters {
  const category = parseNumber(params.get("category"));
  const min = parseNumber(params.get("min"));
  const max = parseNumber(params.get("max"));
  const sort = SORT_OPTIONS.find(
    (option) => option.value === params.get("sort"),
  );

  return {
    search: params.get("name")?.trim() ?? "",
    category:
      category !== null && Number.isInteger(category) && category > 0
        ? category
        : null,
    min: min === null ? PRICE_FLOOR : clampPrice(min),
    max: max === null || max >= PRICE_CEIL ? null : clampPrice(max),
    stock: params.get("stock") === "true",
    sort: sort?.value ?? "featured",
  };
}

export function toProductQuery(
  filters: ProductFilters,
): Omit<ProductSearchParams, "page"> {
  const sort = SORT_OPTIONS.find((option) => option.value === filters.sort);

  return {
    limit: PRODUCTS_PAGE_SIZE,
    ...(filters.search ? { name: filters.search } : {}),
    ...(filters.category ? { categoryId: filters.category } : {}),
    ...(filters.min > PRICE_FLOOR ? { minPrice: filters.min } : {}),
    ...(filters.max !== null ? { maxPrice: filters.max } : {}),
    ...(filters.stock ? { inStock: true } : {}),
    sortBy: sort?.sortBy ?? "productId",
    sortOrder: sort?.sortOrder ?? "asc",
  };
}

export function buildFilterQuery(
  current: URLSearchParams,
  changes: Partial<Record<FilterKey, string | null>>,
): string {
  const params = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  params.delete("page");
  return params.toString();
}

export type FilterChanges = Partial<{
  category: number | null;
  min: number;
  max: number | null;
  stock: boolean;
  sort: SortValue;
}>;

// Converts typed filter values into the string-or-null shape stored in the URL.
export function toUrlChanges(
  changes: FilterChanges,
): Partial<Record<FilterKey, string | null>> {
  const result: Partial<Record<FilterKey, string | null>> = {};
  if (changes.category !== undefined) {
    result.category =
      changes.category === null ? null : String(changes.category);
  }
  if (changes.min !== undefined) {
    result.min = changes.min > PRICE_FLOOR ? String(changes.min) : null;
  }
  if (changes.max !== undefined) {
    result.max = changes.max === null ? null : String(changes.max);
  }
  if (changes.stock !== undefined) {
    result.stock = changes.stock ? "true" : null;
  }
  if (changes.sort !== undefined) {
    result.sort = changes.sort;
  }
  return result;
}

export function countActiveFilters(filters: ProductFilters): number {
  return [
    filters.category !== null,
    filters.min > PRICE_FLOOR || filters.max !== null,
    filters.stock,
  ].filter(Boolean).length;
}
