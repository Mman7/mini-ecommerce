"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "../../types/product";
import { addCartItem } from "../../api/cart.api";
import { useCartStore } from "../../store/cart.store";
import { Button } from "./Button";
import { FavoriteButton } from "./FavoriteButton";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const setCart = useCartStore((state) => state.setCart);

  async function addToCart() {
    setIsAdding(true);
    try {
      setCart(await addCartItem(product.productId, 1));
    } catch (error) {
      if ((error as { status?: number }).status === 401) {
        router.push(`/login?redirect=/products/${product.productId}`);
      }
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article className="group hover:border-primary/30 bg-surface-2 relative flex flex-col overflow-hidden rounded-md border border-white/6 shadow-[0_10px_28px_rgba(0,0,0,0.26)] transition-all duration-500">
      <Link
        href={`/products/${product.productId}`}
        className="bg-surface-container-high relative aspect-square overflow-hidden rounded-t-lg"
      >
        <img
          src={
            product.productImages.find((image) => image.isThumbnail)?.url ??
            product.productImages[0]?.url ??
            "/homepage/white-plush-rabbit-on-shelf.png"
          }
          alt={product.productImages[0]?.altText ?? product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {product.stock === 0 && (
          <span className="meta-font bg-surface-1 absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase">
            Sold out
          </span>
        )}
      </Link>
      <FavoriteButton
        productId={product.productId}
        productName={product.name}
      />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <Link
            href={`/products/${product.productId}`}
            className="text-headline-md font-headline-md text-on-surface group-hover:text-primary leading-tight transition-colors"
          >
            {product.name}
          </Link>
        </div>
        <p className="meta-font text-on-surface/38 text-[11px] font-semibold tracking-tight uppercase">
          {product.category?.name ?? "Komorebi collection"}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-headline-md font-display-lg title-font text-primary-soft! text-md leading-none font-semibold tracking-wide">
            ¥{Number(product.price).toLocaleString()}
          </span>
          <Button
            variant="primary"
            disabled={product.stock === 0}
            onClick={addToCart}
            className="meta-font flex scale-100 items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-semibold transition-transform active:scale-90"
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-current" />
            {isAdding ? "Adding" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
}
