"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Heart, RefreshCw, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { getFavourites, removeFavourite } from "@/src/api/favourite.api";
import { addCartItem } from "@/src/api/cart.api";
import { getProduct, type Product } from "@/src/api/product.api";
import { useCartStore } from "@/src/store/cart.store";
import { WishlistProductCard } from "@/src/components/profile/WishlistProductCard";

type SortKey = "recent" | "price-asc" | "price-desc" | "name";
type WishlistItem = { product: Product; createdAt: string };

function sortProducts(products: WishlistItem[], sort: SortKey) {
  return [...products].sort((left, right) => {
    if (sort === "price-asc") return left.product.price - right.product.price;
    if (sort === "price-desc") return right.product.price - left.product.price;
    if (sort === "name")
      return left.product.name.localeCompare(right.product.name);
    return (
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  });
}

export default function WishlistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setCart = useCartStore((state) => state.setCart);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const sort = (searchParams.get("sort") as SortKey) || "recent";

  async function loadWishlist() {
    setLoading(true);
    setError(false);
    try {
      const { favourites } = await getFavourites();
      const products = await Promise.all(
        favourites.map(async (favourite) => {
          try {
            return {
              product:
                favourite.product ?? (await getProduct(favourite.productId)),
              createdAt: favourite.createdAt,
            };
          } catch {
            return null;
          }
        }),
      );
      setItems(
        products.filter(
          (item): item is WishlistItem =>
            item !== null && item.product !== null,
        ),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWishlist();
  }, []);

  async function handleRemove(productId: number) {
    await removeFavourite(productId);
    setItems((current) =>
      current.filter((item) => item.product.productId !== productId),
    );
  }

  async function handleAddToCart(productId: number) {
    try {
      setCart(await addCartItem(productId, 1));
      setMessage("Added to your cart.");
      window.setTimeout(() => setMessage(""), 2400);
    } catch (requestError) {
      if ((requestError as { status?: number }).status === 401) {
        router.push("/login?redirect=/profile/wishlist");
        return;
      }
      setMessage("We couldn't add that item. Please try again.");
    }
  }

  const sortedItems = sortProducts(items, sort);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="heading-font text-foreground text-3xl font-semibold sm:text-4xl">
              My Favourites
            </h1>
            <Heart
              className="text-secondary"
              size={24}
              fill="currentColor"
              aria-hidden="true"
            />
          </div>
          <p className="text-text-muted mt-2 text-sm sm:text-base">
            A little collection of things you&apos;ve fallen for.
          </p>
          <p className="meta-font text-primary mt-3 text-xs font-semibold tracking-[0.14em] uppercase">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {!loading && !error && items.length > 0 && (
          <label className="meta-font text-text-muted flex items-center gap-3 text-xs">
            Sort by
            <select
              value={sort}
              onChange={(event) =>
                router.push(`/profile/wishlist?sort=${event.target.value}`)
              }
              className="bg-surface-2 text-foreground focus-visible:ring-primary rounded-md border border-white/10 px-3 py-2 outline-none focus-visible:ring-2"
            >
              <option value="recent">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </label>
        )}
      </header>

      {message && (
        <p
          role="status"
          className="text-tertiary border-tertiary/20 bg-tertiary/10 rounded-md border px-4 py-3 text-sm"
        >
          {message}
        </p>
      )}
      {loading ? (
        <WishlistSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => void loadWishlist()} />
      ) : sortedItems.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {sortedItems.map(({ product }) => (
              <WishlistProductCard
                key={product.productId}
                product={product}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

function WishlistSkeleton() {
  return (
    <div
      aria-label="Loading favourites"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-surface-1 animate-pulse overflow-hidden rounded-2xl border border-white/8 p-3"
        >
          <div className="bg-surface-3 aspect-square rounded-xl" />
          <div className="space-y-3 p-2 pt-4">
            <div className="bg-surface-3 h-5 w-3/4 rounded" />
            <div className="bg-surface-3 h-4 w-1/3 rounded" />
            <div className="bg-surface-3 h-9 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-1 rounded-2xl border border-white/8 px-6 py-20 text-center">
      <Heart
        className="text-secondary mx-auto mb-5"
        size={36}
        fill="currentColor"
        aria-hidden="true"
      />
      <h2 className="heading-font text-2xl font-medium">Nothing here yet</h2>
      <p className="text-text-muted mx-auto mt-3 max-w-md">
        Save the little things that make you smile, and they&apos;ll appear
        here.
      </p>
      <Link
        href="/products"
        className="meta-font bg-primary text-primary-ink hover:bg-primary-soft mt-7 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition"
      >
        <ShoppingCart size={16} /> Explore the Collection
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="border-error/20 bg-surface-1 rounded-2xl border px-6 py-16 text-center"
    >
      <h2 className="heading-font text-2xl font-medium">
        Unable to load your favourites
      </h2>
      <p className="text-text-muted mt-3">
        Something went wrong while reaching the atelier.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="meta-font bg-primary text-primary-ink hover:bg-primary-soft mt-7 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition"
      >
        <RefreshCw size={16} /> Try Again
      </button>
    </div>
  );
}
