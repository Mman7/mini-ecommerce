import { BarChart3 } from "lucide-react";
import { DEFAULT_PRODUCT_IMAGE } from "@/src/path/product_image_path";
import type { DashboardOverview } from "@/src/api/dashboard.api";
import { Panel, SectionTitle } from "./analytics-primitives";

export function CategoryRevenuePanel({
  categories,
  currency,
}: {
  categories: DashboardOverview["categoryRevenue"];
  currency: Intl.NumberFormat;
}) {
  return (
    <Panel>
      <SectionTitle
        title="Category Revenue Share"
        description="Revenue attributed to products in each category."
        icon={<BarChart3 size={15} className="text-text-muted" />}
      />
      <div className="space-y-4 p-5">
        {categories.map((category, index) => (
          <div key={category.categoryId}>
            <div className="meta-font mb-1 flex justify-between text-xs">
              <span>{category.name}</span>
              <strong className="text-primary-soft">
                {currency.format(category.revenue)} (
                {category.percentage.toFixed(0)}%)
              </strong>
            </div>
            <div className="bg-surface-3 h-2 rounded-full">
              <div
                className={`${index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-tertiary" : "bg-secondary"} h-full rounded-full`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
        {!categories.length && (
          <p className="text-text-muted text-sm">
            No categorized revenue in this period.
          </p>
        )}
      </div>
    </Panel>
  );
}

export function TopProductsPanel({
  products,
  currency,
}: {
  products: DashboardOverview["topProducts"];
  currency: Intl.NumberFormat;
}) {
  return (
    <Panel>
      <SectionTitle
        title="Top Selling Masterpieces"
        description="Highest revenue generators in the selected period."
      />
      <div className="space-y-2 p-5">
        {products.slice(0, 3).map((product) => (
          <div
            key={product.productId}
            className="bg-surface-3 flex items-center gap-3 rounded-md p-2 px-6 py-3 pr-10"
          >
            <img
              src={product.image?.url || DEFAULT_PRODUCT_IMAGE}
              alt={product.image?.altText || product.name}
              className="h-10 w-10 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{product.name}</p>
              <p className="meta-font text-text-muted text-xs">
                {product.sold} units sold
              </p>
            </div>
            <strong className="text-primary-soft text-xs">
              {currency.format(product.revenue)}
            </strong>
          </div>
        ))}
        {!products.length && (
          <p className="text-text-muted py-5 text-sm">
            No products match this period.
          </p>
        )}
      </div>
    </Panel>
  );
}
