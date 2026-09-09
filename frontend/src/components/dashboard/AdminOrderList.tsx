"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminOrders,
  type AdminOrderListResponse,
} from "../../api/order.api";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DashboardPanel,
  DataTable,
  PanelHeading,
  StatusPill,
  TableAction,
} from "./index";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

export function AdminOrderList({
  onStatisticsChange,
}: {
  onStatisticsChange: (
    statistics: AdminOrderListResponse["statistics"],
  ) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<AdminOrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAdminOrders({ page, limit: 20, search: query, status })
      .then((result) => {
        if (active) {
          setData(result);
          onStatisticsChange(result.statistics);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Unable to load orders. Please try again.");
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

  const columns: ColumnDef<AdminOrderListResponse["items"][number]>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="text-text-muted text-xs">
          #{row.original.id.slice(0, 8)}
        </span>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="text-foreground text-sm">
          {row.original.user.name}
          <span className="block text-xs text-(--outline)">
            {row.original.user.email}
          </span>
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-(--outline)">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "itemCount",
      header: "Items",
      cell: ({ row }) => (
        <span className="text-text-muted text-xs">
          {row.original.itemCount}
        </span>
      ),
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-text-muted text-xs">
          {money.format(row.original.total)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusPill status={row.original.status} />,
    },
    {
      id: "actions",
      header: () => <span className="block text-right">Action</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <TableAction
            label={`View order ${row.original.id}`}
            href={`/dashboard/orders/${row.original.id}`}
          />
        </div>
      ),
    },
  ];

  return (
    <DashboardPanel className="mt-3">
      <PanelHeading
        title="All Orders"
        action={
          <div className="flex gap-2">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-(--outline)"
                size={13}
              />
              <input
                aria-label="Search orders"
                value={query}
                onChange={(event) => updateParam("search", event.target.value)}
                placeholder="Search orders..."
                className="meta-font bg-surface-2 text-foreground h-7 w-44 rounded border border-(--glass-border) pl-8 text-xs outline-none"
              />
            </div>
            <select
              aria-label="Order status"
              value={status}
              onChange={(event) => updateParam("status", event.target.value)}
              className="meta-font bg-surface-2 text-text-muted h-7 rounded border border-(--glass-border) px-2 text-xs"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
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
      ) : !data?.items.length ? (
        <div className="text-text-muted p-8 text-center text-sm">
          No orders found.
        </div>
      ) : (
        <DataTable columns={columns} data={data.items} className="min-w-190" />
      )}
      <div className="meta-font flex items-center justify-between border-t border-(--glass-border) px-4 py-3 text-xs text-(--outline)">
        <span>
          Showing {data?.items.length ?? 0} of {data?.pagination.total ?? 0}{" "}
          orders
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
