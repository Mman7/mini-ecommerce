"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/src/api/product.api";

type WishlistProductCardProps = {
  product: Product;
  onRemove: (productId: number) => Promise<void>;
  onAddToCart: (productId: number) => Promise<void>;
};

export function WishlistProductCard({
  product,
  onRemove,
  onAddToCart,
}: WishlistProductCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const image =
    product.productImages.find((item) => item.isThumbnail)?.url ??
    product.productImages[0]?.url ??
    "/homepage/white-plush-rabbit-on-shelf.png";
  const isOutOfStock = !product.isActive || product.stock < 1;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  async function handleRemove() {
    setIsRemoving(true);
    try {
      await onRemove(product.productId);
    } catch {
      setIsRemoving(false);
    }
  }

  async function handleAddToCart() {
    setIsAdding(true);
    try {
      await onAddToCart(product.productId);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isRemoving ? 0 : 1, scale: isRemoving ? 0.96 : 1 }}
      transition={{ duration: 0.24 }}
      className={`group bg-surface-1 flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/8 shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-shadow hover:shadow-[0_14px_34px_rgba(233,139,44,0.14)] ${isOutOfStock ? "opacity-75" : ""}`}
    >
      <div className="bg-surface-3 relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 220px, (min-width: 768px) 30vw, 50vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${isOutOfStock ? "grayscale" : ""}`}
        />
        <button
          type="button"
          aria-label={`Remove ${product.name} from favourites`}
          aria-busy={isRemoving}
          disabled={isRemoving}
          onClick={handleRemove}
          className="bg-surface-1 text-secondary hover:bg-surface-2 focus-visible:outline-primary absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition focus-visible:outline-2 disabled:cursor-wait"
        >
          <Heart size={19} fill="currentColor" />
        </button>
        <span
          className={`meta-font bg-surface-1 absolute bottom-3 left-3 rounded-full border px-2 py-1 text-[10px] font-semibold ${isOutOfStock ? "text-text-muted border-white/10" : isLowStock ? "border-primary/30 text-primary" : "border-tertiary/30 text-tertiary"}`}
        >
          {isOutOfStock
            ? product.isActive
              ? "Out of Stock"
              : "Unavailable"
            : isLowStock
              ? `Only ${product.stock} left`
              : "In Stock"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <Link
            href={`/products/${product.productId}`}
            className="heading-font hover:text-primary focus-visible:outline-primary block truncate text-lg font-medium transition focus-visible:outline-2"
          >
            {product.name}
          </Link>
          <p className="text-text-muted mt-1 truncate text-sm">
            {product.category?.name ?? "Komorebi collection"}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span
            className={`meta-font text-sm font-bold ${isOutOfStock ? "text-text-muted" : "text-primary"}`}
          >
            RM {Number(product.price).toFixed(2)}
          </span>
          <button
            type="button"
            disabled={isOutOfStock || isAdding}
            onClick={handleAddToCart}
            className="meta-font bg-primary text-primary-ink hover:bg-primary-soft focus-visible:outline-primary disabled:bg-surface-3 disabled:text-text-muted flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            {isAdding ? "Adding" : isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
