import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/src/components/auth/login-form";

export default function LoginPage() {
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

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
