"use client";

import { Activity, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { orderApi, type AdminOrderListResponse } from "../../api/order.api";
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
  const query = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const page = Number(searchParams.get("page") ?? 1);

  const orderQuery = useQuery({
    queryKey: ["admin-orders", { page, query, status }],
    queryFn: () =>
      orderApi.admin.list({ page, limit: 20, search: query, status }),
  });
  const data = orderQuery.data;
  const loading = orderQuery.isPending;
  const error = orderQuery.error
    ? "Unable to load orders. Please try again."
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

  const columns: ColumnDef<AdminOrderListResponse["items"][number]>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/orders/${row.original.id}`}
          className="text-text-muted hover:text-primary! text-xs transition-colors"
        >
          #{row.original.id.slice(0, 8)}
        </Link>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="text-foreground text-sm">
          <Link
            href={`/dashboard/customers/${row.original.user.userId}`}
            className="hover:text-primary-soft! transition-colors"
          >
            {row.original.user.name}
          </Link>
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
    <DashboardPanel className="mt-4 overflow-hidden">
      <PanelHeading
        title="Order registry"
        titleClassName="text-base sm:text-lg"
        action={
          <span className="meta-font text-xs text-(--outline)">
            {data?.pagination.total ?? 0} records
          </span>
        }
      />
      <div className="p-4">
        <div className="flex flex-col gap-2.5 xl:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-(--outline)"
              size={14}
            />
            <input
              aria-label="Search orders"
              value={query}
              onChange={(event) => updateParam("search", event.target.value)}
              placeholder="Search by order ID, customer name, or email..."
              className="meta-font bg-surface-2 text-foreground focus:border-primary h-9 w-full rounded-md border border-(--glass-border) pr-3 pl-9 text-xs transition outline-none placeholder:text-(--outline)"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              aria-label="Order status"
              value={status}
              onChange={(event) => updateParam("status", event.target.value)}
              className="meta-font bg-surface-2 text-text-muted focus:border-primary h-9 min-w-36 rounded-md border border-(--glass-border) px-2.5 text-xs outline-none"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              type="button"
              aria-label="Reset order filters"
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
            {status ? `${status.toLowerCase()} orders` : "all orders"}
          </span>
          <span>
            Showing {data?.items.length ?? 0} of {data?.pagination.total ?? 0}{" "}
            orders
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
      ) : !data?.items.length ? (
        <div className="text-text-muted p-8 text-center text-sm">
          No orders found.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data.items}
          className="min-w-190 "
        />
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
