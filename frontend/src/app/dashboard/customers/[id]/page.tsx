"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Clipboard,
  Mail,
  Phone,
  ShoppingBag,
  UserRound,
  CircleCheck,
  Ban,
  ChartNoAxesColumn,
} from "lucide-react";
import { customerApi } from "../../../../api/customer.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
  StatusPill,
} from "../../../../components/dashboard";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const getMoney = (value: number) => money.format(value).split(" ")[1];
const getCurrency = (value: number) => money.format(value).split(" ")[0];

type CustomerDetail = Awaited<ReturnType<typeof customerApi.admin.get>>;

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<"email" | "uid" | null>(null);
  useEffect(() => {
    customerApi.admin
      .get(id)
      .then((result) => {
        setCustomer(result);
      })
      .catch(() => setError("Unable to load this customer."))
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleStatus() {
    if (!customer) return;
    try {
      const result = await customerApi.admin.updateStatus(
        id,
        !customer.isActive,
      );
      setCustomer(result);
      toast.add({
        title: "Customer status updated",
        description: `Customer is now ${result.status}.`,
        type: "success",
      });
    } catch {
      setError("Unable to update customer status.");
      toast.add({
        title: "Status update failed",
        description: "Unable to update customer status.",
        type: "error",
      });
    }
  }

  async function copyValue(field: "email" | "uid", value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField(null), 1500);
  }

  if (loading)
    return (
      <div
        aria-busy="true"
        className="bg-surface-2 h-40 animate-pulse rounded-lg"
      />
    );
  if (!customer)
    return (
      <p role="alert" className="text-primary-soft">
        {error || "Customer not found."}
      </p>
    );
  return (
    <>
      <DashboardHeading
        eyebrow="Customer operations"
        title={`Customer: ${customer.userId}`}
        description="Customer profile, account health, and order activity"
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href="/dashboard/customers"
              className="meta-font text-text-muted hover:text-foreground bg-surface-2 inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-2 text-center text-xs transition-colors"
            >
              ← Back to Customers
            </Link>
            <Link
              href={`/dashboard/customers/${id}/edit`}
              className="meta-font bg-primary text-primary-foreground inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold shadow-[0_0_24px_rgba(233,139,44,0.18)]"
            >
              Edit Customer
            </Link>
          </div>
        }
      />
      {error ? (
        <p role="alert" className="text-primary-soft mb-4 text-sm">
          {error}
        </p>
      ) : null}
      <DashboardPanel className="mb-6 overflow-hidden">
        <div className="flex flex-col gap-6 sm:p-2 md:flex lg:flex-col xl:flex-row xl:items-center xl:justify-between">
          <CustomerCard customer={customer} />
          <div className="relative grid w-full min-w-0 grid-cols-1 gap-4 pt-4 sm:pt-4 xl:w-auto xl:min-w-72 xl:grid-cols-3 xl:gap-8 xl:border-t-0 xl:pt-0">
            <Metric
              label="Orders"
              value={String(customer.orders)}
              detailClassName="text-emerald-300! font-medium "
              detail={customer.orders ? "All Completed" : "No orders yet"}
            />
            <Separator className="xl:hidden" />
            <Separator
              orientation="vertical"
              className="pointer-events-none absolute inset-y-0 left-1/3 hidden h-auto xl:block"
            />
            <Metric
              label="Lifetime value"
              value={money.format(customer.totalSpent)}
              detail={`Avg. ${money.format(customer.averageOrderValue)} / ord`}
              valueClassName="text-primary!"
            />
            <Separator className="xl:hidden" />
            <Separator
              orientation="vertical"
              className="pointer-events-none absolute inset-y-0 left-2/3 hidden h-auto xl:block"
            />
            <div className="bg-surface-2 block min-w-0 px-3 py-2.5 text-right sm:hidden xl:block">
              <p
                className={`meta-font text-sm tracking-wider text-gray-400 uppercase`}
              >
                Segment
              </p>
              <p
                className={`bg-surface-1 mt-1 border px-2.5 py-1 text-center text-sm tracking-widest wrap-break-word text-white`}
              >
                {customer.orders > 1
                  ? "Returning customer"
                  : "First order journey"}
              </p>
            </div>
          </div>
        </div>
      </DashboardPanel>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          <DashboardPanel>
            <PanelHeading
              icon={<UserRound size={14} className="text-primary" />}
              title="Customer Information"
            />
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              <Info label="Full Name" value={customer.name} />
              <Info
                label="Email Address"
                value={customer.email}
                action={
                  <CopyButton
                    copied={copiedField === "email"}
                    onClick={() => void copyValue("email", customer.email)}
                  />
                }
              />
              <Info
                label="Phone"
                value={customer.phoneNumber ?? "Not provided"}
              />
              <Info
                label="Date Joined"
                value={new Date(customer.createdAt).toLocaleDateString()}
              />
            </div>
          </DashboardPanel>
          <DashboardPanel>
            <PanelHeading
              icon={
                <ChartNoAxesColumn
                  size={14}
                  className="text-primary font-bold"
                />
              }
              title="Relationship Snapshot"
            />
            <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
              <Info
                label="Total orders"
                labelClassName="tracking-widest"
                value={String(customer.orders)}
                valueClassName="heading-font text-3xl"
                action={<p> paid orders</p>}
                actionClassName="text-sm text-text-muted"
              />
              <Info
                label="Total spent"
                labelClassName="text-sm tracking-widest"
                value={
                  <>
                    <p className="text-2xl">
                      {getCurrency(customer.totalSpent)}
                    </p>
                    <p className="text-2xl">{getMoney(customer.totalSpent)}</p>
                  </>
                }
                valueClassName="text-primary"
                action={<p>Lifetime gross</p>}
                actionClassName="text-text-muted text-sm"
              />
              <Info
                label="Average order"
                labelClassName="text-sm tracking-widest"
                valueClassName="text-3xl"
                value={
                  <>
                    <p className="text-3xl">
                      {getCurrency(customer.averageOrderValue)}
                    </p>
                    <p className="text-3xl">
                      {getMoney(customer.averageOrderValue)}
                    </p>
                  </>
                }
                action={"Per checkout"}
                actionClassName="text-text-muted text-sm"
              />
              <Info
                label="Last order"
                valueClassName="text-3xl"
                value={
                  customer.lastOrder
                    ? new Date(customer.lastOrder).toLocaleDateString()
                    : "No orders"
                }
                action={<p>Fullfilled</p>}
                actionClassName="text-emerald-500 text-sm"
              />
            </div>
          </DashboardPanel>
        </div>
        <div className="space-y-3">
          <DashboardPanel>
            <PanelHeading title="Account Status" />
            <div className="space-y-3 px-5 py-3">
              <div className="flex items-center justify-between">
                <span className="text-text-muted text-xs">Current status</span>
                <StatusPill
                  status={customer.isActive ? "Active" : "Inactive"}
                />
              </div>
              <p className="text-text-muted pt-3 text-xs leading-relaxed">
                {customer.isActive
                  ? "Customer has full access to login, place order and manage atelier gift registries."
                  : "Customer access is currently paused."}
              </p>
              <button
                type="button"
                onClick={toggleStatus}
                className={`meta-font flex w-full cursor-pointer items-center justify-center gap-2 rounded border px-3 py-2 text-xs font-medium transition-colors ${
                  customer.isActive
                    ? "border-red-900/40 bg-red-950/10 text-red-300 hover:bg-red-700/20"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                {customer.isActive ? (
                  <Ban size={14} />
                ) : (
                  <CircleCheck size={14} />
                )}
                {customer.isActive
                  ? "Deactivate Customer"
                  : "Activate Customer"}
              </button>
            </div>
          </DashboardPanel>
          <DashboardPanel>
            <PanelHeading title="Customer Profile" />
            <div className="space-y-3 px-5 py-5">
              <ProfileRow
                label="Customer UID"
                value={`usr_${customer.userId.slice(0, 10)}...`}
                action={
                  <CopyButton
                    copied={copiedField === "uid"}
                    onClick={() => void copyValue("uid", customer.userId)}
                  />
                }
              />
              <ProfileRow
                label="Joined"
                value={new Date(customer.createdAt).toLocaleDateString()}
              />
              <ProfileRow
                label="Phone"
                value={customer.phoneNumber ?? "Not provided"}
              />
              <ProfileRow
                label="Engagement"
                value={
                  <span className="text-secondary mt-1 border px-3 py-2 text-xs">
                    {customer.orders > 1
                      ? "Returning customer"
                      : "First order journey"}
                  </span>
                }
              />
            </div>
          </DashboardPanel>
        </div>
      </div>
      <DashboardPanel className="mt-6 overflow-hidden rounded-xl border border-(--glass-border)">
        <div className="flex items-center justify-between border-b border-(--glass-border) px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <ShoppingBag size={15} className="text-primary" />
            <h2 className="heading-font text-foreground text-sm font-semibold tracking-wide uppercase">
              Order History
            </h2>
            <span className="bg-surface-3 text-text-muted rounded-full border border-(--glass-border) px-2 py-0.5 text-[10px]">
              {customer.orderHistory.length} recorded
            </span>
          </div>
          <span className="text-text-muted hidden text-xs sm:block">
            Recent orders
          </span>
        </div>
        {customer.orderHistory.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead className="meta-font bg-surface-2/60 text-xs text-(--outline) uppercase">
                <tr>
                  <th className="px-4 py-3">Order reference</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Items</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {customer.orderHistory.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-3/50 border-t border-(--glass-border)/60 transition-colors"
                  >
                    <td className="text-text-muted px-4 py-3 text-xs">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="text-text-muted py-3 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-text-muted py-3 text-xs">
                      {order.itemCount}
                    </td>
                    <td className="text-text-muted py-3 text-xs">
                      {money.format(order.total)}
                    </td>
                    <td className="py-3">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-primary-soft text-xs hover:underline"
                      >
                        View order →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted p-6 text-sm">No orders yet.</p>
        )}
        <div className="text-text-muted bg-surface-3/40 border-t border-(--glass-border) px-5 py-3 text-[11px] sm:px-6">
          Order records are synced from the storefront activity.
        </div>
      </DashboardPanel>
    </>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Metric({
  label,
  value,
  detail,
  labelClassName,
  valueClassName,
  detailClassName,
}: {
  label: string;
  value: string;
  detail: string;
  labelClassName?: string;
  valueClassName?: string;
  detailClassName?: string;
}) {
  return (
    <div className="bg-surface-2 min-w-0 px-3 py-2.5 text-right">
      <p
        className={`meta-font text-sm tracking-wider text-gray-400 uppercase ${labelClassName}`}
      >
        {label}
      </p>
      <p
        className={`text-primary-white mt-1 text-2xl font-semibold tracking-widest ${valueClassName}`}
      >
        {value}
      </p>
      <p className={`mt-1 text-sm text-gray-400/80 ${detailClassName}`}>
        {detail}
      </p>
    </div>
  );
}

function ProfileRow({
  label,
  value,
  action,
}: {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 pb-3 last:pb-0">
      <span className="meta-font text-text-muted shrink-0 text-[10px] uppercase">
        {label}
      </span>
      <span className="text-foreground flex min-w-0 items-center justify-end gap-1 text-right text-xs wrap-break-word">
        {value}
        {action}
      </span>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  action,
  labelClassName,
  valueClassName,
  actionClassName,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  actionClassName?: string;
}) {
  return (
    <div className="bg-surface-1 space-y-1 rounded-lg p-4">
      <dt
        className={`flex items-center gap-1.5 text-xs tracking-wide text-gray-400 uppercase ${labelClassName ?? ""}`}
      >
        {icon}
        {label}
      </dt>
      <dd className="text-foreground mt-1 flex items-center justify-between gap-2 text-sm font-medium">
        <span className={`truncate ${valueClassName ?? ""}`}>{value}</span>
      </dd>
      <span className={actionClassName ?? ""}>{action}</span>
    </div>
  );
}

function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={copied ? "Copied" : "Copy"}
      className="text-text-muted hover:text-primary inline-flex shrink-0 items-center"
    >
      {copied ? <Check size={13} /> : <Clipboard size={13} />}
    </button>
  );
}

function CustomerCard({ customer }: { customer: any }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4 xl:w-auto xl:flex-row">
      <div className="bg-secondary/20 text-secondary ring-secondary/30 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-xl font-semibold ring-1">
        {initials(customer.name)}
      </div>
      <div className="w-full min-w-0 text-center xl:w-auto xl:text-left">
        <div className="mb-1 flex flex-wrap items-center justify-center gap-2 xl:justify-start">
          <p className="text-foreground heading-font text-xl font-semibold">
            {customer.name}
          </p>
          <StatusPill status={customer.isActive ? "Active" : "Inactive"} />
          <StatusPill status={customer.status} />
        </div>
        <div className="text-text-muted mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs xl:justify-start">
          <span className="text-foreground inline-flex max-w-full min-w-0 items-center gap-1.5 break-all">
            <Mail size={13} className="text-primary" />
            {customer.email}
          </span>
          <span className="text-(--glass-border)">|</span>
          <span className="meta-font max-w-full break-all">
            UID: {customer.userId}
          </span>
        </div>
      </div>
    </div>
  );
}
