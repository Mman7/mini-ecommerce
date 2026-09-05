"use client";
// TODO: when initial laod,showing unable to load check is it because the auth status didnt refresh
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  removeCartItem,
  updateCartItem,
  type Cart,
  type CartItem,
} from "@/src/api/cart.api";
import { useCartStore } from "@/src/store/cart.store";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus } from "@/src/types/user";

const fallbackImage = "/homepage/white-plush-rabbit-on-shelf.png";

type LoadState = "loading" | "ready" | "unauthorized" | "error";

function formatPrice(value: number | string) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function imageUrl(url?: string) {
  if (!url) return fallbackImage;
  const normalized = url.replaceAll("\\", "/");
  const uploadsIndex = normalized.toLowerCase().lastIndexOf("/uploads/");
  return uploadsIndex >= 0 ? normalized.slice(uploadsIndex) : normalized;
}

function itemSubtotal(item: CartItem) {
  return Number(item.product.price) * item.quantity;
}

function CartItemRow({
  item,
  pending,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  pending: string | null;
  onQuantityChange: (item: CartItem, quantity: number) => void;
  onRemove: (item: CartItem) => void;
}) {
  const stock = item.product.stock;
  const unavailable = !item.product.isActive || stock < 1;
  const quantityLimit = Math.max(stock, 1);
  const isPending = pending === item.id;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="border-surface-3 grid gap-4 border-b py-6 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-5"
    >
      <div className="bg-surface-2 h-28 overflow-hidden rounded-xl border border-(--outline-strong) sm:h-28 sm:w-28">
        <img
          src={imageUrl(
            item.product.productImages.find((image) => image.isThumbnail)
              ?.url ?? item.product.productImages[0]?.url,
          )}
          alt={item.product.productImages[0]?.altText ?? item.product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-4">
        <div>
          <h2 className="heading-font text-foreground text-xl font-medium">
            {item.product.name}
          </h2>
          <p className="text-text-muted mt-1 text-sm">SKU {item.productId}</p>
          <p className="meta-font text-primary-soft mt-3 text-sm font-semibold">
            {formatPrice(item.product.price)} each
          </p>
          {unavailable ? (
            <p className="text-secondary mt-2 text-sm" role="alert">
              This item is currently unavailable
            </p>
          ) : item.quantity > stock ? (
            <p className="text-secondary mt-2 text-sm" role="alert">
              Only {stock} left in stock
            </p>
          ) : stock <= 5 ? (
            <p className="text-primary-soft mt-2 text-sm">
              Only {stock} left in stock
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="bg-surface-2 inline-flex h-10 items-center overflow-hidden rounded-xl border border-(--outline-strong)">
            <button
              type="button"
              aria-label={`Decrease quantity for ${item.product.name}`}
              disabled={isPending || unavailable || item.quantity <= 1}
              onClick={() => onQuantityChange(item, item.quantity - 1)}
              className="focus-amber text-text-muted hover:bg-surface-3 inline-flex h-full w-10 items-center justify-center transition disabled:opacity-35"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              aria-live="polite"
              className="meta-font text-foreground inline-flex w-10 justify-center text-sm font-semibold"
            >
              {isPending ? "..." : item.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity for ${item.product.name}`}
              disabled={
                isPending || unavailable || item.quantity >= quantityLimit
              }
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              className="focus-amber text-text-muted hover:bg-surface-3 inline-flex h-full w-10 items-center justify-center transition disabled:opacity-35"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onRemove(item)}
            className="focus-amber text-text-muted hover:text-secondary inline-flex items-center gap-2 text-xs transition disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>

      <p className="meta-font text-primary-soft self-start text-lg font-semibold sm:text-right">
        {formatPrice(itemSubtotal(item))}
      </p>
    </motion.article>
  );
}

function CartSummary({
  subtotal,
  hasInvalidItems,
}: {
  subtotal: number;
  hasInvalidItems: boolean;
}) {
  const canCheckout = subtotal > 0 && !hasInvalidItems;
  return (
    <aside className="bg-surface-2 border-surface-3 rounded-2xl border p-6 lg:sticky lg:top-24">
      <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
        Your selection
      </p>
      <h2 className="heading-font text-foreground mt-3 border-b border-(--outline-strong) pb-5 text-2xl">
        Order Summary
      </h2>
      <dl className="text-text-muted mt-5 space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="meta-font text-foreground">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>Shipping</dt>
          <dd className="text-right">Calculated at checkout</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>Discount</dt>
          <dd>--</dd>
        </div>
      </dl>
      <div className="border-surface-3 mt-6 flex items-center justify-between border-t pt-5">
        <span className="heading-font text-foreground text-lg">Total</span>
        <span className="title-font text-primary-soft text-2xl font-semibold">
          {formatPrice(subtotal)}
        </span>
      </div>
      {hasInvalidItems && (
        <p className="text-secondary mt-4 text-sm" role="alert">
          Update or remove unavailable items before checkout.
        </p>
      )}
      <Link
        href={canCheckout ? "/payment" : "#"}
        aria-disabled={!canCheckout}
        tabIndex={canCheckout ? undefined : -1}
        className={`meta-font mt-6 flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${canCheckout ? "bg-primary-soft text-primary-ink hover:bg-primary" : "bg-surface-3 text-text-muted pointer-events-none opacity-50"}`}
      >
        Proceed to Checkout
        <ArrowRight className="h-4 w-4" />
      </Link>
      <p className="text-text-muted mt-4 text-center text-xs">
        Final prices and inventory are verified securely at checkout.
      </p>
    </aside>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
      <div className="space-y-5">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="border-surface-3 flex gap-5 border-b py-6"
          >
            <div className="bg-surface-3 h-28 w-28 animate-pulse rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="bg-surface-3 h-6 w-2/3 animate-pulse rounded" />
              <div className="bg-surface-3 h-4 w-1/3 animate-pulse rounded" />
              <div className="bg-surface-3 h-10 w-28 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-surface-2 h-72 animate-pulse rounded-2xl" />
    </div>
  );
}

function EmptyCart() {
  return (
    <section className="bg-surface-2 border-surface-3 rounded-2xl border px-6 py-20 text-center">
      <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
        A quiet shelf awaits
      </p>
      <h2 className="heading-font text-foreground mt-4 text-4xl font-semibold">
        Your Bag is Waiting
      </h2>
      <p className="text-text-muted mx-auto mt-4 max-w-md text-sm leading-7">
        Your little collection of joy is currently empty. Discover something
        lovely for your atelier.
      </p>
      <Link
        href="/products"
        className="meta-font bg-primary-soft text-primary-ink hover:bg-primary mt-8 inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold transition"
      >
        Explore the Collection
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

export default function ShoppingCartPage() {
  const authStatus = useGlobalStore((state) => state.authStatus);
  const items = useCartStore((state) => state.items);
  const refreshCart = useCartStore((state) => state.refreshCart);
  const setCart = useCartStore((state) => state.setCart);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  async function loadCart() {
    setLoadState("loading");
    setError("");
    await refreshCart();
    const latestError = useCartStore.getState().error;
    if (latestError === "unauthorized") {
      setLoadState("unauthorized");
    } else if (latestError) {
      setError(latestError);
      setLoadState("error");
    } else {
      setLoadState("ready");
    }
  }

  useEffect(() => {
    if (authStatus === AuthStatus.Authenticated) void loadCart();
    if (authStatus === AuthStatus.Unauthenticated) setLoadState("unauthorized");
  }, [authStatus]);

  async function changeQuantity(item: CartItem, quantity: number) {
    if (quantity < 1 || quantity > item.product.stock) return;
    setPending(item.id);
    setError("");
    try {
      setCart(await updateCartItem(item.id, quantity));
    } catch {
      setError(
        "That quantity is no longer available. Your bag was not changed.",
      );
      await loadCart();
    } finally {
      setPending(null);
    }
  }

  async function removeItem(item: CartItem) {
    setPending(item.id);
    setError("");
    try {
      setCart(await removeCartItem(item.id));
    } catch {
      setError("We could not remove that item. Please try again.");
      await loadCart();
    } finally {
      setPending(null);
    }
  }

  if (authStatus === AuthStatus.Loading || loadState === "loading") {
    return (
      <main className="padding-inline min-h-dvh py-24">
        <CartHeader />
        <CartSkeleton />
      </main>
    );
  }

  if (loadState === "unauthorized") {
    return (
      <main className="padding-inline min-h-dvh py-24">
        <CartHeader />
        <section className="bg-surface-2 border-surface-3 rounded-2xl border px-6 py-20 text-center">
          <h2 className="heading-font text-foreground text-3xl font-semibold">
            Sign in to view your bag
          </h2>
          <p className="text-text-muted mx-auto mt-4 max-w-md text-sm leading-7">
            Your saved pieces are waiting securely with your account.
          </p>
          <Link
            href="/login?redirect=/cart"
            className="meta-font bg-primary-soft text-primary-ink mt-8 inline-flex h-12 items-center rounded-xl px-6 text-sm font-semibold"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  if (loadState === "error") {
    return (
      <main className="padding-inline min-h-dvh py-24">
        <CartHeader />
        <section className="bg-surface-2 border-surface-3 rounded-2xl border px-6 py-20 text-center">
          <h2 className="heading-font text-foreground text-3xl font-semibold">
            Your bag could not be opened
          </h2>
          <p className="text-text-muted mt-4 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => void loadCart()}
            className="meta-font bg-primary-soft text-primary-ink mt-8 inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </section>
      </main>
    );
  }

  const subtotal = items.reduce((total, item) => total + itemSubtotal(item), 0);
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const hasInvalidItems = items.some(
    (item) => !item.product.isActive || item.product.stock < item.quantity,
  );

  return (
    <main className="padding-inline min-h-dvh pt-24 pb-20">
      <CartHeader quantity={quantity} />
      {error && (
        <p className="text-secondary mb-5 text-sm" role="alert">
          {error}
        </p>
      )}
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start">
          <section>
            <div className="border-surface-3 mb-2 flex items-end justify-between border-b pb-4">
              <div>
                <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
                  Curated for you
                </p>
                <h2 className="heading-font text-foreground mt-2 text-3xl font-semibold">
                  Your Selection
                </h2>
              </div>
              <span className="text-text-muted text-sm">
                {quantity} {quantity === 1 ? "piece" : "pieces"}
              </span>
            </div>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  pending={pending}
                  onQuantityChange={(nextItem, nextQuantity) =>
                    void changeQuantity(nextItem, nextQuantity)
                  }
                  onRemove={(nextItem) => void removeItem(nextItem)}
                />
              ))}
            </AnimatePresence>
          </section>
          <CartSummary subtotal={subtotal} hasInvalidItems={hasInvalidItems} />
        </div>
      )}
    </main>
  );
}

function CartHeader({ quantity }: { quantity?: number }) {
  return (
    <header className="mb-10">
      <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
        Komorebi Gift Atelier
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="heading-font text-foreground text-5xl font-semibold sm:text-6xl">
            Your Bag
          </h1>
          <p className="text-text-muted mt-4 max-w-xl text-sm leading-7 sm:text-base">
            A considered collection of small joys, held for your next moment of
            giving.
          </p>
        </div>
        {quantity !== undefined && (
          <span className="meta-font text-text-muted text-sm">
            {quantity} {quantity === 1 ? "item" : "items"}
          </span>
        )}
      </div>
    </header>
  );
}
