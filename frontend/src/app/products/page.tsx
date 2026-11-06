"use client";

import { Suspense } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { productApi } from "../../api/product.api";
import { categoryApi } from "../../api/category.api";
import { useProductFilters } from "@/src/hooks/useProductFilters";
import { toProductQuery } from "@/src/lib/product-filters";
import FilterBar from "../../components/products/FilterBar";
import ProductsHero from "../../components/sections/ProductsHero";
import ProductsListing from "../../components/sections/ProductsListing";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="padding-inline py-40" />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const { filters } = useProductFilters();
  const productQuery = toProductQuery(filters);
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
  });
  const categories = categoriesQuery.data ?? [];
  const heading =
    categories.find((category) => category.categoryId === filters.category)
      ?.name ?? "Collectibles";

  const productsQuery = useInfiniteQuery({
    queryKey: ["products", productQuery],
    queryFn: ({ pageParam }) =>
      productApi.list({ ...productQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    placeholderData: keepPreviousData,
  });

  const pages = productsQuery.data?.pages ?? [];
  const products = productsQuery.data
    ? pages.flatMap((page) => page.items)
    : undefined;
  const total = pages[0]?.pagination.total ?? 0;

  return (
    <>
      <ProductsHero heading={heading} total={total} />
      <FilterBar categories={categories} total={total} />
      <ProductsListing
        products={products}
        total={total}
        hasError={Boolean(productsQuery.error)}
        hasNextPage={Boolean(productsQuery.hasNextPage)}
        isFetchingNextPage={productsQuery.isFetchingNextPage}
        onLoadMore={() => productsQuery.fetchNextPage()}
      />
    </>
  );
}
