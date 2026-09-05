// TODO refactor with tan stack query
// TODO implement server-side filtering and sorting
// TODO pagination
import Link from "next/link";
import ProductGrid from "../../components/sections/ProductGrid";
import FiltersSidebar from "../../components/sections/FiltersSidebar";
import SortingBar from "../../components/sections/SortingBar";
import Pagination from "../../components/ui/Pagination";
import { getCategories } from "../../api/category.api";
import { getProducts } from "../../api/product.api";
import { AtelierBackdrop } from "../../components/ui/BackgroundImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(first(params.page)) || 1);
  const limit = 12;
  const sortBy = first(params.sortBy);
  const sortOrder = first(params.sortOrder);
  const categoryId = Number(first(params.categoryId));
  const query = {
    page,
    limit,
    ...(first(params.name) ? { name: first(params.name) } : {}),
    ...(first(params.minPrice)
      ? { minPrice: Number(first(params.minPrice)) }
      : {}),
    ...(first(params.maxPrice)
      ? { maxPrice: Number(first(params.maxPrice)) }
      : {}),
    ...(Number.isInteger(categoryId) && categoryId > 0 ? { categoryId } : {}),
    ...(first(params.inStock) === "true" ? { inStock: true } : {}),
    ...(sortBy
      ? { sortBy: sortBy as "productId" | "name" | "price" | "createdAt" }
      : {}),
    ...(sortOrder ? { sortOrder: sortOrder as "asc" | "desc" } : {}),
  };

  try {
    const [result, categories] = await Promise.all([
      getProducts(query),
      getCategories(),
    ]);
    const selectedCategory = categories.find(
      (category) => category.categoryId === categoryId,
    );
    const queryString = new URLSearchParams(
      Object.entries(params).flatMap(([key, value]) => [
        [key, first(value) ?? ""],
      ]),
    ).toString();

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
                    {selectedCategory?.name ?? "Collectibles"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="font-display-lg text-on-surface my-4 text-4xl font-semibold">
              {selectedCategory?.name ?? "Collectibles"}
            </h1>
            <p className="text-body-lg font-body-lg mt-base text-text-muted max-w-2xl">
              A curated sanctuary of plush treasures, limited anime editions,
              and handcrafted figurines from the heart of Tokyo&apos;s artisan
              scene.
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
              query={queryString}
            />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load product collection", error);
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
}
