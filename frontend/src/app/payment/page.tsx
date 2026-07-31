import Image from "next/image";
import { Check, CreditCard, Lock, MapPin, Wallet } from "lucide-react";

const checkoutSteps = [
  { id: 1, label: "Shipping", status: "complete" as const },
  { id: 2, label: "Payment", status: "active" as const },
  { id: 3, label: "Review", status: "upcoming" as const },
];
// TODO payment breadcrumb should be clickable
const productThumbnails = [
  {
    id: "thumb-1",
    src: "/homepage/pink-plush-bunny.jpg",
    alt: "Starry plush bunny preview",
  },
  {
    id: "thumb-2",
    src: "/homepage/acrylic-figurines-display.jpg",
    alt: "Golden figurine preview",
  },
];

export default function PaymentPage() {
  return (
    <main className="pb-16">
      <section className="padding-inline relative mt-17 min-h-[320px] overflow-hidden py-10 sm:py-14">
        <Image
          src="/Shared/Atelier Interior.png"
          alt="Warm boutique interior"
          fill
          priority
          className="object-cover"
        />
        <div className="from-background/85 via-background/72 to-background absolute inset-0 bg-linear-to-b" />
        <div className="from-background/96 absolute inset-y-0 right-0 w-[45%] bg-linear-to-l to-transparent" />

        <div className="relative z-10 max-w-4xl pt-6 sm:pt-10">
          <span className="meta-font bg-surface-3/70 text-primary-soft mb-4 inline-flex rounded-full border border-(--outline-strong) px-3 py-1 text-xs tracking-[0.16em] uppercase">
            Checkout Session
          </span>
          <h1 className="heading-font text-foreground text-4xl font-semibold sm:text-5xl">
            Checkout
          </h1>

          <div className="mt-8 flex max-w-xl items-start gap-3 sm:gap-4">
            {checkoutSteps.map((step, idx) => (
              <div key={step.id} className="flex min-w-0 flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`meta-font flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      step.status === "complete"
                        ? "bg-primary-soft text-(--primary-ink)"
                        : step.status === "active"
                          ? "text-primary-soft bg-surface-2 border border-(--primary-soft)"
                          : "bg-surface-2 border border-(--outline-strong) text-(--outline)"
                    }`}
                  >
                    {step.status === "complete" ? <Check size={14} /> : step.id}
                  </div>
                  <span
                    className={`meta-font text-xs ${
                      step.status === "upcoming"
                        ? "text-(--outline)"
                        : "text-primary-soft"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < checkoutSteps.length - 1 ? (
                  <div
                    className={`mx-2 mt-4 h-px flex-1 sm:mx-3 ${
                      step.status === "upcoming"
                        ? "bg-(--outline-strong)/45"
                        : "bg-primary-soft/70"
                    }`}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="padding-inline mt-8">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:items-start">
          <div className="space-y-6">
            <section>
              <h2 className="heading-font text-foreground mb-4 text-3xl">
                Payment Method
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="glass-panel focus-amber text-foreground flex items-center justify-center gap-2 rounded-lg border border-(--primary-soft)/35 px-4 py-3 text-sm transition hover:border-(--primary-soft)/80"
                >
                  <Wallet size={16} className="text-primary-soft" />
                  Google Pay
                </button>
                <button
                  type="button"
                  className="glass-panel focus-amber text-foreground flex items-center justify-center gap-2 rounded-lg border border-(--glass-border) px-4 py-3 text-sm transition hover:border-(--outline)"
                >
                  <Wallet size={16} className="text-text-muted" />
                  Apple Pay
                </button>
              </div>

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-(--outline-strong)/50" />
                <span className="meta-font text-[11px] tracking-[0.2em] text-(--outline) uppercase">
                  Or pay with card
                </span>
                <div className="h-px flex-1 bg-(--outline-strong)/50" />
              </div>

              <form className="glass-panel rounded-xl p-5 sm:p-6" action="#">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="meta-font text-foreground text-sm">
                    Credit / Debit Card
                  </span>
                  <div className="flex items-center gap-2 text-xs text-(--outline)">
                    <span className="rounded border border-(--outline-strong) px-1.5 py-0.5">
                      VISA
                    </span>
                    <span className="rounded border border-(--outline-strong) px-1.5 py-0.5">
                      MC
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  <label className="block">
                    <span className="meta-font text-text-muted mb-2 block text-xs">
                      Cardholder Name
                    </span>
                    <input
                      type="text"
                      placeholder="Hanae Mori"
                      className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 text-sm placeholder:text-(--outline)"
                    />
                  </label>

                  <label className="block">
                    <span className="meta-font text-text-muted mb-2 block text-xs">
                      Card Number
                    </span>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 pr-11 text-sm placeholder:text-(--outline)"
                      />
                      <CreditCard
                        size={16}
                        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-(--outline)"
                      />
                    </div>
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="meta-font text-text-muted mb-2 block text-xs">
                        Expiry Date
                      </span>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 text-sm placeholder:text-(--outline)"
                      />
                    </label>
                    <label className="block">
                      <span className="meta-font text-text-muted mb-2 block text-xs">
                        CVC
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        className="focus-amber bg-surface-1 text-foreground w-full rounded-md border border-(--outline-strong)/70 px-3 py-3 text-sm placeholder:text-(--outline)"
                      />
                    </label>
                  </div>

                  <label className="mt-1 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-primary-soft h-4 w-4 rounded border border-(--outline-strong) bg-transparent"
                    />
                    <span className="text-text-muted text-xs sm:text-sm">
                      Securely save card for future purchases
                    </span>
                  </label>
                </div>
              </form>
            </section>

            <section className="glass-panel flex items-center justify-between gap-4 rounded-xl px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="bg-surface-3 text-primary-soft flex h-9 w-9 items-center justify-center rounded-full">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="meta-font text-foreground text-sm">
                    Billing Address
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm">
                    Same as shipping address
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="meta-font text-primary-soft focus-amber rounded px-2 py-1 text-xs transition hover:underline sm:text-sm"
              >
                Edit
              </button>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <section className="glass-panel rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 border-b border-(--outline-strong)/55 pb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-md border border-(--glass-border)">
                  <Image
                    src="/homepage/pink-plush-bunny.jpg"
                    alt="Selection preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="heading-font text-primary-soft text-xl">
                    Your Selection
                  </h3>
                  <p className="text-text-muted text-xs">3 items in cart</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-text-muted flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>¥17,800</span>
                </div>
                <div className="text-text-muted flex items-center justify-between text-sm">
                  <span>Shipping (Atelier Standard)</span>
                  <span>¥500</span>
                </div>
                <div className="text-text-muted flex items-center justify-between text-sm">
                  <span>Gift Wrap</span>
                  <span className="text-primary-soft">Free</span>
                </div>

                <div className="my-2 border-t border-(--outline-strong)/45" />

                <div className="flex items-end justify-between gap-3">
                  <span className="heading-font text-foreground text-2xl">
                    Total
                  </span>
                  <span className="title-font text-primary-soft text-4xl leading-none">
                    ¥18,300
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="focus-amber meta-font bg-primary-soft hover:bg-primary w-full rounded-lg px-4 py-3 text-sm font-semibold text-(--primary-ink) transition"
                >
                  Review Order
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-(--outline)">
                  <Lock size={12} />
                  SSL Encrypted Secure Payment
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {productThumbnails.map((thumb) => (
                  <div
                    key={thumb.id}
                    className="relative h-14 w-14 overflow-hidden rounded-md border border-(--outline-strong)/55"
                  >
                    <Image
                      src={thumb.src}
                      alt={thumb.alt}
                      fill
                      className="object-cover opacity-70"
                    />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
