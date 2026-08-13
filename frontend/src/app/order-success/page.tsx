import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Package, Sparkles } from "lucide-react";

const purchasedItems = [
  {
    name: "Sakura Fox Plush",
    detail: "Standard · Qty 1",
    price: "RM 48.00",
    image: "/homepage/pink-plush-bunny.jpg",
  },
  {
    name: "Mochi Bunny Plush",
    detail: "Pink · Qty 1",
    price: "RM 42.00",
    image: "/homepage/plush-toy-lineup.jpg",
  },
];

export default function OrderSuccessPage() {
  return (
    <main className="bg-background text-foreground min-h-dvh px-4 py-16 sm:px-6 lg:px-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/8 absolute -top-36 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-tertiary/5 absolute right-0 bottom-0 h-80 w-80 rounded-full blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl pt-6">
        <div className="mb-10 text-center">
          <div className="bg-primary/15 border-primary/35 text-primary mx-auto flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_30px_rgba(255,183,122,0.2)]">
            <Check size={38} strokeWidth={2.4} />
          </div>
          <p className="meta-font text-primary-soft mt-6 text-xs font-semibold tracking-[0.24em] uppercase">
            Order confirmed
          </p>
          <h1 className="heading-font text-foreground mt-3 text-3xl font-semibold sm:text-4xl">
            Thank you for your order
          </h1>
          <p className="text-text-muted mx-auto mt-3 max-w-lg text-sm leading-6 sm:text-base">
            Your Komorebi treasures are being prepared with care. We&apos;ll let
            you know when they begin their journey.
          </p>
        </div>

        <section className="glass-panel rounded-lg p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-(--glass-border) pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="meta-font text-text-muted text-xs tracking-[0.12em] uppercase">
                Order number
              </p>
              <p className="heading-font text-foreground mt-1 text-xl font-medium">
                #KMB-8924
              </p>
            </div>
            <div className="bg-tertiary/15 border-tertiary/30 text-tertiary inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold">
              <Package size={14} />
              Processing
            </div>
          </div>

          <div className="py-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="text-primary" size={17} />
              <h2 className="heading-font text-foreground text-lg font-medium">
                Order summary
              </h2>
            </div>
            <div className="space-y-3">
              {purchasedItems.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="bg-surface-3 relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="text-text-muted mt-1 text-xs">
                      {item.detail}
                    </p>
                  </div>
                  <span className="meta-font text-foreground text-xs font-semibold">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-(--glass-border) pt-5 text-sm">
            <div className="text-text-muted flex justify-between">
              <span>Subtotal</span>
              <span>RM 90.00</span>
            </div>
            <div className="text-text-muted flex justify-between">
              <span>Shipping</span>
              <span>RM 8.00</span>
            </div>
            <div className="flex justify-between border-t border-(--glass-border) pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="text-primary">RM 98.00</span>
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href="/profile/orders/KMB-8924"
            className="meta-font bg-primary text-primary-ink hover:bg-primary-soft flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-[0_0_18px_rgba(255,183,122,0.16)] transition"
          >
            View Order
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/products"
            className="meta-font glass-panel text-foreground hover:border-primary/60 flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="text-text-muted mt-8 text-center text-xs">
          A confirmation has been prepared for aria.vance@example.com
        </p>
      </div>
    </main>
  );
}
