"use client";

import { RotateCcw, Search, Tags } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { categoryApi, type AdminCategory } from "../../api/category.api";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/components/ui/toast";
import {
  DashboardPanel,
  DataTable,
  PanelHeading,
  StatusPill,
  TableAction,
} from "./index";

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
  const queryClient = useQueryClient();
  const query = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(query);
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const categoryQuery = useQuery({
    queryKey: ["admin-categories", { page, query, status }],
    queryFn: () =>
      categoryApi.admin.list({
        page,
        limit: 20,
        search: query,
        status:
          status === "active" || status === "inactive" ? status : undefined,
      }),
  });
  const data = categoryQuery.data;
  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 0 };
  const loading = categoryQuery.isPending;
  const error = categoryQuery.error
    ? "Unable to load categories. Please try again."
    : "";

  useEffect(() => {
    if (data) {
      onStatisticsChange({
        ...data.statistics,
        products: data.items.reduce(
          (sum, category) => sum + category.productCount,
          0,
        ),
      });
    }
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

  async function toggle(category: AdminCategory) {
    try {
      const updated = await categoryApi.admin.update(category.categoryId, {
        isActive: !category.isActive,
      });
      await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.add({
        title: "Category updated",
        description: `${category.name} is now ${updated.isActive ? "active" : "inactive"}.`,
        type: "success",
      });
    } catch {
      toast.add({
        title: "Update failed",
        description: "Unable to update category status.",
        type: "error",
      });
    }
  }

  const columns: ColumnDef<AdminCategory>[] = [
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="bg-primary/15 text-primary-soft flex h-8 w-8 items-center justify-center rounded-md">
            <Tags size={14} />
          </span>
          <span className="text-foreground text-sm font-medium">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "productCount",
      header: "Products",
      cell: ({ row }) => (
        <span className="text-text-muted text-xs">
          {row.original.productCount}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusPill status={row.original.isActive ? "Active" : "Inactive"} />
      ),
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
        <div className="flex justify-end gap-1">
          <TableAction
            label={`Edit ${row.original.name}`}
            href={`/dashboard/categories/${row.original.categoryId}/edit`}
          />
          <button
            type="button"
            onClick={() => toggle(row.original)}
            className="text-text-muted hover:border-primary h-6 rounded border border-(--glass-border) px-2 text-[10px]"
          >
            {row.original.isActive ? "Disable" : "Enable"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardPanel className="mt-4 overflow-hidden">
      <PanelHeading
        title="Category registry"
        titleClassName="text-base sm:text-lg"
        action={
          <span className="meta-font text-xs text-(--outline)">
            {pagination.total} records
          </span>
        }
      />
      <div className="p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-(--outline)"
              size={14}
            />
            <input
              aria-label="Search categories"
              value={searchInput}
              onChange={(event) => {
                const value = event.target.value;
                setSearchInput(value);
                debouncedSearch(value);
              }}
              placeholder="Search by category name..."
              className="meta-font bg-surface-2 text-foreground focus:border-primary h-9 w-full rounded-md border border-(--glass-border) pr-3 pl-9 text-xs transition outline-none placeholder:text-(--outline)"
            />
          </div>
          <div className="flex gap-2">
            <select
              aria-label="Category status"
              value={status}
              onChange={(event) => updateParam("status", event.target.value)}
              className="meta-font bg-surface-2 text-text-muted focus:border-primary h-9 min-w-36 rounded-md border border-(--glass-border) px-2.5 text-xs outline-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              type="button"
              aria-label="Reset category filters"
              onClick={() => router.push(pathname)}
              className="text-text-muted hover:border-primary hover:text-primary-soft flex h-9 w-9 items-center justify-center rounded-md border border-(--glass-border) transition"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
        <div className="meta-font mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-(--outline)">
          <span className="tracking-widest uppercase">Active filter</span>
          <span className="text-primary-soft border-primary/20 bg-primary/10 rounded border px-2 py-0.5">
            {status ? `${status} categories` : "all categories"}
          </span>
          <span>
            Showing {items.length} of {pagination.total} categories
          </span>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-primary-soft p-5 text-sm">
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
        <DataTable columns={columns} data={items} className="min-w-170" />
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
