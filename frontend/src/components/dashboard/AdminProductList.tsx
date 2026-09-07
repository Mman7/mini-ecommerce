"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminProducts,
  type Product,
  type AdminProductListResponse,
} from "../../api/product.api";
import { getCategories, type Category } from "../../api/category.api";
import { DashboardPanel, PanelHeading, StatusPill, TableAction } from "./index";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

function getImageSrc(value: string | null | undefined) {
  const imageUrl = value?.trim();
  if (!imageUrl) return null;
  if (imageUrl.startsWith("/")) return imageUrl;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    try {
      const parsedUrl = new URL(imageUrl);
      return `${parsedUrl.pathname}${parsedUrl.search}`;
    } catch {
      return null;
    }
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
  const [data, setData] = useState<AdminProductListResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const status = searchParams.get("status") ?? "";
  const stock = searchParams.get("stock") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      getAdminProducts({
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
      getCategories(),
    ])
      .then(([products, categoryList]) => {
        if (active) {
          setData(products);
          onStatisticsChange(products.statistics);
          setCategories(categoryList);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Unable to load products. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, query, categoryId, status, stock, onStatisticsChange]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <DashboardPanel className="mt-3">
      <PanelHeading title="All Products" />
      <div className="flex flex-col gap-2 border-b border-(--glass-border) p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-(--outline)"
            size={13}
          />
          <input
            aria-label="Search products"
            value={query}
            onChange={(event) => updateParam("search", event.target.value)}
            placeholder="Search products..."
            className="meta-font bg-surface-2 text-foreground h-8 w-full rounded border border-(--glass-border) pl-8 text-xs outline-none"
          />
        </div>
        <select
          aria-label="Product category"
          value={categoryId}
          onChange={(event) => updateParam("categoryId", event.target.value)}
          className="meta-font bg-surface-2 text-text-muted h-8 rounded border border-(--glass-border) px-2 text-xs"
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
          className="meta-font bg-surface-2 text-text-muted h-8 rounded border border-(--glass-border) px-2 text-xs"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          aria-label="Product stock"
          value={stock}
          onChange={(event) => updateParam("stock", event.target.value)}
          className="meta-font bg-surface-2 text-text-muted h-8 rounded border border-(--glass-border) px-2 text-xs"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>
      {error ? (
        <p role="alert" className="text-secondary p-5 text-sm">
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="meta-font bg-surface-2/60 text-xs text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Status</th>
                <th className="py-3">Updated</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((product: Product) => {
                const image =
                  product.productImages.find((item) => item.isThumbnail) ??
                  product.productImages[0];
                const imageSrc = getImageSrc(image?.url);
                const stockLabel =
                  product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 10
                      ? "Low Stock"
                      : "In Stock";
                return (
                  <tr
                    key={product.productId}
                    className="border-t border-(--glass-border)"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="bg-surface-3 relative h-9 w-9 shrink-0 overflow-hidden rounded">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={image.altText ?? product.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <span className="text-foreground text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-xs text-(--outline)">
                      {product.category?.name ?? "Uncategorized"}
                    </td>
                    <td className="text-text-muted py-2.5 text-xs">
                      {money.format(product.price)}
                    </td>
                    <td
                      className={
                        product.stock === 0
                          ? "text-secondary py-2.5 text-xs"
                          : "text-text-muted py-2.5 text-xs"
                      }
                    >
                      {product.stock}
                    </td>
                    <td className="py-2.5">
                      <StatusPill
                        status={product.isActive ? "Active" : "Inactive"}
                      />
                      <span className="ml-1">
                        <StatusPill status={stockLabel} />
                      </span>
                    </td>
                    <td className="py-2.5 text-xs text-(--outline)">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex justify-end">
                        <TableAction
                          label={`Edit ${product.name}`}
                          href={`/dashboard/products/${product.productId}/edit`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
