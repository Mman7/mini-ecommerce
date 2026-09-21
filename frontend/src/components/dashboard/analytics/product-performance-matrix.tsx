import { Filter, Search } from "lucide-react";
import { DEFAULT_PRODUCT_IMAGE } from "@/src/path/product_image_path";
import type { DashboardOverview } from "@/src/api/dashboard.api";
import { Panel } from "./analytics-primitives";

export function ProductPerformanceMatrix({
  products,
  totalOrders,
  query,
  onlySelling,
  onQueryChange,
  onOnlySellingChange,
  currency,
}: {
  products: DashboardOverview["topProducts"];
  totalOrders: number;
  query: string;
  onlySelling: boolean;
  onQueryChange: (query: string) => void;
  onOnlySellingChange: () => void;
  currency: Intl.NumberFormat;
}) {
  return (
    <Panel>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="heading-font text-base font-semibold">
            Product Performance Matrix
          </h2>
          <p className="meta-font text-text-muted mt-1 text-xs">
            Live product performance for the selected period.
          </p>
        </div>
        <div className="flex gap-2">
          <label className="bg-surface-2 flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-2">
            <Search size={13} className="text-text-muted" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search catalog items..."
              className="placeholder:text-text-muted/60 w-40 bg-transparent text-xs outline-none"
            />
          </label>
          <button
            type="button"
            onClick={onOnlySellingChange}
            aria-pressed={onlySelling}
            className={`bg-surface-2 flex h-8 items-center gap-2 rounded-md border px-3 text-xs ${onlySelling ? "border-primary text-primary-soft" : "text-text-muted border-(--glass-border)"}`}
          >
            <Filter size={13} />
            {onlySelling ? "Selling only" : "All products"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-155 text-left">
          <thead className="bg-surface-2 meta-font text-text-muted text-xs tracking-wider uppercase">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-3 py-3">Units Sold</th>
              <th className="px-3 py-3">Revenue</th>
              <th className="px-3 py-3">Orders</th>
              <th className="px-5 py-3">Order Share</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.productId}
                className="border-t border-(--glass-border) text-xs"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image?.url || DEFAULT_PRODUCT_IMAGE}
                      alt=""
                      className="h-8 w-8 rounded object-cover"
                    />
                    <p className="font-medium">{product.name}</p>
                  </div>
                </td>
                <td className="px-3 py-3">{product.sold}</td>
                <td className="text-primary-soft px-3 py-3">
                  {currency.format(product.revenue)}
                </td>
                <td className="px-3 py-3">{product.orderCount}</td>
                <td className="px-5 py-3 text-emerald-400">
                  {totalOrders
                    ? ((product.orderCount / totalOrders) * 100).toFixed(1)
                    : "0.0"}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && (
          <p className="text-text-muted p-5 text-sm">
            No performance rows available.
          </p>
        )}
      </div>
    </Panel>
  );
}
