import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import RegisterForm from "@/src/components/auth/register-form";

export default function RegisterPage() {
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

          <RegisterForm />
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
