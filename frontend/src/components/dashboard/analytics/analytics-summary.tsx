import { CircleDollarSign, ShoppingCart, Sparkles, Users } from "lucide-react";
import { DashboardPanel } from "../index";
import { LedgerStat, MetricCard } from "./analytics-primitives";

export function AnalyticsSummary({
  revenue,
  orders,
  customers,
  averageOrderValue,
  revenueChange,
  ordersChange,
  averageOrderChange,
  repeatRate,
  currency,
}: {
  revenue: number;
  orders: number;
  customers: number;
  averageOrderValue: number;
  revenueChange: string;
  ordersChange: string;
  averageOrderChange: string;
  repeatRate: number;
  currency: Intl.NumberFormat;
}) {
  return (
    <>
      <DashboardPanel className="bg-surface-2 overflow-hidden">
        <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-surface-3 text-primary-soft flex h-10 w-10 items-center justify-center rounded-lg">
              <CircleDollarSign size={18} />
            </span>
            <div>
              <p className="meta-font text-text-muted text-xs tracking-wider uppercase">
                Accounting ledger reconciliation
              </p>
              <p className="text-foreground text-sm font-semibold">
                Selected-period revenue flow
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <LedgerStat
              label="Recorded Revenue"
              value={currency.format(revenue)}
            />
            <LedgerStat
              label="Qualifying Orders"
              value={orders.toLocaleString()}
            />
            <LedgerStat
              label="Average Order"
              value={currency.format(averageOrderValue)}
              tone="text-tertiary"
            />
            <LedgerStat
              label="Period Change"
              value={revenueChange}
              tone="text-primary-soft"
            />
          </div>
        </div>
      </DashboardPanel>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={currency.format(revenue)}
          detail={`${revenueChange} vs previous period`}
          icon={<CircleDollarSign size={16} />}
        />
        <MetricCard
          label="Total Orders"
          value={orders.toLocaleString()}
          detail={`${ordersChange} vs previous period`}
          icon={<ShoppingCart size={16} />}
          tone="cyan"
        />
        <MetricCard
          label="Average Order Value"
          value={currency.format(averageOrderValue)}
          detail={`${averageOrderChange} vs previous period`}
          icon={<Sparkles size={16} />}
          tone="pink"
        />
        <MetricCard
          label="Period Customers"
          value={customers.toLocaleString()}
          detail={`${repeatRate.toFixed(1)}% repeat customers`}
          icon={<Users size={16} />}
          tone="green"
        />
      </div>
    </>
  );
}
