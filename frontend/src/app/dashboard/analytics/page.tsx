"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { DashboardHeading } from "../../../components/dashboard";
import { dashboardApi, type DashboardOverview } from "@/src/api/dashboard.api";
import { productApi } from "@/src/api/product.api";
import { AnalyticsRange } from "@/src/components/dashboard/analytics/analytics.types";
import {
  AnalyticsHeader,
  analyticsRanges,
} from "@/src/components/dashboard/analytics/analytics-header";
import { AnalyticsSummary } from "@/src/components/dashboard/analytics/analytics-summary";
import { RevenueTrendPanel } from "@/src/components/dashboard/analytics/revenue-trend-panel";
import { FulfillmentPanel } from "@/src/components/dashboard/analytics/fulfillment-panel";
import { CustomerCohortPanel } from "@/src/components/dashboard/analytics/customer-cohort-panel";
import {
  CategoryRevenuePanel,
  TopProductsPanel,
} from "@/src/components/dashboard/analytics/catalog-panels";
import { ProductPerformanceMatrix } from "@/src/components/dashboard/analytics/product-performance-matrix";
import { InventoryAttentionPanel } from "@/src/components/dashboard/analytics/inventory-attention-panel";

const currency = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

function dateRange(value: AnalyticsRange) {
  const selected = analyticsRanges.find((range) => range.value === value)!;
  const to = new Date();
  const from = new Date(to);
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - (selected.days - 1));
  return { from: from.toISOString(), to: to.toISOString() };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? "0%" : "New";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export default function DashboardAnalyticsPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [selectedRange, setSelectedRange] = useState<AnalyticsRange>("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showOrders, setShowOrders] = useState(true);
  const [onlySelling, setOnlySelling] = useState(false);
  const [restockingId, setRestockingId] = useState<number | null>(null);
  const [restockTargets, setRestockTargets] = useState<Record<number, number>>(
    {},
  );

  async function loadOverview(range: AnalyticsRange = selectedRange) {
    setLoading(true);
    setError(null);
    try {
      const dates = dateRange(range);
      setOverview(await dashboardApi.overview(dates.from, dates.to));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load analytics data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOverview("30d");
  }, []);

  const filteredProducts = useMemo(
    () =>
      (overview?.topProducts ?? []).filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) &&
          (!onlySelling || product.sold > 0),
      ),
    [onlySelling, overview?.topProducts, query],
  );
  const trend = useMemo(
    () =>
      (overview?.revenueTrend ?? []).map((point, index) => ({
        ...point,
        orders: point.orderCount,
        label: formatDate(point.date),
        index,
      })),
    [overview],
  );
  const summary = overview?.summary;
  const previous = overview?.previousSummary;
  const selectedLabel = analyticsRanges.find(
    (range) => range.value === selectedRange,
  )?.label;

  function exportCsv() {
    const rows = [
      ["Product", "Units Sold", "Revenue"],
      ...(overview?.topProducts ?? []).map((product) => [
        product.name,
        String(product.sold),
        currency.format(product.price * product.sold),
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) =>
            row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `komorebi-product-performance-${selectedRange}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function restockProduct(
    productId: number,
    targetStock: number,
    reorderAt: number,
  ) {
    if (!Number.isInteger(targetStock) || targetStock < 0) {
      setError("Restock target must be a non-negative whole number.");
      return;
    }
    setRestockingId(productId);
    try {
      await productApi.admin.updateInventory(productId, targetStock, reorderAt);
      await loadOverview();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to update inventory.",
      );
    } finally {
      setRestockingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <DashboardHeading
        eyebrow="Analytics · Live workspace"
        title="Store Performance"
        description="Understand your sales, customers, products, and overall atelier performance."
        action={
          <AnalyticsHeader
            selectedRange={selectedRange}
            onRangeChange={(range) => {
              setSelectedRange(range);
              void loadOverview(range);
            }}
            onExport={exportCsv}
          />
        }
      />
      {error && (
        <div
          role="alert"
          className="bg-surface-1 flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-sm"
        >
          <span className="text-text-muted">{error}</span>
          <button
            type="button"
            onClick={() => void loadOverview()}
            className="meta-font text-primary-soft inline-flex items-center gap-2 text-xs"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      )}
      <AnalyticsSummary
        revenue={summary?.revenue ?? 0}
        orders={summary?.orders ?? 0}
        customers={summary?.customers ?? 0}
        averageOrderValue={summary?.averageOrderValue ?? 0}
        revenueChange={percentageChange(
          summary?.revenue ?? 0,
          previous?.revenue ?? 0,
        )}
        ordersChange={percentageChange(
          summary?.orders ?? 0,
          previous?.orders ?? 0,
        )}
        averageOrderChange={percentageChange(
          summary?.averageOrderValue ?? 0,
          previous?.averageOrderValue ?? 0,
        )}
        repeatRate={overview?.cohortMetrics.repeatRate ?? 0}
        currency={currency}
      />
      <RevenueTrendPanel
        trend={trend}
        selectedLabel={selectedLabel}
        loading={loading}
        showOrders={showOrders}
        onShowOrdersChange={setShowOrders}
        currency={currency}
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <FulfillmentPanel breakdown={overview?.fulfillmentBreakdown ?? []} />
        <CustomerCohortPanel
          metrics={
            overview?.cohortMetrics ?? {
              repeatRate: 0,
              newCustomerRate: 0,
              estimatedClv: 0,
            }
          }
          currency={currency}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <CategoryRevenuePanel
          categories={overview?.categoryRevenue ?? []}
          currency={currency}
        />
        <TopProductsPanel products={filteredProducts} currency={currency} />
      </div>
      <ProductPerformanceMatrix
        products={filteredProducts}
        totalOrders={summary?.orders ?? 0}
        query={query}
        onlySelling={onlySelling}
        onQueryChange={setQuery}
        onOnlySellingChange={() => setOnlySelling((value) => !value)}
        currency={currency}
      />
      <InventoryAttentionPanel
        inventory={overview?.lowStock ?? []}
        catalog={
          overview?.catalog ?? { totalActiveProducts: 0, inStockProducts: 0 }
        }
        orderCount={summary?.orders ?? 0}
        restockTargets={restockTargets}
        restockingId={restockingId}
        onTargetChange={(productId, value) =>
          setRestockTargets((targets) => ({ ...targets, [productId]: value }))
        }
        onRestock={(productId, targetStock, reorderAt) =>
          void restockProduct(productId, targetStock, reorderAt)
        }
      />
    </div>
  );
}
