import { Panel, SectionTitle, Insight, Progress } from "./analytics-primitives";
import type { DashboardOverview } from "@/src/api/dashboard.api";

export function CustomerCohortPanel({
  metrics,
  currency,
}: {
  metrics: DashboardOverview["cohortMetrics"];
  currency: Intl.NumberFormat;
}) {
  return (
    <Panel>
      <SectionTitle
        title="Customer Cohort & Retention"
        description="Repeat patron loyalty index and customer lifetime value."
      />
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        <Insight
          title="Repeat Purchase Rate"
          value={`${metrics.repeatRate.toFixed(1)}%`}
          detail="Customers with more than one order"
          tone="text-secondary"
        />
        <Insight
          title="Estimated CLV"
          value={currency.format(metrics.estimatedClv)}
          detail="Historical spend per selected customer"
          tone="text-tertiary"
        />
        <div className="space-y-4 pt-2 sm:col-span-2">
          <Progress
            label="Returning Patrons"
            value={metrics.repeatRate}
            count="Repeat customers"
            tone="bg-secondary"
          />
          <Progress
            label="New First-Time Gifters"
            value={metrics.newCustomerRate}
            count="First-order customers"
            tone="bg-tertiary"
          />
        </div>
      </div>
    </Panel>
  );
}
