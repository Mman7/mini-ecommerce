"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminCustomer,
  updateAdminCustomer,
  updateAdminCustomerStatus,
} from "../../../../api/customer.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
  StatusPill,
} from "../../../../components/dashboard";

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

type CustomerDetail = Awaited<ReturnType<typeof getAdminCustomer>>;

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "" });

  useEffect(() => {
    getAdminCustomer(id)
      .then((result) => {
        setCustomer(result);
        setForm({
          name: result.name,
          email: result.email,
          phoneNumber: result.phoneNumber ?? "",
        });
      })
      .catch(() => setError("Unable to load this customer."))
      .finally(() => setLoading(false));
  }, [id]);

  async function save() {
    setSaving(true);
    try {
      const result = await updateAdminCustomer(id, {
        ...form,
        phoneNumber: form.phoneNumber || null,
      });
      setCustomer(result);
      setEditing(false);
    } catch {
      setError("Unable to update customer.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus() {
    if (!customer) return;
    setSaving(true);
    try {
      const result = await updateAdminCustomerStatus(
        id,
        customer.status !== "Inactive",
      );
      setCustomer(result);
    } catch {
      setError("Unable to update customer status.");
    } finally {
      setSaving(false);
    }
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
      <p role="alert" className="text-secondary">
        {error || "Customer not found."}
      </p>
    );
  return (
    <>
      <DashboardHeading
        eyebrow="Customer profile"
        title={customer.name}
        description={customer.email}
        action={
          <div className="flex gap-2">
            <Link
              href="/dashboard/customers"
              className="meta-font text-text-muted rounded border border-(--glass-border) px-3 py-2 text-xs"
            >
              Back to Customers
            </Link>
            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className="meta-font bg-primary text-primary-foreground rounded px-3 py-2 text-xs"
            >
              {editing ? "Cancel" : "Edit Customer"}
            </button>
          </div>
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
            <PanelHeading title="Customer Information" />
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              {editing ? (
                <>
                  <label className="text-text-muted text-xs">
                    Full Name
                    <input
                      aria-label="Full name"
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      className="form-input mt-1 w-full"
                    />
                  </label>
                  <label className="text-text-muted text-xs">
                    Email
                    <input
                      aria-label="Email"
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm({ ...form, email: event.target.value })
                      }
                      className="form-input mt-1 w-full"
                    />
                  </label>
                  <label className="text-text-muted text-xs">
                    Phone
                    <input
                      aria-label="Phone"
                      value={form.phoneNumber}
                      onChange={(event) =>
                        setForm({ ...form, phoneNumber: event.target.value })
                      }
                      className="form-input mt-1 w-full"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={save}
                    className="bg-primary text-primary-foreground self-end rounded px-3 py-2 text-xs disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Customer"}
                  </button>
                </>
              ) : (
                <>
                  <Info label="Full Name" value={customer.name} />
                  <Info label="Email" value={customer.email} />
                  <Info
                    label="Phone"
                    value={customer.phoneNumber ?? "Not provided"}
                  />
                  <Info
                    label="Date Joined"
                    value={new Date(customer.createdAt).toLocaleDateString()}
                  />
                </>
              )}
            </div>
          </DashboardPanel>
          <DashboardPanel>
            <PanelHeading title="Customer Statistics" />
            <div className="grid grid-cols-2 gap-4 p-4">
              <Info label="Total Orders" value={String(customer.orders)} />
              <Info
                label="Total Spent"
                value={money.format(customer.totalSpent)}
              />
              <Info
                label="Average Order"
                value={money.format(customer.averageOrderValue)}
              />
              <Info
                label="Last Order"
                value={
                  customer.lastOrder
                    ? new Date(customer.lastOrder).toLocaleDateString()
                    : "No orders"
                }
              />
            </div>
          </DashboardPanel>
        </div>
        <div className="space-y-3">
          <DashboardPanel>
            <PanelHeading title="Account Status" />
            <div className="space-y-3 px-4 pb-4">
              <StatusPill status={customer.status} />
              <button
                type="button"
                disabled={saving}
                onClick={toggleStatus}
                className="meta-font border-secondary/50 text-secondary w-full rounded border px-3 py-2 text-xs disabled:opacity-50"
              >
                {customer.status === "Inactive"
                  ? "Activate Customer"
                  : "Deactivate Customer"}
              </button>
            </div>
          </DashboardPanel>
        </div>
      </div>
      <DashboardPanel className="mt-3">
        <PanelHeading title="Order History" />
        {customer.orderHistory.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left">
              <thead className="meta-font bg-surface-2/60 text-xs text-(--outline) uppercase">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
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
                    className="border-t border-(--glass-border)"
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
                        View
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
      </DashboardPanel>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-text-muted text-xs">{label}</dt>
      <dd className="text-foreground mt-1 text-sm">{value}</dd>
    </div>
  );
}
