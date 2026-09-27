"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { customerApi } from "../../../../../api/customer.api";
import {
  DashboardHeading,
  DashboardPanel,
  PanelHeading,
} from "../../../../../components/dashboard";
import { toast } from "@/components/ui/toast";

export default function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "" });

  useEffect(() => {
    customerApi.admin
      .get(id)
      .then((customer) =>
        setForm({
          name: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber ?? "",
        }),
      )
      .catch(() => setError("Unable to load this customer."))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await customerApi.admin.update(id, {
        ...form,
        phoneNumber: form.phoneNumber || null,
      });
      toast.add({
        title: "Customer updated",
        description: "Customer information was saved.",
        type: "success",
      });
      router.push(`/dashboard/customers/${id}`);
    } catch {
      setError("Unable to update customer.");
      toast.add({
        title: "Update failed",
        description: "Unable to update customer.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        aria-busy="true"
        className="bg-surface-2 h-40 animate-pulse rounded-lg"
      />
    );
  }

  return (
    <>
      <DashboardHeading
        eyebrow="Customer operations"
        title="Edit customer"
        description="Update customer contact information"
        action={
          <Link
            href={`/dashboard/customers/${id}`}
            className="meta-font text-text-muted hover:text-foreground bg-surface-2 inline-flex min-h-9 w-full items-center justify-center rounded-lg border border-(--glass-border) px-3 py-2 text-xs transition-colors sm:w-auto"
          >
            Cancel
          </Link>
        }
      />
      {error ? (
        <p role="alert" className="text-primary-soft mb-4 text-sm">
          {error}
        </p>
      ) : null}
      <DashboardPanel className="max-w-2xl rounded-xl border border-(--glass-border)">
        <PanelHeading title="Customer Information" />
        <form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <label className="text-text-muted text-xs">
            Full Name
            <input
              aria-label="Full name"
              required
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
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              className="form-input mt-1 w-full"
            />
          </label>
          <label className="text-text-muted text-xs sm:col-span-2">
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
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <Link
              href={`/dashboard/customers/${id}`}
              className="meta-font text-text-muted hover:text-foreground inline-flex min-h-9 items-center justify-center rounded-lg border border-(--glass-border) px-3 py-2 text-xs transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="meta-font bg-primary text-primary-foreground inline-flex min-h-9 items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </DashboardPanel>
    </>
  );
}
