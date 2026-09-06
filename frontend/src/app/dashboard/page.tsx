"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  CalendarDays,
  CircleDollarSign,
  Package,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  getDashboardOverview,
  type DashboardOverview,
} from "@/src/api/dashboard.api";
import { useGlobalStore } from "@/src/store/global.store";
import {
  DashboardHeading,
  DashboardPanel,
  DashboardShell,
  PanelHeading,
  StatCard,
  StatusPill,
} from "../../components/dashboard";

const chartConfig = {
  amount: { label: "Revenue", color: "#ffb77a" },
} satisfies ChartConfig;

const currency = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ImageThumb({
  src,
  alt,
  size,
}: {
  src?: string;
  alt: string;
  size: string;
}) {
  return src ? (
    <img
      src={src}
      alt={alt}
      className={`${size} shrink-0 rounded object-cover`}
    />
  ) : (
    <div
      className={`bg-surface-3 ${size} shrink-0 rounded`}
      aria-hidden="true"
    />
  );
}

export default function DashboardPage() {
  const user = useGlobalStore((state) => state.user);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadOverview() {
    setLoading(true);
    setError(false);
    try {
      setOverview(await getDashboardOverview());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview();
  }, []);

  const summary = overview?.summary;
  const today = new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <DashboardShell activeSection="overview">
      <DashboardHeading
        eyebrow={today}
        title="Overview"
        description={`Welcome back, ${user?.name ?? "Admin"}. Here is what is happening with your atelier today.`}
        action={
          <div className="meta-font bg-surface-1 text-text-muted flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs">
            <CalendarDays size={13} />
            Last 7 days
          </div>
        }
      />

      {error && (
        <div
          role="alert"
          className="border-error/20 bg-surface-1 mb-4 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm"
        >
          <span className="text-text-muted">
            Unable to load dashboard data.
          </span>
          <button
            type="button"
            onClick={() => void loadOverview()}
            className="meta-font text-primary inline-flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={summary ? currency.format(summary.revenue) : "--"}
          detail={loading ? "Loading" : "Selected period"}
          icon={<CircleDollarSign />}
        />
        <StatCard
          label="Orders"
          value={summary ? summary.orders.toLocaleString() : "--"}
          detail={loading ? "Loading" : "Selected period"}
          accent="pink"
          icon={<ShoppingCart />}
        />
        <StatCard
          label="Customers"
          value={summary ? summary.customers.toLocaleString() : "--"}
          detail={loading ? "Loading" : "New in period"}
          accent="cyan"
          icon={<Users />}
        />
        <StatCard
          label="Avg. Order Value"
          value={summary ? currency.format(summary.averageOrderValue) : "--"}
          detail={loading ? "Loading" : "Selected period"}
          icon={<Sparkles />}
        />
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)]">
        <DashboardPanel>
          <PanelHeading
            title="Revenue Overview"
            action={
              <span className="meta-font text-text-muted text-xs">
                Last 7 days
              </span>
            }
          />
          {loading ? (
            <div className="bg-surface-3 m-4 h-52 animate-pulse rounded" />
          ) : overview?.revenueTrend.length ? (
            <ChartContainer
              config={chartConfig}
              className="min-h-52 w-full p-4"
            >
              <AreaChart
                accessibilityLayer
                data={overview.revenueTrend}
                margin={{ left: 4, right: 8, top: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(230,225,228,0.1)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(5)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => currency.format(Number(value))}
                    />
                  }
                />
                <Area
                  dataKey="amount"
                  type="monotone"
                  fill="var(--color-amount)"
                  fillOpacity={0.18}
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <PanelEmpty
              icon={<CircleDollarSign size={18} />}
              text="No revenue data available"
            />
          )}
        </DashboardPanel>

        <DashboardPanel>
          <PanelHeading
            title="Top Selling Products"
            action={
              <Link
                href="/dashboard/products"
                className="meta-font text-primary text-xs"
              >
                View all
              </Link>
            }
          />
          <div className="divide-y divide-(--glass-border) px-4">
            {loading ? (
              <RowsSkeleton count={4} />
            ) : overview?.topProducts.length ? (
              overview.topProducts.map((product, index) => (
                <Link
                  href={`/dashboard/products/${product.productId}/edit`}
                  key={product.productId}
                  className="hover:bg-surface-2 flex items-center gap-3 py-3 transition"
                >
                  <span className="meta-font w-3 text-xs text-(--outline)">
                    {index + 1}
                  </span>
                  <ImageThumb
                    src={product.image?.url}
                    alt={product.image?.altText ?? product.name}
                    size="h-9 w-9"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block truncate text-sm">
                      {product.name}
                    </span>
                    <span className="meta-font text-text-muted text-xs">
                      {product.sold} sold
                    </span>
                  </span>
                  <span className="meta-font text-text-muted text-xs">
                    {currency.format(product.price)}
                  </span>
                </Link>
              ))
            ) : (
              <PanelEmpty
                icon={<Package size={18} />}
                text="No sales data yet"
              />
            )}
          </div>
        </DashboardPanel>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)]">
        <DashboardPanel>
          <PanelHeading
            title="Recent Orders"
            action={
              <Link
                href="/dashboard/orders"
                className="meta-font text-primary text-xs"
              >
                View all
              </Link>
            }
          />
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-4">
                <RowsSkeleton count={3} />
              </div>
            ) : overview?.recentOrders.length ? (
              <table className="w-full min-w-140 text-left">
                <thead className="meta-font text-xs tracking-[0.08em] text-(--outline) uppercase">
                  <tr className="border-b border-(--glass-border)">
                    <th className="px-4 py-2 font-medium">Order ID</th>
                    <th className="py-2 font-medium">Customer</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Amount</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-(--glass-border) last:border-0"
                    >
                      <td className="meta-font text-text-muted px-4 py-3 text-xs">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="text-foreground py-3 text-sm">
                        {order.customer}
                      </td>
                      <td className="meta-font py-3 text-xs text-(--outline)">
                        {formatDate(order.date)}
                      </td>
                      <td className="meta-font text-text-muted py-3 text-xs">
                        {currency.format(order.total)}
                      </td>
                      <td className="py-3">
                        <StatusPill status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <PanelEmpty
                icon={<ShoppingCart size={18} />}
                text="No orders yet"
              />
            )}
          </div>
        </DashboardPanel>

        <DashboardPanel>
          <PanelHeading
            title="Low Stock Alerts"
            action={
              <Link
                href="/dashboard/products"
                className="meta-font text-primary text-xs"
              >
                View all
              </Link>
            }
          />
          <div className="divide-y divide-(--glass-border) px-4">
            {loading ? (
              <RowsSkeleton count={3} />
            ) : overview?.lowStock.length ? (
              overview.lowStock.map((product) => (
                <Link
                  href={`/dashboard/products/${product.productId}/edit`}
                  key={product.productId}
                  className="hover:bg-surface-2 flex items-center gap-3 py-3 transition"
                >
                  <ImageThumb
                    src={product.image?.url}
                    alt={product.image?.altText ?? product.name}
                    size="h-8 w-8"
                  />
                  <span className="text-foreground min-w-0 flex-1 truncate text-sm">
                    {product.name}
                  </span>
                  <span className="meta-font text-secondary shrink-0 text-xs">
                    Stock: {product.stock}
                  </span>
                </Link>
              ))
            ) : (
              <PanelEmpty
                icon={<Package size={18} />}
                text="Inventory looks healthy"
              />
            )}
          </div>
        </DashboardPanel>
      </div>
    </DashboardShell>
  );
}

function RowsSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 py-3">
          <div className="bg-surface-3 h-9 w-9 animate-pulse rounded" />
          <div className="bg-surface-3 h-3 flex-1 animate-pulse rounded" />
          <div className="bg-surface-3 h-3 w-12 animate-pulse rounded" />
        </div>
      ))}
    </>
  );
}

function PanelEmpty({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="text-text-muted flex min-h-52 flex-col items-center justify-center gap-3 px-4 text-center text-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}
