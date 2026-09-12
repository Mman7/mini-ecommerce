"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/category.api";
import { getProducts, type ProductSearchParams } from "../../api/product.api";
import ProductGrid from "./ProductGrid";
import FiltersSidebar from "./FiltersSidebar";
import SortingBar from "./SortingBar";
import Pagination from "../ui/Pagination";
import { AtelierBackdrop } from "../ui/BackgroundImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

function queryStringFrom(searchParams: URLSearchParams) {
  return searchParams.toString();
}

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const productQuery = getProductQuery(params);
  const categoryId = productQuery.categoryId;

  const productsQuery = useQuery({
    queryKey: ["products", productQuery],
    queryFn: () => getProducts(productQuery),
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = categoriesQuery.data ?? [];
  const selectedCategory = categories.find(
    (category) => category.categoryId === categoryId,
  );
  const heading = selectedCategory?.name ?? "Collectibles";
  const isLoading = productsQuery.isPending || categoriesQuery.isPending;
  const error = productsQuery.error ?? categoriesQuery.error;

  if (isLoading) {
    return (
      <main className="padding-inline py-40 text-center">
        <p className="text-text-muted">Loading the collection...</p>
      </main>
    );
  }

  if (error || !productsQuery.data) {
    return (
      <main className="padding-inline py-40 text-center">
        <h1 className="heading-font text-4xl font-semibold">
          The Atelier is taking a moment
        </h1>
        <p className="text-text-muted mt-3">
          We couldn&apos;t load the collection right now.
        </p>
        <Link
          href="/products"
          className="meta-font text-primary-soft mt-6 inline-block font-semibold"
        >
          Try again
        </Link>
      </main>
    );
  }

  const result = productsQuery.data;

  return (
    <main className="pb-15">
      <section className="padding-inline mb-xl relative flex h-[40vh] items-center overflow-hidden md:h-[50vh]">
        <AtelierBackdrop />
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
        <div className="px-margin-mobile md:px-margin-desktop relative z-10 w-full py-12 text-left md:py-20">
          <Breadcrumb className="text-label-sm font-label-sm text-on-surface/50 mb-xs">
            <BreadcrumbList className="gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="title-font text-md font-semibold tracking-wide text-(--outline)"
                  render={<Link href="/" />}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="title-font text-md font-semibold tracking-wide text-(--outline)"
                  render={<Link href="/products" />}
                >
                  Shop
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="title-font text-primary-soft! text-md font-semibold tracking-wide">
                  {heading}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-display-lg text-on-surface my-4 text-4xl font-semibold">
            {heading}
          </h1>
          <p className="text-body-lg font-body-lg mt-base text-text-muted max-w-2xl">
            A curated sanctuary of plush treasures, limited anime editions, and
            handcrafted figurines from the heart of Tokyo&apos;s artisan scene.
          </p>
        </div>
      </section>
      <div className="padding-inline mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
        <aside className="md:col-span-3">
          <FiltersSidebar categories={categories} />
        </aside>
        <div id="catalog" className="md:col-span-9">
          <SortingBar total={result.pagination.total} />
          {result.items.length > 0 ? (
            <ProductGrid products={result.items} />
          ) : (
            <div className="bg-surface-2 rounded-md border border-(--outline-strong) px-6 py-20 text-center">
              <h2 className="heading-font text-3xl font-semibold">
                No treasures found
              </h2>
              <p className="text-text-muted mt-3">
                We couldn&apos;t find any pieces matching your current
                selection.
              </p>
              <Link
                href="/products"
                className="meta-font text-primary-soft mt-6 inline-block font-semibold"
              >
                Explore all products
              </Link>
            </div>
          )}
          <Pagination
            page={result.pagination.page}
            totalPages={result.pagination.totalPages}
            total={result.pagination.total}
            query={queryStringFrom(params)}
          />
        </div>
      </div>
    </main>
  );
}
