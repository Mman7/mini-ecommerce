import {
  AlertTriangle,
  Check,
  Gauge,
  Package,
  ShoppingCart,
} from "lucide-react";
import type { DashboardOverview } from "@/src/api/dashboard.api";
import { FooterStat, Panel, SectionTitle } from "./analytics-primitives";

export function InventoryAttentionPanel({
  inventory,
  catalog,
  orderCount,
  restockTargets,
  restockingId,
  onTargetChange,
  onRestock,
}: {
  inventory: DashboardOverview["lowStock"];
  catalog: DashboardOverview["catalog"];
  orderCount: number;
  restockTargets: Record<number, number>;
  restockingId: number | null;
  onTargetChange: (productId: number, value: number) => void;
  onRestock: (
    productId: number,
    targetStock: number,
    reorderAt: number,
  ) => void;
}) {
  return (
    <Panel>
      <SectionTitle
        title="Inventory That Requires Atelier Attention"
        description="Live items exhibiting inventory or velocity signals."
        icon={
          <span className="meta-font text-primary-soft text-xs">
            Actionable suggestions ready
          </span>
        }
      />
      <div className="grid gap-3 p-5 md:grid-cols-3">
        {inventory.slice(0, 3).map((item, index) => {
          const target =
            restockTargets[item.productId] ??
            Math.max(item.stock, item.reorderAt * 3);
          return (
            <div
              key={item.productId}
              className="bg-surface-2 rounded-md border border-(--glass-border) p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`meta-font flex items-center gap-1 text-xs ${index === 0 ? "text-red-300" : "text-primary-soft"}`}
                >
                  <AlertTriangle size={12} />
                  {index === 0 ? "Critical Stock" : "Stock Attention"}
                </span>
                <span className="meta-font text-text-muted text-xs">
                  {item.stock} left
                </span>
              </div>
              <p className="text-xs font-medium">{item.name}</p>
              <p className="meta-font text-text-muted mt-1 text-xs">
                Reorder point: {item.reorderAt}
              </p>
              <label className="meta-font text-text-muted mt-3 flex items-center gap-2 text-xs">
                Target stock
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={target}
                  onChange={(event) =>
                    onTargetChange(item.productId, Number(event.target.value))
                  }
                  className="bg-surface-1 text-foreground w-16 rounded border border-(--glass-border) px-2 py-1 text-xs"
                />
              </label>
              <button
                type="button"
                disabled={restockingId === item.productId}
                onClick={() =>
                  onRestock(item.productId, target, item.reorderAt)
                }
                className="meta-font border-primary/30 text-primary-soft mt-4 rounded border px-2 py-1 text-xs disabled:opacity-50"
              >
                {restockingId === item.productId ? "Updating..." : "Restock"}
              </button>
            </div>
          );
        })}
        {!inventory.length && (
          <div className="text-text-muted col-span-full flex items-center gap-2 text-sm">
            <Gauge size={15} /> No low-stock products require attention.
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-(--glass-border) p-5 sm:grid-cols-4">
        <FooterStat
          icon={<Package size={14} />}
          label="Total atelier catalog"
          value={catalog.totalActiveProducts.toString()}
        />
        <FooterStat
          icon={<Check size={14} />}
          label="In stock & active"
          value={`${catalog.inStockProducts} in stock`}
          tone="text-emerald-400"
        />
        <FooterStat
          icon={<AlertTriangle size={14} />}
          label="Low stock warning"
          value={inventory.length.toString()}
          tone="text-primary-soft"
        />
        <FooterStat
          icon={<ShoppingCart size={14} />}
          label="Orders tracked"
          value={orderCount.toString()}
          tone="text-secondary"
        />
      </div>
    </Panel>
  );
}
