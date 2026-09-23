"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productApi, type ProductSearchParams } from "../../api/product.api";
import ProductsListing from "../../components/sections/ProductsListing";
import ProductsPagination from "../../components/sections/ProductsPagination";

const sortFields = ["productId", "name", "price", "createdAt"] as const;
const sortOrders = ["asc", "desc"] as const;

function first(value: string | null) {
  return value ?? undefined;
}

function getProductQuery(searchParams: URLSearchParams): ProductSearchParams {
  const page = Math.max(1, Number(first(searchParams.get("page"))) || 1);
  const categoryId = Number(first(searchParams.get("categoryId")));
  const sortBy = first(searchParams.get("sortBy"));
  const sortOrder = first(searchParams.get("sortOrder"));
  const minPrice = first(searchParams.get("minPrice"));
  const maxPrice = first(searchParams.get("maxPrice"));

  return {
    page,
    limit: 12,
    ...(first(searchParams.get("name"))
      ? { name: first(searchParams.get("name")) }
      : {}),
    ...(minPrice && Number.isFinite(Number(minPrice))
      ? { minPrice: Number(minPrice) }
      : {}),
    ...(maxPrice && Number.isFinite(Number(maxPrice))
      ? { maxPrice: Number(maxPrice) }
      : {}),
    ...(Number.isInteger(categoryId) && categoryId > 0 ? { categoryId } : {}),
    ...(searchParams.get("inStock") === "true" ? { inStock: true } : {}),
    ...(sortFields.includes(sortBy as (typeof sortFields)[number])
      ? { sortBy: sortBy as ProductSearchParams["sortBy"] }
      : {}),
    ...(sortOrders.includes(sortOrder as (typeof sortOrders)[number])
      ? { sortOrder: sortOrder as ProductSearchParams["sortOrder"] }
      : {}),
  };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="padding-inline py-40" />}>
      <ProductsPageContent />
    </Suspense>
  );
}

// This component handles the content for the products page, including the product listing and pagination.
function ProductsPageContent() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const productQuery = getProductQuery(params);

  const productsQuery = useQuery({
    queryKey: ["products", productQuery],
    queryFn: () => productApi.list(productQuery),
    placeholderData: (previousData) => previousData,
  });
  const result = productsQuery.data;

  return (
    <>
      <ProductsListing
        result={result}
        hasError={Boolean(productsQuery.error)}
      />
      {result && (
        <ProductsPagination
          pagination={result.pagination}
          query={params.toString()}
        />
      )}
    </>
  );
}
