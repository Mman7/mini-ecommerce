"use client";

import Image from "next/image";
import { Bell, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

type WishlistProduct = {
  id: string;
  name: string;
  variant: string;
  price: string;
  image: string;
  availability: "in-stock" | "limited" | "out-of-stock";
};

export function WishlistProductCard({ product }: { product: WishlistProduct }) {
  const [saved, setSaved] = useState(true);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.availability === "out-of-stock";
  const availabilityLabel = {
    "in-stock": "In Stock",
    limited: "Only 2 left",
    "out-of-stock": "Out of Stock",
  }[product.availability];

  return (
    <article
      className={`bg-surface-1 group flex min-w-0 flex-col overflow-hidden rounded-lg transition hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(233,139,44,0.14)] ${isOutOfStock ? "opacity-75" : ""}`}
    >
      <div className="bg-surface-3 relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 220px, (min-width: 768px) 30vw, 50vw"
          className={`object-cover transition duration-500 group-hover:scale-105 ${isOutOfStock ? "grayscale-30" : ""}`}
        />
        <button
          type="button"
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => setSaved((current) => !current)}
          className="bg-background/65 text-secondary hover:bg-background absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition"
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <span
          className={`meta-font absolute bottom-3 left-3 rounded-full border px-2 py-1 text-[10px] font-semibold ${
            product.availability === "in-stock"
              ? "border-tertiary/30 bg-background/75 text-tertiary"
              : product.availability === "limited"
                ? "border-primary/30 bg-background/75 text-primary"
                : "bg-background/80 text-text-muted border-(--glass-border)"
          }`}
        >
          {availabilityLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h2 className="heading-font text-foreground truncate text-lg font-medium">
            {product.name}
          </h2>
          <p className="text-text-muted mt-1 truncate text-sm">
            {product.variant}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span
            className={`meta-font text-sm font-bold ${isOutOfStock ? "text-text-muted" : "text-primary"}`}
          >
            {product.price}
          </span>
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => setAdded(true)}
            className={`meta-font flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
              isOutOfStock
                ? "bg-surface-3 text-text-muted cursor-not-allowed"
                : added
                  ? "bg-tertiary/20 text-tertiary"
                  : "bg-primary text-primary-ink hover:bg-primary-soft"
            }`}
          >
            {isOutOfStock ? <Bell size={14} /> : <ShoppingBag size={14} />}
            {isOutOfStock ? "Notify" : added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
