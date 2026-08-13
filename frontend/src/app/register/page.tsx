"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="bg-background text-foreground min-h-dvh lg:grid lg:grid-cols-2">
      <section className="relative flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
        <div className="relative z-10 mx-auto w-full max-w-md">
          <Link
            href="/"
            className="meta-font focus-amber text-text-muted hover:text-primary mb-10 inline-flex items-center gap-2 text-xs transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Store
          </Link>

          <header className="mb-8">
            <h1 className="title-font text-primary text-4xl leading-tight font-semibold sm:text-5xl">
              Komorebi Gifts
            </h1>
            <h2 className="heading-font text-foreground mt-3 text-2xl leading-tight font-semibold sm:text-3xl">
              Create your account
            </h2>
            <p className="text-text-muted mt-3 max-w-sm text-sm leading-6">
              Welcome to your little corner of Komorebi. A sanctuary for
              collectors awaits.
            </p>
          </header>

          <form
            className="glass-panel rounded-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-5">
              <div>
                <label
                  className="meta-font text-text-muted mb-2 block text-xs font-semibold"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="bg-surface-3 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
                  <UserRound
                    aria-hidden="true"
                    className="text-text-muted mr-3"
                    size={17}
                  />
                  <input
                    className="text-foreground placeholder:text-text-muted/45 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    id="name"
                    name="name"
                    placeholder="E.g., Satoru Gojo"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label
                  className="meta-font text-text-muted mb-2 block text-xs font-semibold"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="bg-surface-3 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
                  <Mail
                    aria-hidden="true"
                    className="text-text-muted mr-3"
                    size={17}
                  />
                  <input
                    className="text-foreground placeholder:text-text-muted/45 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label
                  className="meta-font text-text-muted mb-2 block text-xs font-semibold"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="bg-surface-3 focus-within:border-primary flex items-center rounded-md border border-(--glass-border) px-3 transition focus-within:shadow-[0_0_0_3px_rgba(233,139,44,0.14)]">
                  <LockKeyhole
                    aria-hidden="true"
                    className="text-text-muted mr-3"
                    size={17}
                  />
                  <input
                    className="text-foreground placeholder:text-text-muted/45 min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="text-text-muted hover:text-primary-soft ml-2 transition"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              className="meta-font bg-primary text-primary-ink hover:bg-primary-soft focus-visible:outline-primary-soft mt-7 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold tracking-[0.12em] uppercase transition focus-visible:outline-2 focus-visible:outline-offset-3"
              type="submit"
            >
              Create Account
              <ArrowRight size={17} />
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="bg-outline-strong/40 h-px flex-1" />
              <span className="meta-font text-text-muted text-[10px] tracking-[0.25em] uppercase">
                or
              </span>
              <div className="bg-outline-strong/40 h-px flex-1" />
            </div>

            <p className="text-text-muted text-center text-sm">
              Already a collector?{" "}
              <Link
                className="text-primary hover:text-primary-soft font-semibold"
                href="/login"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </section>

      <section className="relative hidden min-h-dvh overflow-hidden lg:flex lg:items-end lg:p-12 xl:p-16">
        <Image
          src="/Shared/login_bg.png"
          alt="Warmly lit Komorebi gift atelier"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,19,21,0.82),rgba(20,19,21,0.2)_52%,rgba(20,19,21,0.86)),linear-gradient(0deg,rgba(20,19,21,0.42),transparent_55%)]" />

        <div className="glass-panel relative z-10 mb-2 max-w-sm rounded-lg p-5 shadow-[0_8px_32px_rgba(233,139,44,0.15)] xl:mb-4 xl:p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-primary" size={17} />
            <span className="meta-font text-primary text-[10px] font-semibold tracking-[0.2em] uppercase">
              Exclusive Access
            </span>
          </div>
          <p className="heading-font text-foreground text-xl leading-snug font-medium xl:text-2xl">
            &quot;Curating moments of quiet magic and playful
            sophistication.&quot;
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="bg-surface-3 border-outline-strong text-secondary flex h-8 w-8 items-center justify-center rounded-full border text-xs">
                ♥
              </span>
              <span className="bg-surface-3 border-outline-strong text-tertiary flex h-8 w-8 items-center justify-center rounded-full border text-xs">
                ★
              </span>
            </div>
            <span className="meta-font text-text-muted text-[10px]">
              Join 10k+ collectors
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
