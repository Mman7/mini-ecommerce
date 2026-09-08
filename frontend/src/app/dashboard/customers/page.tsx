"use client";

import {
  Download,
  Crown,
  Repeat2,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  exportAdminCustomers,
  getAdminCustomers,
  type CustomerListResponse,
} from "../../../api/customer.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
  StatCard,
  StatusPill,
  TableAction,
} from "../../../components/dashboard";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});
const sortValues = [
  "newest",
  "oldest",
  "nameAsc",
  "nameDesc",
  "orders",
  "spending",
  "latestOrder",
] as const;
const statusValues = ["regular", "vip", "inactive"] as const;
type SortValue = (typeof sortValues)[number];
type StatusValue = (typeof statusValues)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function DashboardCustomersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<CustomerListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Number(searchParams.get("page") ?? 1);

  useEffect(() => {
    let active = true;
    getAdminCustomers({
      page,
      limit: 20,
      search,
      status: statusValues.includes(status as StatusValue)
        ? (status as StatusValue)
        : undefined,
      sort: sortValues.includes(sort as SortValue)
        ? (sort as SortValue)
        : "newest",
    })
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Unable to load customers. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, search, status, sort]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  async function exportCustomers() {
    setExporting(true);
    try {
      const blob = await exportAdminCustomers({
        search,
        status: statusValues.includes(status as StatusValue)
          ? (status as StatusValue)
          : undefined,
        sort: sortValues.includes(sort as SortValue)
          ? (sort as SortValue)
          : "newest",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "customers.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Unable to export customers. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  const stats = data?.stats;
  return (
    <>
      <DashboardHeading
        eyebrow="Your community"
        title="Customers"
        description="Manage your lovely collectors and understand who visits the atelier."
        action={
          <button
            type="button"
            onClick={exportCustomers}
            disabled={exporting}
            className="meta-font text-text-muted hover:border-primary hover:text-primary-soft flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs disabled:opacity-50"
          >
            <Download size={13} /> {exporting ? "Exporting..." : "Export"}
          </button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Customers"
          value={String(stats?.total ?? 0)}
          detail="All registered customers"
          icon={<Users />}
        />
        <StatCard
          label="New Customers"
          value={String(stats?.newThisMonth ?? 0)}
          detail={`${stats?.newGrowth && stats.newGrowth > 0 ? "+" : ""}${(stats?.newGrowth ?? 0).toFixed(1)}% this month`}
          accent="pink"
          icon={<UserPlus />}
        />
        <StatCard
          label="Repeat Customers"
          value={String(stats?.repeat ?? 0)}
          detail={`${(stats?.repeatRate ?? 0).toFixed(1)}% of total`}
          accent="cyan"
          icon={<Repeat2 />}
        />
        <StatCard
          label="VIP Customers"
          value={String(stats?.vip ?? 0)}
          detail={`${(stats?.vipRate ?? 0).toFixed(1)}% of total`}
          icon={<Crown />}
        />
      </div>
      <DashboardPanel className="mt-3">
        <PanelHeading
          title="All Customers"
          action={
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-2.5 -translate-y-1/2 text-(--outline)"
                  size={13}
                />
                <input
                  aria-label="Search customers"
                  value={search}
                  onChange={(event) =>
                    updateParam("search", event.target.value)
                  }
                  placeholder="Search customers..."
                  className="meta-font bg-surface-2 text-foreground h-7 w-44 rounded border border-(--glass-border) pl-8 text-xs outline-none"
                />
              </div>
              <select
                aria-label="Customer status"
                value={status}
                onChange={(event) => updateParam("status", event.target.value)}
                className="meta-font bg-surface-2 text-text-muted h-7 rounded border border-(--glass-border) px-2 text-xs"
              >
                <option value="">All Status</option>
                <option value="regular">Regular</option>
                <option value="vip">VIP</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                aria-label="Customer sort"
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="meta-font bg-surface-2 text-text-muted h-7 rounded border border-(--glass-border) px-2 text-xs"
              >
                <option value="newest">Newest Customers</option>
                <option value="oldest">Oldest Customers</option>
                <option value="nameAsc">Name A-Z</option>
                <option value="nameDesc">Name Z-A</option>
                <option value="orders">Most Orders</option>
                <option value="spending">Highest Spending</option>
                <option value="latestOrder">Latest Order</option>
              </select>
              <button
                type="button"
                onClick={exportCustomers}
                disabled={exporting}
                className="meta-font text-text-muted hover:border-primary flex h-7 items-center gap-1.5 rounded border border-(--glass-border) px-2 text-xs disabled:opacity-50"
              >
                <Download size={12} /> Export
              </button>
            </div>
          }
        />
        {error ? (
          <p role="alert" className="text-secondary p-5 text-sm">
            {error}
          </p>
        ) : loading ? (
          <div aria-busy="true" className="space-y-3 p-5">
            <div className="bg-surface-2 h-8 animate-pulse rounded" />
            <div className="bg-surface-2 h-8 animate-pulse rounded" />
            <div className="bg-surface-2 h-8 animate-pulse rounded" />
          </div>
        ) : !data?.items.length ? (
          <div className="text-text-muted p-8 text-center text-sm">
            <p>
              {search || status ? "No customers found." : "No customers yet."}
            </p>
            <p className="mt-1 text-xs">
              {search || status
                ? "Try adjusting your search or filters."
                : "Customers will appear here when they create an account."}
            </p>
            {search || status ? (
              <button
                type="button"
                onClick={() => router.push(pathname)}
                className="text-primary-soft mt-3 text-xs underline"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead className="meta-font bg-surface-2/60 text-xs tracking-[0.08em] text-(--outline) uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="py-3 font-medium">Email</th>
                  <th className="py-3 font-medium">Orders</th>
                  <th className="py-3 font-medium">Total Spent</th>
                  <th className="py-3 font-medium">Last Order</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 pr-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((customer) => (
                  <tr
                    key={customer.userId}
                    className="border-t border-(--glass-border)"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                        >
                          {initials(customer.name)}
                        </span>
                        <Link
                          href={`/dashboard/customers/${customer.userId}`}
                          className="text-foreground hover:text-primary-soft text-sm"
                        >
                          {customer.name}
                        </Link>
                      </div>
                    </td>
                    <td className="meta-font py-2.5 text-xs text-(--outline)">
                      {customer.email}
                    </td>
                    <td className="meta-font text-text-muted py-2.5 text-xs">
                      {customer.orders}
                    </td>
                    <td className="meta-font text-text-muted py-2.5 text-xs">
                      {money.format(customer.totalSpent)}
                    </td>
                    <td className="meta-font py-2.5 text-xs text-(--outline)">
                      {customer.lastOrder
                        ? new Date(customer.lastOrder).toLocaleDateString()
                        : "No orders"}
                    </td>
                    <td className="py-2.5">
                      <StatusPill status={customer.status} />
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex justify-end">
                        <TableAction
                          label={`View customer ${customer.name}`}
                          href={`/dashboard/customers/${customer.userId}`}
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
            customers
          </span>
          <div className="flex gap-1">
            {Array.from(
              { length: Math.min(data?.pagination.totalPages ?? 0, 8) },
              (_, index) => index + 1,
            ).map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Go to page ${value}`}
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
    </>
  );
}
