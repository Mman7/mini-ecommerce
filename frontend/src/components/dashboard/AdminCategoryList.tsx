"use client";

import { Search, Tags } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminCategories,
  type AdminCategory,
  updateAdminCategory,
} from "../../api/category.api";
import { DashboardPanel, PanelHeading, StatusPill, TableAction } from "./index";

export function AdminCategoryList({
  onStatisticsChange,
}: {
  onStatisticsChange: (statistics: {
    all: number;
    active: number;
    products: number;
  }) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAdminCategories({
      page,
      limit: 20,
      search: query,
      status: status === "active" || status === "inactive" ? status : undefined,
    })
      .then((result) => {
        if (active) {
          setItems(result.items);
          onStatisticsChange({
            ...result.statistics,
            products: result.items.reduce(
              (sum, category) => sum + category.productCount,
              0,
            ),
          });
          setPagination(result.pagination);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Unable to load categories. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, query, status, onStatisticsChange]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  async function toggle(category: AdminCategory) {
    try {
      const updated = await updateAdminCategory(category.categoryId, {
        isActive: !category.isActive,
      });
      setItems((current) =>
        current.map((item) =>
          item.categoryId === updated.categoryId
            ? { ...item, ...updated }
            : item,
        ),
      );
    } catch {
      setError("Unable to update category status.");
    }
  }

  return (
    <DashboardPanel className="mt-3">
      <PanelHeading
        title="All Categories"
        action={
          <div className="flex gap-2">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-(--outline)"
                size={13}
              />
              <input
                aria-label="Search categories"
                value={query}
                onChange={(event) => updateParam("search", event.target.value)}
                placeholder="Search categories..."
                className="meta-font bg-surface-2 text-foreground h-7 w-44 rounded border border-(--glass-border) pl-8 text-xs outline-none"
              />
            </div>
            <select
              aria-label="Category status"
              value={status}
              onChange={(event) => updateParam("status", event.target.value)}
              className="meta-font bg-surface-2 text-text-muted h-7 rounded border border-(--glass-border) px-2 text-xs"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        }
      />
      {error ? (
        <p role="alert" className="text-secondary p-5 text-sm">
          {error}
        </p>
      ) : loading ? (
        <div className="space-y-3 p-5">
          <div className="bg-surface-2 h-8 animate-pulse rounded" />
          <div className="bg-surface-2 h-8 animate-pulse rounded" />
        </div>
      ) : !items.length ? (
        <div className="text-text-muted p-8 text-center text-sm">
          No categories found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-170 text-left">
            <thead className="meta-font bg-surface-2/60 text-xs text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="py-3">Products</th>
                <th className="py-3">Status</th>
                <th className="py-3">Updated</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((category) => (
                <tr
                  key={category.categoryId}
                  className="border-t border-(--glass-border)"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/15 text-primary-soft flex h-8 w-8 items-center justify-center rounded-md">
                        <Tags size={14} />
                      </span>
                      <span className="text-foreground text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-text-muted py-3 text-xs">
                    {category.productCount}
                  </td>
                  <td className="py-3">
                    <StatusPill
                      status={category.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="py-3 text-xs text-(--outline)">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-1">
                      <TableAction
                        label={`Edit ${category.name}`}
                        href={`/dashboard/categories/${category.categoryId}/edit`}
                      />
                      <button
                        type="button"
                        onClick={() => toggle(category)}
                        className="text-text-muted hover:border-primary h-6 rounded border border-(--glass-border) px-2 text-[10px]"
                      >
                        {category.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
        <span>
          Showing {items.length} of {pagination.total} categories
        </span>
        <div className="flex gap-1">
          {Array.from(
            { length: pagination.totalPages },
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
                    : "h-6 w-6 rounded text-(--outline)"
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
