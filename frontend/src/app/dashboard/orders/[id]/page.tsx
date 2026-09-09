"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  cancelAdminOrder,
  getAdminOrder,
  updateAdminOrderStatus,
  type Order,
} from "../../../../api/order.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
  StatusPill,
} from "../../../../components/dashboard";
import { toast } from "@/components/ui/toast";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});
const transitions: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

type AdminOrder = Order & {
  user: { name: string; email: string; phoneNumber: string | null };
  deliveryAddressLine1: string;
  deliveryAddressLine2: string | null;
  deliveryCity: string;
  deliveryState: string | null;
  deliveryPostcode: string;
  deliveryCountry: string;
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getAdminOrder(params.id)
      .then((result) => {
        setOrder(result);
        setStatus(result.status);
      })
      .catch(() => setError("Unable to load this order."))
      .finally(() => setLoading(false));
  }, [params.id]);
  async function saveStatus() {
    if (!order || status === order.status) return;
    setSaving(true);
    try {
      const updated = await updateAdminOrderStatus(order.id, status);
      setOrder({ ...order, status: updated.status });
      toast.add({
        title: "Order status updated",
        description: `Order #${order.id.slice(0, 8)} is now ${updated.status}.`,
        type: "success",
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to update order.",
      );
      setStatus(order.status);
      toast.add({
        title: "Status update failed",
        description:
          cause instanceof Error ? cause.message : "Unable to update order.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }
  async function cancel() {
    if (
      !order ||
      !window.confirm("Cancel this order? Inventory will be restored.")
    )
      return;
    setSaving(true);
    try {
      const updated = await cancelAdminOrder(order.id);
      setOrder({ ...order, status: updated.status });
      setStatus(updated.status);
      toast.add({
        title: "Order cancelled",
        description: "Inventory has been restored.",
        type: "success",
      });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to cancel order.",
      );
      toast.add({
        title: "Cancellation failed",
        description:
          cause instanceof Error ? cause.message : "Unable to cancel order.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }
  if (loading)
    return (
      <>
        <div className="bg-surface-2 h-40 animate-pulse rounded-lg" />
      </>
    );
  if (!order)
    return (
      <>
        <p role="alert" className="text-secondary">
          {error || "Order not found."}
        </p>
      </>
    );
  return (
    <>
      <DashboardHeading
        eyebrow="Order operations"
        title={`Order #${order.id.slice(0, 8)}`}
        description={new Date(order.createdAt).toLocaleString()}
        action={
          <Link
            href="/dashboard/orders"
            className="meta-font text-text-muted rounded border border-(--glass-border) px-3 py-2 text-xs"
          >
            Back to Orders
          </Link>
        }
      />
      {error ? (
        <p role="alert" className="text-secondary mb-4 text-sm">
          {error}
        </p>
      ) : null}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          <DashboardPanel>
            <PanelHeading title="Ordered Products" />
            <div className="divide-y divide-(--glass-border)">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-4 py-4"
                >
                  <div>
                    <p className="text-foreground text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-text-muted text-xs">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-muted text-xs">
                      {money.format(Number(item.price))} each
                    </p>
                    <p className="text-foreground text-sm">
                      {money.format(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-(--glass-border) px-4 py-4 text-sm">
              <span className="text-text-muted">Total</span>
              <strong className="text-foreground">
                {money.format(Number(order.total))}
              </strong>
            </div>
          </DashboardPanel>
          <DashboardPanel>
            <PanelHeading title="Delivery" />
            <div className="text-text-muted space-y-1 px-4 pb-4 text-sm">
              <p className="text-foreground">{order.user.name}</p>
              <p>
                {order.deliveryAddressLine1}
                {order.deliveryAddressLine2
                  ? `, ${order.deliveryAddressLine2}`
                  : ""}
              </p>
              <p>
                {order.deliveryPostcode} {order.deliveryCity}
              </p>
              <p>
                {order.deliveryState ? `${order.deliveryState}, ` : ""}
                {order.deliveryCountry}
              </p>
            </div>
          </DashboardPanel>
        </div>
        <div className="space-y-3">
          <DashboardPanel>
            <PanelHeading title="Customer" />
            <div className="space-y-1 px-4 pb-4 text-sm">
              <p className="text-foreground">{order.user.name}</p>
              <p className="text-text-muted">{order.user.email}</p>
              {order.user.phoneNumber ? (
                <p className="text-text-muted">{order.user.phoneNumber}</p>
              ) : null}
            </div>
          </DashboardPanel>
          <DashboardPanel>
            <PanelHeading title="Status" />
            <div className="space-y-3 px-4 pb-4">
              <StatusPill status={order.status} />
              <select
                aria-label="Order status"
                disabled={saving}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="form-input w-full"
              >
                {[order.status, ...(transitions[order.status] ?? [])]
                  .filter(
                    (value, index, values) => values.indexOf(value) === index,
                  )
                  .map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                disabled={saving || status === order.status}
                onClick={saveStatus}
                className="meta-font bg-primary text-primary-foreground w-full rounded px-3 py-2 text-xs disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Status"}
              </button>
              {transitions[order.status]?.includes("CANCELLED") ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={cancel}
                  className="meta-font border-secondary/50 text-secondary w-full rounded border px-3 py-2 text-xs disabled:opacity-50"
                >
                  Cancel Order
                </button>
              ) : null}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </>
  );
}
