"use client";

import { RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  productApi,
  type AdminProductListResponse,
  type Product,
} from "../../api/product.api";
import { categoryApi } from "../../api/category.api";
import {
  DashboardPanel,
  DataTable,
  PanelHeading,
  StatusPill,
  TableAction,
} from "./index";
import type { ColumnDef } from "@tanstack/react-table";
import { DEFAULT_PRODUCT_IMAGE } from "@/src/path/product_image_path";
import { ImageWithFallback } from "@/src/components/ui/ImageWithFallback";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

function getImageSrc(value: string | null | undefined) {
  const imageUrl = value?.trim();
  if (!imageUrl) return null;
  if (imageUrl.startsWith("/")) return imageUrl;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `/${imageUrl}`;
}

export function AdminProductList({
  onStatisticsChange,
}: {
  onStatisticsChange: (
    statistics: AdminProductListResponse["statistics"],
  ) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(query);
  const categoryId = searchParams.get("categoryId") ?? "";
  const status = searchParams.get("status") ?? "";
  const stock = searchParams.get("stock") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const productQuery = useQuery({
    queryKey: ["admin-products", { page, query, categoryId, status, stock }],
    queryFn: () =>
      productApi.admin.list({
        page,
        limit: 20,
        search: query,
        categoryId: categoryId ? Number(categoryId) : undefined,
        status:
          status === "active" || status === "inactive" ? status : undefined,
        stock:
          stock === "in" || stock === "low" || stock === "out"
            ? stock
            : undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });
  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
  });

  const data = productQuery.data;
  const categories = categoryQuery.data ?? [];
  const loading = productQuery.isPending || categoryQuery.isPending;
  const error =
    productQuery.error || categoryQuery.error
      ? "Unable to load products. Please try again."
      : "";

  useEffect(() => {
    if (data) onStatisticsChange(data.statistics);
  }, [data, onStatisticsChange]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  const debouncedSearch = useDebouncedCallback(
    (value: string) => updateParam("search", value),
    300,
  );

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const columns: ColumnDef<Product>[] = [
    {
      id: "product",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        const image =
          product.productImages.find((item) => item.isThumbnail) ??
          product.productImages[0];
        const imageSrc = getImageSrc(image?.url) ?? DEFAULT_PRODUCT_IMAGE;
        return (
          <div className="flex items-center gap-3">
            <div className="bg-surface-3 relative h-9 w-9 shrink-0 overflow-hidden rounded">
              <ImageWithFallback
                src={imageSrc}
                alt={image?.altText ?? product.name}
                fill
                sizes="36px"
                className="object-cover"
                fallbackSrc={DEFAULT_PRODUCT_IMAGE}
              />
            </div>
            <Link
              href={`/dashboard/products/${product.productId}`}
              className="text-foreground hover:text-primary-soft! text-sm transition-colors"
            >
              {product.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-xs text-(--outline)">
          {row.original.category?.name ?? "Uncategorized"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-text-muted text-xs">
          {money.format(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <span
          className={
            row.original.stock === 0
              ? "text-primary-soft text-xs"
              : "text-text-muted text-xs"
          }
        >
          {row.original.stock}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const stockLabel =
          row.original.stock === 0
            ? "Out of Stock"
            : row.original.stock <= 10
              ? "Low Stock"
              : "In Stock";
        return (
          <>
            <StatusPill
              status={row.original.isActive ? "Active" : "Inactive"}
            />
            <span className="ml-1">
              <StatusPill status={stockLabel} />
            </span>
          </>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-xs text-(--outline)">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Action</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <TableAction
            label={`Edit ${row.original.name}`}
            href={`/dashboard/products/${row.original.productId}/edit`}
          />
        </div>
      ),
    },
  ];

  return (
    <DashboardPanel className="mt-4 overflow-hidden">
      <PanelHeading
        title="Product registry"
        titleClassName="text-base sm:text-lg"
        action={
          <span className="meta-font text-xs text-(--outline)">
            {data?.pagination.total ?? 0} records
          </span>
        }
      />
      <div className="flex flex-col gap-2 p-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-(--outline)"
            size={14}
          />
          <input
            aria-label="Search products"
            value={searchInput}
            onChange={(event) => {
              const value = event.target.value;
              setSearchInput(value);
              debouncedSearch(value);
            }}
            placeholder="Search by product name, SKU, or category..."
            className="meta-font bg-surface-2 text-foreground focus:border-primary h-9 w-full rounded-md border border-(--glass-border) pr-3 pl-9 text-xs transition outline-none placeholder:text-(--outline)"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Product category"
            value={categoryId}
            onChange={(event) => updateParam("categoryId", event.target.value)}
            className="meta-font bg-surface-2 text-text-muted focus:border-primary h-9 min-w-36 rounded-md border border-(--glass-border) px-2.5 text-xs outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Product status"
            value={status}
            onChange={(event) => updateParam("status", event.target.value)}
            className="meta-font bg-surface-2 text-text-muted focus:border-primary h-9 min-w-32 rounded-md border border-(--glass-border) px-2.5 text-xs outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            aria-label="Product stock"
            value={stock}
            onChange={(event) => updateParam("stock", event.target.value)}
            className="meta-font bg-surface-2 text-text-muted focus:border-primary h-9 min-w-28 rounded-md border border-(--glass-border) px-2.5 text-xs outline-none"
          >
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <button
            type="button"
            aria-label="Reset product filters"
            onClick={() => router.push(pathname)}
            className="text-text-muted hover:border-primary hover:text-primary-soft flex h-9 w-9 items-center justify-center rounded-md border border-(--glass-border) transition"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
      <div className="meta-font flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 text-[11px] text-(--outline)">
        <span className="tracking-widest uppercase">Active filter</span>
        <span className="text-primary-soft border-primary/20 bg-primary/10 rounded border px-2 py-0.5">
          {status || stock || categoryId ? "filtered products" : "all products"}
        </span>
        <span>
          Showing {data?.items.length ?? 0} of {data?.pagination.total ?? 0}{" "}
          products
        </span>
      </div>
      {error ? (
        <p role="alert" className="text-primary-soft p-5 text-sm">
          {error}
        </p>
      ) : loading ? (
        <div className="space-y-3 p-5">
          <div className="bg-surface-2 h-8 animate-pulse rounded" />
          <div className="bg-surface-2 h-8 animate-pulse rounded" />
          <div className="bg-surface-2 h-8 animate-pulse rounded" />
        </div>
      ) : !data?.items.length ? (
        <div className="text-text-muted p-8 text-center text-sm">
          No products found.
        </div>
      ) : (
        <DataTable columns={columns} data={data.items} className="min-w-190" />
      )}
      <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
        <span>
          Showing {data?.items.length ?? 0} of {data?.pagination.total ?? 0}{" "}
          products
        </span>
        <div className="flex gap-1">
          {Array.from(
            { length: data?.pagination.totalPages ?? 0 },
            (_, index) => index + 1,
          )
            .slice(0, 8)
            .map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => updateParam("page", String(value))}
                className={
                  value === page
                    ? "border-primary bg-primary/15 text-primary-soft h-6 w-6 rounded border"
                    : "h-6 w-6 rounded text-(--outline) hover:bg-(--glass-bg)"
                }
              >
                {value}
              </button>
            ))}
        </div>
      </div>
    </DashboardPanel>
  );
}
