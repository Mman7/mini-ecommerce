import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Panel, SectionTitle } from "./analytics-primitives";
import type { DashboardOverview } from "@/src/api/dashboard.api";

export const fulfillmentChartConfig = {
  count: { label: "Orders" },
  DELIVERED: { label: "Delivered", color: "var(--chart-1)" },
  PROCESSING: { label: "Processing", color: "var(--chart-2)" },
  SHIPPED: { label: "Shipped", color: "var(--chart-3)" },
  PENDING: { label: "Pending", color: "var(--chart-4)" },
  PAID: { label: "Paid", color: "var(--chart-5)" },
  CANCELLED: { label: "Cancelled", color: "var(--foreground)" },
} satisfies ChartConfig;

export function FulfillmentPanel({
  breakdown,
}: {
  breakdown: DashboardOverview["fulfillmentBreakdown"];
}) {
  const data = breakdown
    .filter((item) => item.count > 0)
    .map((item) => ({
      status: item.status,
      count: item.count,
      fill: `var(--color-${item.status})`,
    }));
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <Panel>
      <SectionTitle
        title="Order Fulfillment Lifecycle"
        description="Distribution across orders in the selected period."
      />
      <div className="flex flex-col items-center gap-6 p-5 sm:flex-row sm:items-center">
        <ChartContainer
          config={fulfillmentChartConfig}
          className="aspect-square h-40 w-40 shrink-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={48}
              outerRadius={68}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox && "cy" in viewBox ? (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {total.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 18}
                        className="fill-muted-foreground text-xs"
                      >
                        Orders
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="w-full space-y-2">
          {breakdown
            .filter((item) => item.count > 0)
            .map((item) => {
              const chartEntry =
                fulfillmentChartConfig[
                  item.status as keyof typeof fulfillmentChartConfig
                ];
              const chartColor =
                chartEntry && "color" in chartEntry
                  ? chartEntry.color
                  : undefined;
              return (
                <div
                  key={item.status}
                  className="bg-surface-2 flex items-center justify-between rounded-md border border-(--glass-border) px-3 py-2 text-xs"
                >
                  <span className="flex items-center gap-2">
                    <i
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: chartColor }}
                    />
                    {item.status} ({item.percentage.toFixed(0)}%)
                  </span>
                  <strong>{item.count} orders</strong>
                </div>
              );
            })}
        </div>
      </div>
    </Panel>
  );
}
