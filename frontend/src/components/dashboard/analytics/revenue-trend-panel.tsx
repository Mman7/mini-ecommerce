import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Panel, SectionTitle } from "./analytics-primitives";
import type { AnalyticsTrendPoint } from "./analytics.types";

export function RevenueTrendPanel({
  trend,
  selectedLabel,
  loading,
  showOrders,
  onShowOrdersChange,
  currency,
}: {
  trend: AnalyticsTrendPoint[];
  selectedLabel?: string;
  loading: boolean;
  showOrders: boolean;
  onShowOrdersChange: (show: boolean) => void;
  currency: Intl.NumberFormat;
}) {
  return (
    <Panel>
      <SectionTitle
        title="Revenue & Velocity Stream"
        description="Daily aggregated gross receipts contrasted with order volumes."
        icon={
          <span className="meta-font border-primary/30 bg-primary/10 text-primary-soft rounded-full border px-2 py-0.5 text-xs">
            {selectedLabel}
          </span>
        }
      />
      <div className="flex flex-wrap items-center justify-end gap-2 px-5 pt-4">
        <button
          type="button"
          onClick={() => onShowOrdersChange(false)}
          className={`meta-font rounded-md border px-3 py-1.5 text-xs ${!showOrders ? "border-primary/40 bg-primary/10 text-primary-soft" : "text-text-muted border-(--glass-border)"}`}
        >
          <span className="bg-primary mr-2 inline-block h-2 w-2 rounded-full" />
          Revenue (RM)
        </button>
        <button
          type="button"
          onClick={() => onShowOrdersChange(true)}
          className={`meta-font rounded-md border px-3 py-1.5 text-xs ${showOrders ? "border-tertiary/40 bg-tertiary/10 text-tertiary" : "text-text-muted border-(--glass-border)"}`}
        >
          <span className="bg-tertiary mr-2 inline-block h-2 w-2 rounded-full" />
          Orders Overlay
        </button>
      </div>
      <div className="h-72 w-full p-4">
        {loading ? (
          <div className="bg-surface-3 h-full animate-pulse rounded-md" />
        ) : trend.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trend}
              margin={{ left: 0, right: 8, top: 10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="var(--glass-border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--outline)" }}
                minTickGap={28}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-3)",
                  border: "1px solid var(--primary-soft)",
                  borderRadius: 8,
                  color: "var(--foreground)",
                }}
                formatter={(value, name) => [
                  name === "amount" ? currency.format(Number(value)) : value,
                  name === "amount" ? "Revenue" : "Orders",
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--primary)"
                dot={false}
                fill="var(--primary)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="var(--tertiary)"
                strokeDasharray={showOrders ? "4 4" : "0 1000"}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-text-muted flex h-full items-center justify-center text-sm">
            No revenue data available for this period.
          </div>
        )}
      </div>
    </Panel>
  );
}
