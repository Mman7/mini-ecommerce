"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildFilterQuery,
  countActiveFilters,
  parseFilters,
  PRICE_FLOOR,
  toUrlChanges,
  type FilterChanges,
} from "@/src/lib/product-filters";

// Scrolls to the grid only when the user has already scrolled past its top.
function scrollToCatalogIfBelow() {
  const catalog = document.getElementById("catalog");
  if (!catalog) return;

  const top = catalog.getBoundingClientRect().top;
  if (top >= 0) return;

  const navbarHeight =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height",
      ),
    ) || 0;
  const filterBarHeight =
    document.getElementById("filter-bar")?.offsetHeight ?? 0;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.scrollTo({
    top: window.scrollY + top - navbarHeight - filterBarHeight - 16,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const update = useCallback(
    (changes: FilterChanges) => {
      const query = buildFilterQuery(
        new URLSearchParams(searchParams.toString()),
        toUrlChanges(changes),
      );
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
      scrollToCatalogIfBelow();
    },
    [pathname, router, searchParams],
  );

  const clear = useCallback(
    () => update({ category: null, min: PRICE_FLOOR, max: null, stock: false }),
    [update],
  );

  const hasActiveFilters = countActiveFilters(filters) > 0;

  return { filters, update, clear, hasActiveFilters };
}
