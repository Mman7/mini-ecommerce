"use client";

import { Bell, Save, Store } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "../../../components/dashboard";

export default function DashboardSettingsPage() {
  const [notice, setNotice] = useState("");
  return (
    <DashboardShell activeSection="settings">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <p className="meta-font text-primary mb-2 text-xs tracking-[0.16em] uppercase">
            Atelier control
          </p>
          <h1 className="heading-font text-foreground text-3xl font-semibold">
            Settings
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Manage store details and administrator preferences.
          </p>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setNotice("Store settings saved.");
          }}
          className="space-y-5"
        >
          <section className="glass-panel rounded-lg p-5 sm:p-6">
            <h2 className="heading-font text-foreground mb-5 flex items-center gap-2 text-xl">
              <Store className="text-primary" size={18} /> Store Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="meta-font text-text-muted text-xs">
                  Store name
                </span>
                <input
                  defaultValue="Komorebi Gift Atelier"
                  className="form-input"
                />
              </label>
              <label className="space-y-2">
                <span className="meta-font text-text-muted text-xs">
                  Support email
                </span>
                <input
                  defaultValue="hello@komorebi.atelier"
                  type="email"
                  className="form-input"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="meta-font text-text-muted text-xs">
                  Store description
                </span>
                <textarea
                  defaultValue="A curated sanctuary for tiny treasures."
                  rows={3}
                  className="form-input resize-y"
                />
              </label>
            </div>
          </section>
          <section className="glass-panel rounded-lg p-5 sm:p-6">
            <h2 className="heading-font text-foreground mb-5 flex items-center gap-2 text-xl">
              <Bell className="text-primary" size={18} /> Admin Notifications
            </h2>
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="text-foreground block text-sm">
                  Low stock alerts
                </span>
                <span className="text-text-muted text-xs">
                  Notify administrators when products need attention.
                </span>
              </span>
              <input
                defaultChecked
                type="checkbox"
                className="accent-primary h-4 w-4"
              />
            </label>
          </section>
          <div className="flex items-center justify-end gap-4">
            {notice ? (
              <span className="text-tertiary text-xs">{notice}</span>
            ) : null}
            <button
              type="submit"
              className="meta-font bg-primary text-primary-ink flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold"
            >
              <Save size={14} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
