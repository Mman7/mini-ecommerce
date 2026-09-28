"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ClipboardCheck,
  ExternalLink,
  FileText,
  MapPin,
  Package,
  RotateCcw,
  RefreshCw,
  Truck,
} from "lucide-react";
import { orderApi } from "../../../../api/order.api";
import {
  DashboardPanel,
  PanelHeading,
  StatusPill,
} from "../../../../components/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "../../../../components/reui/stepper";
import { toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/src/components/ui/ConfirmDialog";
import { yenCurrency as money } from "../../../../lib/currency";
const transitions: Record<string, string[]> = {
  PENDING: ["PAID"],
  PAID: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
};
type AdminOrder = Awaited<ReturnType<typeof orderApi.admin.get>>;
type ConfirmationAction = "cancel" | "approve" | "reject" | "refund";
const stages = [
  ["PENDING", "Order Placed", "Order received"],
  ["PAID", "Payment Settled", "Payment confirmed"],
  ["PROCESSING", "Processing & Wrap", "Atelier station"],
  ["SHIPPED", "Courier Handover", "Pending carrier"],
  ["DELIVERED", "Recipient Arrival", "Final destination"],
] as const;

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction | null>(null);

  useEffect(() => {
    orderApi.admin
      .get(params.id)
      .then((result) => {
        setOrder(result);
        setStatus(result.status);
      })
      .catch(() => setError("Unable to load this order."))
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  async function refreshOrder() {
    setLoading(true);
    setError("");
    try {
      const result = await orderApi.admin.get(params.id);
      setOrder(result);
      setStatus(result.status);
    } catch {
      setError("Unable to refresh this order.");
    } finally {
      setLoading(false);
    }
  }

  async function saveStatus() {
    if (!order || status === order.status) return;
    if (status === "REFUNDED") {
      setConfirmationAction("refund");
      return;
    }
    setSaving(true);
    try {
      const updated = await orderApi.admin.updateStatus(order.id, status);
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
    if (!order) return;
    setSaving(true);
    try {
      const result = await orderApi.admin.cancel(order.id);
      const updated = await orderApi.admin.get(order.id);
      setOrder(updated);
      setStatus(updated.status);
      toast.add({
        title: "Order cancelled",
        description:
          result.refundStatus === "succeeded"
            ? "Inventory was restored and the full Stripe refund completed."
            : result.refundStatus
              ? `Inventory was restored. Stripe refund status: ${result.refundStatus}.`
              : "Inventory was restored. No captured Stripe payment needed a refund.",
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

  async function approveCancellationRequest() {
    if (!order?.cancellationRequestedAt) return;
    setSaving(true);
    try {
      const result = await orderApi.admin.approveCancellationRequest(order.id);
      const updated = await orderApi.admin.get(order.id);
      setOrder(updated);
      setStatus(updated.status);
      toast.add({
        title: "Cancellation approved",
        description:
          result.refundStatus === "succeeded"
            ? "The order was cancelled and fully refunded."
            : result.refundStatus
              ? `The order was cancelled. Stripe refund status: ${result.refundStatus}.`
              : "The order was cancelled and inventory was restored.",
        type: "success",
      });
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Unable to approve cancellation request.";
      setError(message);
      toast.add({
        title: "Cancellation approval failed",
        description: message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function rejectCancellationRequest() {
    if (!order?.cancellationRequestedAt) return;
    setSaving(true);
    try {
      await orderApi.admin.rejectCancellationRequest(order.id);
      const updated = await orderApi.admin.get(order.id);
      setOrder(updated);
      toast.add({
        title: "Cancellation request rejected",
        description: "The order remains active.",
        type: "success",
      });
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Unable to reject cancellation request.";
      setError(message);
      toast.add({
        title: "Request rejection failed",
        description: message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  async function refund() {
    if (!order) return;
    setSaving(true);
    try {
      const result = await orderApi.admin.refund(order.id);
      if (result.status === "succeeded") {
        const updated = await orderApi.admin.get(order.id);
        setOrder(updated);
        setStatus(updated.status);
      }
      toast.add({
        title: result.alreadyRefunded
          ? "Order already refunded"
          : "Refund submitted",
        description:
          result.status === "succeeded"
            ? `Order #${order.id.slice(0, 8)} has been fully refunded.`
            : "Stripe is processing the refund. The order status will update when confirmed.",
        type: "success",
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Unable to refund order.";
      setStatus(order.status);
      setError(message);
      toast.add({
        title: "Refund failed",
        description: message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className="bg-surface-2 h-64 animate-pulse rounded-xl" />;
  if (!order)
    return (
      <p role="alert" className="text-primary-soft">
        {error || "Order not found."}
      </p>
    );

  const currentStage = Math.max(
    0,
    stages.findIndex(([stage]) => stage === order.status),
  );
  const isTerminalStatus =
    order.status === "CANCELLED" || order.status === "REFUNDED";
  const canRefund =
    Boolean(order.stripePaymentIntentId) &&
    order.status !== "PENDING" &&
    order.status !== "REFUNDED";
  const canCancel = ["PENDING", "PAID", "PROCESSING"].includes(order.status);
  const orderCode = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
  const address = [
    order.deliveryAddressLine1,
    order.deliveryAddressLine2,
    `${order.deliveryPostcode} ${order.deliveryCity}`,
    order.deliveryState,
    order.deliveryCountry,
  ]
    .filter(Boolean)
    .join(", ");
  const availableStatuses = [
    order.status,
    ...(transitions[order.status] ?? []),
  ].filter((value, index, values) => values.indexOf(value) === index);
  const itemsSubtotal = order.orderItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/orders"
          className="meta-font text-text-muted hover:text-primary-soft inline-flex items-center gap-2 text-xs transition"
        >
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Refresh order"
            onClick={() => void refreshOrder()}
            className="icon-button"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      {error ? (
        <p
          role="alert"
          className="border-primary/30 bg-primary/10 text-primary-soft rounded-lg border px-4 py-3 text-sm"
        >
          {error}
        </p>
      ) : null}
      {order.cancellationRequestedAt ? (
        <DashboardPanel className="border-amber-400/30">
          <div className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-amber-300 text-sm font-semibold">
                Customer requested cancellation
              </p>
              <p className="text-text-muted mt-1 text-xs">
                Requested {new Date(order.cancellationRequestedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setConfirmationAction("reject")}
                className="border-(--glass-border) text-text-muted hover:bg-surface-2 cursor-pointer rounded-md border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject request
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setConfirmationAction("approve")}
                className="bg-error/10 border-error/40 text-error hover:bg-error/20 cursor-pointer rounded-md border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve &amp; cancel
              </button>
            </div>
          </div>
        </DashboardPanel>
      ) : null}

      <DashboardPanel className="overflow-hidden">
        <div className="flex flex-col gap-4 bg-(--woodgrain) p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="heading-font text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                Order #{orderCode}
              </h1>
              <StatusPill status={order.status} />
            </div>
            <p className="text-text-muted flex items-center gap-2 text-sm">
              <FileText size={14} /> Placed on
              <span className="text-white">
                {new Date(order.createdAt).toLocaleString("en-MY")}
              </span>
              by customer
              <span className="text-white">{order.user.name}</span>
            </p>
            {!isTerminalStatus ? (
              <p className="text-secondary bg-secondary/10 border-secondary/20 mt-2 flex items-center gap-2 rounded-sm border px-3 py-2 text-xs">
                <BadgeCheck size={14} /> Atelier wrapping and quality inspection
                are in progress.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canRefund ? (
              <button
                type="button"
                disabled={saving}
                onClick={() => setConfirmationAction("refund")}
                className="border-destructive/40 text-destructive hover:bg-destructive/10 inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold disabled:opacity-50"
              >
                <RotateCcw size={14} /> Refund
              </button>
            ) : null}
            <Select
              value={status}
              onValueChange={(value) => {
                if (value !== null) setStatus(value);
              }}
              disabled={saving}
            >
              <SelectTrigger
                aria-label="Order status"
                className="form-input h-9 rounded-md px-3 text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              disabled={saving || status === order.status}
              onClick={saveStatus}
              className="bg-primary text-primary-foreground inline-flex h-9 items-center gap-2 rounded-md px-3 text-xs font-semibold disabled:opacity-50"
            >
              <ClipboardCheck size={14} />{" "}
              {saving ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </DashboardPanel>

      <DashboardPanel>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-primary-soft" />
            <h2 className="heading-font text-foreground text-sm font-medium">
              Fulfillment Progress Matrix
            </h2>
          </div>
          <span className="bg-secondary/10 text-secondary rounded px-2 py-1 text-[10px] font-semibold">
            {order.status === "REFUNDED"
              ? "Refunded"
              : order.status === "CANCELLED"
                ? "Cancelled"
                : `Stage ${currentStage + 1} of ${stages.length}`}
          </span>
        </div>
        {isTerminalStatus ? (
          <p className="text-text-muted px-5 pb-5 text-sm">
            {order.status === "REFUNDED"
              ? "This order was fully refunded through Stripe."
              : "This order was cancelled."}
          </p>
        ) : (
          <Stepper
            value={currentStage + 1}
            onValueChange={() => undefined}
            orientation={isMobile ? "vertical" : "horizontal"}
            className="p-4"
          >
            <StepperNav className={`w-full ${isMobile ? "gap-1" : "gap-0"}`}>
              {stages.map(([stage, title, detail], index) => {
                const complete = index < currentStage;
                const active = index === currentStage;
                return (
                  <StepperItem
                    key={stage}
                    step={index + 1}
                    completed={complete}
                    className={`relative min-w-0 rounded-lg border p-3 ${isMobile ? "w-full flex-none items-start" : "flex-1 items-start"} ${active ? "border-primary bg-primary/5 shadow-[0_0_24px_rgba(233,139,44,0.12)]" : "bg-surface-2/50 border-transparent"}`}
                  >
                    <StepperTrigger
                      className={`pointer-events-none flex ${isMobile ? "w-full items-start gap-3 text-left" : "min-h-20 flex-col items-center gap-2"}`}
                    >
                      <StepperIndicator className="data-[state=completed]:bg-primary data-[state=active]:bg-primary data-[state=inactive]:bg-surface-4 size-8 border-2 border-(--glass-border) text-xs">
                        {complete ? <Check size={14} /> : index + 1}
                      </StepperIndicator>
                      <StepperTitle
                        className={`text-xs font-semibold ${isMobile ? "text-left" : "text-center"} ${active ? "text-primary-soft" : "text-foreground"}`}
                      >
                        {index + 1}. {title}
                      </StepperTitle>
                      <span
                        className={`meta-font text-[10px] tracking-[0.12em] uppercase ${isMobile ? "text-left" : "text-center"} ${active ? "text-primary-soft" : "text-text-muted"}`}
                      >
                        {active ? "In progress" : `${stage} · ${detail}`}
                      </span>
                    </StepperTrigger>
                    {index < stages.length - 1 ? (
                      <StepperSeparator
                        className={`absolute z-0 m-0 bg-transparent ${isMobile ? "top-11 left-7 h-8 w-0.5" : "top-7 right-[calc(-50%+1rem)] left-[calc(50%+1rem)] h-0.5"}`}
                      />
                    ) : null}
                  </StepperItem>
                );
              })}
            </StepperNav>
          </Stepper>
        )}
      </DashboardPanel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          <DashboardPanel>
            <PanelHeading
              title="Purchased Atelier Items"
              action={
                <span className="text-text-muted bg-accent border px-2 py-1 text-[10px] font-semibold">
                  {order.orderItems.length} Products · Reserved
                </span>
              }
            />
            <div className="px-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="border-border/60 flex items-center justify-between gap-3 border-b py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-surface-2 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                      {item.product.productImages[0]?.url ? (
                        <img
                          src={item.product.productImages[0].url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="text-text-muted" size={22} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-foreground truncate text-xs font-semibold">
                        {item.product.name}
                      </h3>
                      <p className="text-secondary mt-1 px-4 py-2 text-sm">
                        {item.product.collection || "No collection"}
                      </p>
                      <p className="text-text-muted mt-1 text-[10px]">
                        Quantity: {item.quantity} ·{" "}
                        <span className="text-emerald-500">Unit reserved</span>
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-text-muted text-sm">
                      {money.format(Number(item.price))} x {item.quantity}
                    </p>
                    <p className="text-primary-soft text-md mt-1 font-mono font-semibold">
                      {money.format(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-border/60 mx-4 space-y-2 border-b py-3">
              <div className="flex justify-between text-lg">
                <span className="text-text-muted">Items subtotal</span>
                <span className="text-foreground font-mono">
                  {money.format(itemsSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-text-muted">Delivery fee</span>
                <span className="text-foreground font-mono">
                  {money.format(order.deliveryFee)}
                </span>
              </div>
              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                    Order total
                  </p>
                </div>
                <p className="text-primary-soft font-mono text-xl font-semibold">
                  {money.format(Number(order.total))}
                </p>
              </div>
            </div>
          </DashboardPanel>
        </div>
        <div className="space-y-4">
          <DashboardPanel>
            <PanelHeading
              title="Customer Profile"
              action={
                <Link
                  href={`/dashboard/customers/${order.userId}`}
                  aria-label={`View customer ${order.user.name}`}
                  className="icon-button"
                >
                  <ExternalLink size={14} />
                </Link>
              }
            />
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 text-secondary flex h-10 w-10 items-center justify-center rounded-lg font-semibold">
                  {order.user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <Link
                    href={`/dashboard/customers/${order.userId}`}
                    className="text-foreground hover:text-primary-soft! text-sm font-semibold transition-colors"
                  >
                    {order.user.name}
                  </Link>
                  <p className="text-text-muted text-[11px]">
                    {order.user.email}
                  </p>
                </div>
              </div>
              {order.user.phoneNumber ? (
                <p className="text-text-muted mt-4 text-xs">
                  {order.user.phoneNumber}
                </p>
              ) : null}
              <p className="text-text-muted mt-3 text-xs">
                {order.user.ordersCount}{" "}
                {order.user.ordersCount === 1 ? "order" : "orders"} placed
              </p>
            </div>
          </DashboardPanel>
          <DashboardPanel>
            <PanelHeading
              title="Shipping Logistics"
              action={<MapPin size={14} className="text-primary-soft" />}
            />
            <div className="">
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-foreground text-[10px] font-semibold tracking-[0.12em] uppercase">
                  Recipient delivery address
                </p>
                <p className="text-text-muted mt-2 text-xs leading-5">
                  {order.user.name}
                  <br />
                  {address}
                </p>
              </div>
            </div>
          </DashboardPanel>
          {canCancel ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => setConfirmationAction("cancel")}
              className="border-primary/40 text-primary-soft hover:bg-primary/10 w-full rounded-md border px-3 py-2 text-xs disabled:opacity-50"
            >
              Cancel Order
            </button>
          ) : null}
        </div>
      </div>
      <ConfirmDialog
        open={confirmationAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmationAction(null);
        }}
        title={
          confirmationAction === "approve"
            ? "Approve cancellation request?"
            : confirmationAction === "reject"
              ? "Reject cancellation request?"
              : confirmationAction === "refund"
                ? "Issue a full refund?"
                : "Cancel this order?"
        }
        description={
          confirmationAction === "approve" ||
          confirmationAction === "cancel"
            ? "The order will be cancelled, inventory restored, and any captured Stripe payment refunded."
            : confirmationAction === "reject"
              ? "The cancellation request will be cleared and the order will remain active."
              : "Stripe will refund the remaining captured amount. This cannot be undone."
        }
        confirmLabel={
          confirmationAction === "approve"
            ? "Approve & cancel"
            : confirmationAction === "reject"
              ? "Reject request"
              : confirmationAction === "refund"
                ? "Refund order"
                : "Cancel order"
        }
        onConfirm={() => {
          if (confirmationAction === "approve")
            void approveCancellationRequest();
          else if (confirmationAction === "reject")
            void rejectCancellationRequest();
          else if (confirmationAction === "refund") void refund();
          else if (confirmationAction === "cancel") void cancel();
        }}
      />
    </div>
  );
}
