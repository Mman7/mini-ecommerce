"use client";

import { ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="bg-background text-foreground flex min-h-dvh items-center justify-center px-4 py-16">
      <section className="glass-panel w-full max-w-md rounded-lg p-6 sm:p-8">
        <Link
          href="/login"
          className="meta-font text-text-muted hover:text-primary-soft mb-8 inline-flex items-center gap-2 text-xs"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
        <p className="meta-font text-primary mb-2 text-xs tracking-[0.16em] uppercase">
          Account recovery
        </p>
        <h1 className="heading-font text-foreground text-3xl font-semibold">
          Forgot password?
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          Enter your email and we&apos;ll send a link to reset your password.
        </p>
        {sent ? (
          <div className="bg-tertiary/10 text-tertiary border-tertiary/30 mt-6 rounded-md border p-4 text-sm">
            Reset instructions are on their way. Check your inbox.
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="mt-6 space-y-4"
          >
            <label className="block space-y-2">
              <span className="meta-font text-text-muted text-xs">
                Email address
              </span>
              <div className="bg-surface-1 flex items-center rounded-md border border-(--glass-border) px-3">
                <Mail className="text-text-muted mr-3" size={16} />
                <input
                  required
                  type="email"
                  placeholder="your@email.com"
                  className="text-foreground placeholder:text-text-muted/50 w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>
            </label>
            <button
              type="submit"
              className="meta-font bg-primary text-primary-ink flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold"
            >
              <Send size={16} /> Send reset link
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
