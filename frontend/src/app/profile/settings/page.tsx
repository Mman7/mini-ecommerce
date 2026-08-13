"use client";

import { Bell, LockKeyhole, Save } from "lucide-react";
import { useState } from "react";

export default function ProfileSettingsPage() {
  const [notice, setNotice] = useState("");
  return (
    <div className="space-y-8">
      <header>
        <p className="meta-font text-primary mb-2 text-xs tracking-[0.16em] uppercase">
          Your preferences
        </p>
        <h1 className="heading-font text-foreground text-3xl font-semibold">
          Settings
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Tune your Komorebi account and notification preferences.
        </p>
      </header>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setNotice("Settings saved successfully.");
        }}
        className="space-y-5"
      >
        <section className="glass-panel rounded-lg p-5 sm:p-6">
          <h2 className="heading-font text-foreground mb-5 flex items-center gap-2 text-xl">
            <Bell className="text-primary" size={18} /> Notifications
          </h2>
          <label className="flex items-center justify-between gap-4 border-b border-(--glass-border) py-4">
            <span>
              <span className="text-foreground block text-sm">
                Order updates
              </span>
              <span className="text-text-muted text-xs">
                Receive delivery and order status emails.
              </span>
            </span>
            <input
              defaultChecked
              type="checkbox"
              className="accent-primary h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="text-foreground block text-sm">
                Atelier notes
              </span>
              <span className="text-text-muted text-xs">
                Occasional news about new treasures and collections.
              </span>
            </span>
            <input
              defaultChecked
              type="checkbox"
              className="accent-primary h-4 w-4"
            />
          </label>
        </section>
        <section className="glass-panel rounded-lg p-5 sm:p-6">
          <h2 className="heading-font text-foreground mb-5 flex items-center gap-2 text-xl">
            <LockKeyhole className="text-primary" size={18} /> Password
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="password"
              placeholder="Current password"
              className="form-input"
            />
            <input
              type="password"
              placeholder="New password"
              className="form-input"
            />
          </div>
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
  );
}
