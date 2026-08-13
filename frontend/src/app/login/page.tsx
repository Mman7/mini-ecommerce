"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="bg-background text-foreground min-h-dvh lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-dvh overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <Image
          src="/Shared/login_bg.png"
          alt="Warmly lit Komorebi gift atelier"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,14,16,0.78),rgba(15,14,16,0.18)),linear-gradient(0deg,rgba(15,14,16,0.94),transparent_46%)]" />

        <Link
          href="/"
          className="title-font focus-amber text-primary relative z-10 w-fit text-3xl font-semibold"
        >
          Komorebi
        </Link>

        <div className="relative z-10 max-w-sm">
          <p className="meta-font text-primary-soft mb-3 text-xs font-semibold tracking-[0.28em] uppercase">
            Gift Atelier
          </p>
          <h1 className="heading-font text-foreground text-4xl leading-tight font-semibold xl:text-5xl">
            A little magic, carefully curated.
          </h1>
          <p className="text-text-muted mt-5 max-w-xs text-base leading-7">
            Discover thoughtful treasures from our warm corner of Tokyo.
          </p>
        </div>
      </section>

      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
        <div className="bg-primary/10 absolute top-1/4 -right-24 h-80 w-80 rounded-full blur-[100px]" />
        <div className="bg-secondary/5 absolute -bottom-28 left-1/4 h-72 w-72 rounded-full blur-[100px]" />

        <div className="glass-panel relative z-10 w-full max-w-md rounded-lg p-7 sm:p-10">
          <div className="mb-8">
            <Link
              href="/"
              className="title-font text-primary mb-8 block text-2xl font-semibold lg:hidden"
            >
              Komorebi
            </Link>
            <p className="meta-font text-primary-soft mb-3 text-xs font-semibold tracking-[0.22em] uppercase">
              Atelier access
            </p>
            <h2 className="heading-font text-foreground text-3xl leading-tight font-semibold">
              Welcome back
            </h2>
            <p className="text-text-muted mt-3 text-sm leading-6">
              Enter your details to access your curated collections.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="meta-font text-foreground mb-2 block text-xs font-semibold"
                htmlFor="email"
              >
                Email
              </label>
              <div className="group bg-surface-1 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
                <Mail
                  aria-hidden="true"
                  className="text-text-muted mr-3"
                  size={17}
                />
                <input
                  className="text-foreground placeholder:text-text-muted/50 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  className="meta-font text-foreground text-xs font-semibold"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  className="meta-font text-primary hover:text-primary-soft text-xs font-semibold"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="bg-surface-1 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
                <LockKeyhole
                  aria-hidden="true"
                  className="text-text-muted mr-3"
                  size={17}
                />
                <input
                  className="text-foreground placeholder:text-text-muted/50 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-text-muted hover:text-primary-soft ml-2 transition"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <label className="text-text-muted flex items-center gap-3 text-sm">
              <input
                className="accent-primary border-outline-strong bg-surface-1 h-4 w-4 rounded"
                name="remember"
                type="checkbox"
              />
              Remember me
            </label>

            <button
              className="meta-font bg-primary text-primary-ink hover:bg-primary-soft focus-visible:outline-primary-soft flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-3"
              type="submit"
            >
              Sign in
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="text-text-muted mt-8 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              className="text-primary hover:text-primary-soft font-semibold"
              href="/register"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
