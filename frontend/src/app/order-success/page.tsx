"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Package } from "lucide-react";
import { getOrder, type Order } from "@/src/api/order.api";

const fallbackImage = "/homepage/white-plush-rabbit-on-shelf.png";

function formatYen(value: string | number) {
  return `¥${Number(value).toLocaleString("ja-JP")}`;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("This confirmation link is missing an order number.");
      return;
    }
    getOrder(orderId)
      .then((response) => setOrder(response.order))
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this order.",
        );
      });
  }, [orderId]);

  if (error) {
    return (
      <main className="padding-inline flex min-h-dvh items-center justify-center">
        <section className="bg-surface-1 w-full max-w-lg rounded-xl border border-(--outline-strong) p-8 text-center">
          <h1 className="heading-font text-foreground text-2xl">
            Order confirmation unavailable
          </h1>
          <p className="text-text-muted mt-3 text-sm">{error}</p>
          <Link
            href="/products"
            className="bg-primary-soft text-primary-foreground mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-semibold"
          >
            Continue Shopping
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="padding-inline flex min-h-dvh items-center justify-center">
        <p className="text-text-muted animate-pulse text-sm">
          Preparing your order confirmation...
        </p>
      </main>
    );
  }

  return (
    <main className="padding-inline min-h-dvh py-20">
      <div className="mx-auto max-w-3xl">
        <header className="animate-checkout-in text-center">
          <div className="bg-primary-soft/15 border-primary-soft/40 text-primary-soft mx-auto flex size-20 items-center justify-center rounded-full border">
            <Check className="size-9" />
          </div>
          <p className="meta-font text-primary-soft mt-6 text-xs font-semibold tracking-[0.24em] uppercase">
            Order confirmed
          </p>
          <h1 className="heading-font text-foreground mt-3 text-3xl font-semibold sm:text-4xl">
            Thank you for your order
          </h1>
          <p className="text-text-muted mx-auto mt-3 max-w-lg text-sm leading-6">
            Your Komorebi treasures are being prepared with care.
          </p>
        </header>
        <section className="bg-surface-1 animate-review-item mt-10 rounded-xl border border-(--outline-strong)/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-(--outline-strong)/50 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="meta-font text-text-muted text-xs tracking-[0.12em] uppercase">
                Order number
              </p>
              <p className="heading-font text-foreground mt-1 text-xl font-medium">
                #{order.id}
              </p>
            </div>
            <div className="bg-tertiary/15 border-tertiary/30 text-tertiary inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold">
              <Package className="size-4" />
              {order.status}
            </div>
          </div>
          <div className="py-6">
            <h2 className="heading-font text-foreground mb-4 text-lg">
              Order summary
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => {
                const image =
                  item.product.productImages.find(
                    (candidate) => candidate.isThumbnail,
                  )?.url ||
                  item.product.productImages[0]?.url ||
                  fallbackImage;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="bg-surface-3 relative size-14 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-text-muted mt-1 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="meta-font text-foreground text-xs font-semibold">
                      {formatYen(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-3 border-t border-(--outline-strong)/50 pt-5 text-sm">
            <div className="text-text-muted flex justify-between">
              <span>Total</span>
              <span className="text-primary-soft text-lg font-semibold">
                {formatYen(order.total)}
              </span>
            </div>
          </div>
        </section>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/profile/orders/${order.id}`}
            className="bg-primary-soft text-primary-foreground hover:bg-primary flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition"
          >
            View Order
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/products"
            className="bg-surface-1 text-foreground hover:border-primary-soft flex min-h-11 items-center justify-center rounded-lg border border-(--outline-strong) px-5 py-3 text-sm font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

const checkoutStyles = `@keyframes checkout-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } @keyframes review-item { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: scale(1); } } .animate-checkout-in { animation: checkout-in 700ms ease-out both; } .animate-review-item { animation: review-item 400ms ease-out both; } @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; } }`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("order-success-styles")
) {
  const style = document.createElement("style");
  style.id = "order-success-styles";
  style.textContent = checkoutStyles;
  document.head.appendChild(style);
}
