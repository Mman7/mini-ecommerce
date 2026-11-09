"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
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
          Password reset by email is not available yet. Please contact support
          to recover your account.
        </p>
      </section>
    </main>
  );
}
