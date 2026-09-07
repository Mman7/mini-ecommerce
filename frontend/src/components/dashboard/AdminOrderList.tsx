"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminOrders,
  type AdminOrderListResponse,
} from "../../api/order.api";
import { DashboardPanel, PanelHeading, StatusPill, TableAction } from "./index";

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead className="meta-font bg-surface-2/60 text-xs text-(--outline) uppercase">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Date</th>
                <th className="py-3">Items</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((order) => (
                <tr key={order.id} className="border-t border-(--glass-border)">
                  <td className="text-text-muted px-4 py-3 text-xs">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="text-foreground py-3 text-sm">
                    {order.user.name}
                    <span className="block text-xs text-(--outline)">
                      {order.user.email}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-(--outline)">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-text-muted py-3 text-xs">
                    {order.itemCount}
                  </td>
                  <td className="text-text-muted py-3 text-xs">
                    {money.format(order.total)}
                  </td>
                  <td className="py-3">
                    <StatusPill status={order.status} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end">
                      <TableAction
                        label={`View order ${order.id}`}
                        href={`/dashboard/orders/${order.id}`}
                      />
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
