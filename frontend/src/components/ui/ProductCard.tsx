"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Product } from "../../types/product";
import { cartApi } from "../../api/cart.api";
import { useCartStore } from "../../store/cart.store";
import { FavoriteButton } from "./FavoriteButton";
import { ImageWithFallback } from "./ImageWithFallback";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { DEFAULT_PRODUCT_IMAGE } from "@/src/path/product_image_path";

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const setCart = useCartStore((state) => state.setCart);
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() < NEW_WINDOW_MS;
  const thumbnail =
    product.productImages.find((image) => image.isThumbnail) ??
    product.productImages[0];

  function navigateToProduct() {
    router.push(`/products/${product.slug}`);
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a, button")) {
      return;
    }

    navigateToProduct();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToProduct();
    }
  }

  async function addToCart() {
    if (isAdding || product.stock === 0) return;
    setIsAdding(true);
    try {
      setCart(await cartApi.addItem(product.productId, 1));
      toast.add({
        title: "Product added to cart",
        description: product.name,
        type: "success",
      });
    } catch (error) {
      if ((error as { status?: number }).status === 401) {
        toast.add({
          title: "Sign in required",
          description: "Please sign in to add products to your cart.",
          type: "error",
        });
        router.push(`/login?redirect=/products/${product.slug}`);
      } else {
        toast.add({
          title: "Unable to add product",
          description:
            error instanceof Error ? error.message : "Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article
      className="group relative cursor-pointer transition-transform duration-500 hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="bg-surface-2 group-hover:border-primary/40 relative aspect-square overflow-hidden rounded-2xl border border-white/6 transition-all duration-500 group-hover:shadow-[0_12px_32px_rgba(233,139,44,0.22)]">
        <Link
          href={`/products/${product.slug}`}
          className="bg-surface-container-high absolute inset-0"
        >
          <ImageWithFallback
            src={thumbnail?.url ?? DEFAULT_PRODUCT_IMAGE}
            fallbackSrc={DEFAULT_PRODUCT_IMAGE}
            alt={thumbnail?.altText ?? product.name}
            sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {product.stock === 0 ? (
          <span className="meta-font bg-surface-1 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase">
            Out of stock
          </span>
        ) : (
          isNew && (
            <span className="meta-font bg-primary text-primary-ink absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase">
              New
            </span>
          )
        )}
        <FavoriteButton
          productId={product.productId}
          productName={product.name}
        />
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          disabled={product.stock === 0 || isAdding}
          onClick={addToCart}
          className="bg-primary hover:bg-primary-soft focus-amber absolute right-3 bottom-3 z-10 flex size-11 items-center justify-center rounded-full text-(--primary-ink) shadow-(--glow) transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="mt-3 space-y-1 px-1">
        <Link
          href={`/products/${product.slug}`}
          className="text-on-surface group-hover:text-primary block truncate text-base font-medium transition-colors"
        >
          {product.name}
        </Link>
        <p className="meta-font text-on-surface/55 text-[11px] font-semibold tracking-tight uppercase">
          {product.category?.name ?? "Komorebi collection"}
        </p>
        <p className="title-font text-primary-soft! text-md pt-1 leading-none font-semibold tracking-wide">
          ¥{Number(product.price).toLocaleString()}
        </p>
      </div>
    </article>
  );
}
