import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  ExternalLink,
  Headphones,
  Home,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";

type OrderItem = {
  name: string;
  variant: string;
  quantity: number;
  price: string;
  image: string;
};

const orderItems: OrderItem[] = [
  {
    name: "Sakura Fox Plush",
    variant: "Standard",
    quantity: 1,
    price: "RM 48.00",
    image: "/homepage/pink-plush-bunny.jpg",
  },
  {
    name: "Mochi Bunny Plush",
    variant: "Pink",
    quantity: 1,
    price: "RM 42.00",
    image: "/homepage/plush-toy-lineup.jpg",
  },
  {
    name: "Totoro Velour Edition",
    variant: "Large",
    quantity: 1,
    price: "RM 58.00",
    image: "/homepage/acrylic-figurines-display.jpg",
  },
];

const timeline = [
  { label: "Order Placed", icon: Check, complete: true },
  { label: "Processing", icon: RotateCcw, complete: true, current: true },
  { label: "Shipped", icon: Truck, complete: false },
  { label: "Delivered", icon: Home, complete: false },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderNumber = id.startsWith("KMB-") ? id : "KM-2026-00128";

  return (
    <div className="space-y-8">
      <Link
        href="/profile/orders"
        className="meta-font text-text-muted hover:text-primary inline-flex items-center gap-2 text-xs transition"
      >
        <ArrowLeft size={14} />
        Back to My Orders
      </Link>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
        <div className="space-y-8">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
                Order #{orderNumber}
              </h1>
              <p className="text-text-muted mt-1 text-sm">
                Placed on August 13, 2026
              </p>
            </div>
            <span className="meta-font bg-primary/15 text-primary border-primary/30 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold">
              <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
              Processing
            </span>
          </header>

          <section className="bg-surface-1 rounded-lg border border-(--glass-border) p-5 sm:p-7">
            <h2 className="heading-font text-foreground mb-8 text-xl font-medium">
              Order Status
            </h2>
            <div className="relative flex justify-between gap-2">
              <div className="bg-surface-4 absolute top-4 right-0 left-0 h-1 rounded-full" />
              <div className="bg-primary absolute top-4 left-0 h-1 w-1/3 rounded-full" />
              {timeline.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className={`border-surface-1 flex h-8 w-8 items-center justify-center rounded-full border-4 ${
                        step.complete
                          ? "bg-primary text-primary-ink"
                          : "bg-surface-4 text-text-muted"
                      } ${step.current ? "shadow-[0_0_15px_rgba(233,139,44,0.35)]" : ""}`}
                    >
                      <Icon size={14} />
                    </div>
                    <span
                      className={`meta-font text-center text-[10px] leading-4 ${step.current ? "text-primary" : step.complete ? "text-foreground" : "text-text-muted"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="heading-font text-foreground mb-4 text-xl font-medium">
              Items in Your Order
            </h2>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <article
                  key={item.name}
                  className="bg-surface-1 flex items-center gap-4 rounded-lg border border-(--glass-border) p-4"
                >
                  <div className="bg-surface-3 relative h-20 w-20 shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="meta-font text-foreground text-sm font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-text-muted mt-1 text-xs">
                      Variant: {item.variant}
                    </p>
                    <p className="text-text-muted text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="meta-font text-foreground text-xs font-semibold sm:text-sm">
                    {item.price}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="bg-surface-3 rounded-lg p-6">
            <h2 className="heading-font text-foreground mb-5 border-b border-(--glass-border) pb-4 text-xl font-medium">
              Order Summary
            </h2>
            <div className="text-text-muted space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>RM 148.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>RM 8.00</span>
              </div>
              <div className="text-secondary flex justify-between">
                <span>Discount</span>
                <span>- RM 10.00</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-(--glass-border) pt-4">
              <span className="heading-font text-lg">Total</span>
              <span className="heading-font text-primary text-2xl font-semibold">
                RM 146.00
              </span>
            </div>
          </section>

          <section className="bg-surface-1 rounded-lg border border-(--glass-border) p-6">
            <h2 className="meta-font text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
              <Truck size={17} /> Shipping Information
            </h2>
            <div className="text-text-muted space-y-1 text-sm">
              <p className="text-foreground font-medium">Aria Vance</p>
              <p>123 Example Street</p>
              <p>Standard Delivery</p>
              <p className="pt-2 text-xs">
                Tracking: <span className="text-foreground">#MY123456789</span>
              </p>
            </div>
            <button
              type="button"
              className="meta-font bg-primary text-primary-ink hover:bg-primary-soft mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-semibold transition"
            >
              Track Package <ExternalLink size={14} />
            </button>
          </section>

          <section className="bg-surface-1 rounded-lg border border-(--glass-border) p-6">
            <h2 className="meta-font text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
              <CreditCard size={17} /> Payment Information
            </h2>
            <div className="text-text-muted flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="bg-surface-4 text-foreground rounded px-2 py-1 text-xs font-bold">
                  VISA
                </span>
                <span>•••• 4242</span>
              </div>
              <span className="border-tertiary/30 bg-tertiary/15 text-tertiary rounded-full border px-2 py-1 text-xs">
                Paid
              </span>
            </div>
          </section>

          <div className="space-y-2">
            <button
              type="button"
              className="meta-font bg-surface-1 text-foreground hover:bg-surface-4 flex w-full items-center justify-center gap-2 rounded-lg border border-(--glass-border) py-3 text-xs transition"
            >
              <RotateCcw size={15} /> Reorder Items
            </button>
            <Link
              href="/products"
              className="meta-font bg-surface-1 text-foreground hover:bg-surface-4 flex w-full items-center justify-center gap-2 rounded-lg border border-(--glass-border) py-3 text-xs transition"
            >
              <ShoppingBag size={15} /> Continue Shopping
            </Link>
            <button
              type="button"
              className="meta-font bg-surface-1 text-foreground hover:bg-surface-4 flex w-full items-center justify-center gap-2 rounded-lg border border-(--glass-border) py-3 text-xs transition"
            >
              <Headphones size={15} /> Contact Support
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
