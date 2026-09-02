"use client";
// TODO fix the image when switching between login and register pages causing image shadow
// TODO if mobile show the page transition animation
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export enum AuthMode {
  LOGIN = "login",
  REGISTER = "register",
}

type AuthPageProps = {
  mode: AuthMode;
};

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === AuthMode.LOGIN;

  return (
    <main className="bg-background text-foreground relative min-h-dvh overflow-hidden lg:grid lg:grid-cols-2">
      <section
        className={`relative z-10 flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:items-center lg:px-12 lg:py-16 xl:px-20 ${isLogin ? "lg:col-start-2" : "lg:col-start-1"}`}
      >
        <div className="bg-primary/10 absolute top-1/4 -right-24 h-80 w-80 rounded-full blur-[100px]" />
        <div className="bg-secondary/5 absolute -bottom-28 left-1/4 h-72 w-72 rounded-full blur-[100px]" />

        <div className="glass-panel relative z-10 w-full max-w-md rounded-lg p-7 sm:p-10">
          {isLogin && (
            <Link
              href="/"
              className="title-font text-primary mb-8 block text-2xl font-semibold lg:hidden"
            >
              Komorebi
            </Link>
          )}
          <div className="mb-8">
            {isLogin ? (
              <p className="meta-font text-primary-soft mb-3 text-xs font-semibold tracking-[0.22em] uppercase">
                Atelier access
              </p>
            ) : (
              <h1 className="title-font text-primary text-4xl leading-tight font-semibold sm:text-5xl">
                Komorebi Gifts
              </h1>
            )}
            <h2 className="heading-font text-foreground mt-3 text-2xl leading-tight font-semibold sm:text-3xl">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-text-muted mt-3 text-sm leading-6">
              {isLogin
                ? "Enter your details to access your curated collections."
                : "Welcome to your little corner of Komorebi. A sanctuary for collectors awaits."}
            </p>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </section>

      <motion.section
        className={`absolute inset-y-0 left-0 z-20 hidden w-1/2 overflow-hidden lg:flex lg:p-12 xl:p-16 ${isLogin ? "lg:flex-col lg:justify-between" : "lg:items-end"}`}
        initial={false}
        animate={{ x: isLogin ? "0%" : "100%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/Shared/login_bg.png"
          alt="Warmly lit Komorebi gift atelier"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div
          className={
            isLogin
              ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(15,14,16,0.78),rgba(15,14,16,0.18)),linear-gradient(0deg,rgba(15,14,16,0.94),transparent_46%)]"
              : "absolute inset-0 bg-[linear-gradient(135deg,rgba(20,19,21,0.82),rgba(20,19,21,0.2)_52%,rgba(20,19,21,0.86)),linear-gradient(0deg,rgba(20,19,21,0.42),transparent_55%)]"
          }
        />

        {isLogin && (
          <Link
            href="/"
            className="title-font focus-amber text-primary relative z-10 w-fit text-3xl font-semibold"
          >
            Komorebi
          </Link>
        )}

        {isLogin ? (
          <div className="relative z-10 max-w-sm">
            <p className="meta-font text-primary-soft mb-3 text-xs font-semibold tracking-[0.28em] uppercase">
              Gift Atelier
            </p>
            <h2 className="heading-font text-foreground text-4xl leading-tight font-semibold xl:text-5xl">
              A little magic, carefully curated.
            </h2>
            <p className="text-text-muted mt-5 max-w-xs text-base leading-7">
              Discover thoughtful treasures from our warm corner of Tokyo.
            </p>
          </div>
        ) : (
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
        )}
      </motion.section>
    </main>
  );
}
