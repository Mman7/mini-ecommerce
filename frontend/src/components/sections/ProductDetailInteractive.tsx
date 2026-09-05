"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "../../api/product.api";
import { addCartItem } from "../../api/cart.api";
import { useCartStore } from "../../store/cart.store";
import { FavoriteButton } from "../ui/FavoriteButton";
import ProductCard from "../ui/ProductCard";

function imageUrl(url: string) {
  const normalized = url.replaceAll("\\", "/");
  const index = normalized.toLowerCase().lastIndexOf("/uploads/");
  return index >= 0 ? normalized.slice(index) : normalized;
}

export default function ProductDetailInteractive({
  product,
  recommendations,
}: {
  product: Product;
  recommendations: Product[];
}) {
  const router = useRouter();
  const images =
    product.productImages.length > 0
      ? product.productImages
      : [
          {
            id: 0,
            productId: product.productId,
            url: "/homepage/white-plush-rabbit-on-shelf.png",
            altText: product.name,
            sortOrder: 0,
            createdAt: "",
            updatedAt: "",
            isThumbnail: true,
          },
        ];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const [error, setError] = useState("");
  const setCart = useCartStore((state) => state.setCart);
  const stock = product.stock;

  async function addToCart(buyNow = false) {
    setError("");
    if (stock < 1) return;
    setStatus("adding");
    try {
      setCart(await addCartItem(product.productId, quantity));
      setStatus("added");
      if (buyNow) router.push("/payment");
    } catch (requestError) {
      if ((requestError as { status?: number }).status === 401) {
        router.push(`/login?redirect=/products/${product.productId}`);
        return;
      }
      setStatus("idle");
      setError(
        "We couldn&apos;t add this piece to your bag. Please try again.",
      );
    }
  }

  const currentImage = images[activeImage] ?? images[0];
  return (
    <>
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-4 lg:sticky lg:top-28">
            <div className="col-span-12 flex gap-3 overflow-x-auto pb-1 md:col-span-2 md:flex-col md:overflow-visible">
              {images.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={index === activeImage}
                  className={`focus-amber h-18 w-18 shrink-0 overflow-hidden rounded-xl border transition-transform hover:scale-[1.03] ${index === activeImage ? "border-primary" : "border-(--outline-strong)"}`}
                >
                  <img
                    src={imageUrl(image.url)}
                    alt={image.altText ?? product.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="col-span-12 md:col-span-10">
              <div className="shelf-surface bg-surface-2 relative aspect-4/5 overflow-hidden rounded-[1.6rem] border border-(--outline-strong)">
                <motion.img
                  key={currentImage.url}
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  src={imageUrl(currentImage.url)}
                  alt={currentImage.altText ?? product.name}
                  className="h-full w-full object-cover"
                />
                <FavoriteButton
                  productId={product.productId}
                  productName={product.name}
                />
              </div>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-5"
        >
          <span className="meta-font border-secondary/40 bg-secondary/15 text-secondary inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase">
            Atelier piece
          </span>
          <h1 className="heading-font text-foreground mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
            {product.name}
          </h1>
          <p className="title-font text-primary-soft mt-4 text-2xl font-semibold">
            ¥{Number(product.price).toLocaleString()}
          </p>
          <p className="text-text-muted mt-5 max-w-[54ch] text-[17px] leading-8">
            {product.description}
          </p>
          <div className="mt-8">
            <p className="meta-font text-foreground mb-3 text-sm font-semibold">
              Quantity
            </p>
            <div className="bg-surface-2 inline-flex h-11 w-34 items-center overflow-hidden rounded-xl border border-(--outline-strong)">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="focus-amber text-text-muted hover:bg-surface-3 inline-flex h-full w-11 items-center justify-center disabled:opacity-35"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="meta-font text-foreground inline-flex h-full flex-1 items-center justify-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= stock}
                onClick={() =>
                  setQuantity((value) => Math.min(stock, value + 1))
                }
                className="focus-amber text-text-muted hover:bg-surface-3 inline-flex h-full w-11 items-center justify-center disabled:opacity-35"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {stock > 0 && stock <= 5 && (
              <p className="text-primary-soft mt-2 text-sm">
                Only {stock} left
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={stock === 0 || status === "adding"}
              onClick={() => addToCart()}
              className="meta-font focus-amber bg-primary-soft text-primary-foreground inline-flex h-13 min-w-55 items-center justify-center gap-2 rounded-2xl px-8 text-[15px] font-bold shadow-[0_12px_32px_rgba(233,139,44,0.35)] transition hover:brightness-110 disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              {status === "adding"
                ? "Adding..."
                : status === "added"
                  ? "Added"
                  : stock === 0
                    ? "Sold out"
                    : "Add to Bag"}
            </button>
            <button
              type="button"
              disabled={stock === 0 || status === "adding"}
              onClick={() => addToCart(true)}
              className="meta-font focus-amber text-foreground hover:bg-surface-3 inline-flex h-13 min-w-35 items-center justify-center rounded-2xl border border-(--outline-strong) px-8 text-[15px] font-bold transition disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
          {error && (
            <p role="alert" className="text-secondary mt-3 text-sm">
              {error}
            </p>
          )}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-surface-2 rounded-2xl border border-white/8 px-4 py-4">
              <p className="meta-font text-foreground text-sm font-semibold">
                Crafted for collecting
              </p>
              <p className="text-text-muted mt-1 text-xs">
                A considered piece for your atelier shelf.
              </p>
            </div>
            <div className="bg-surface-2 rounded-2xl border border-white/8 px-4 py-4">
              <p className="meta-font text-foreground text-sm font-semibold">
                Stock checked live
              </p>
              <p className="text-text-muted mt-1 text-xs">
                Availability is confirmed when you add it.
              </p>
            </div>
          </div>
          <div className="mt-9 border-t border-white/10 pt-5">
            <details className="group border-b border-white/7 py-4" open>
              <summary className="heading-font text-foreground flex cursor-pointer list-none items-center justify-between text-[28px] leading-tight font-medium">
                Product details<span>⌄</span>
              </summary>
              <p className="text-text-muted mt-3 max-w-[58ch] text-[15px] leading-7">
                {product.description}
              </p>
            </details>
          </div>
        </motion.div>
      </section>
      {recommendations.length > 0 && (
        <section className="mt-18">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="heading-font text-foreground text-4xl leading-tight font-semibold sm:text-5xl">
                You might also love
              </h2>
              <p className="text-text-muted mt-2">
                Curated companion pieces for your collection.
              </p>
            </div>
            <Link
              href="/products"
              className="meta-font group text-primary-soft inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              Explore All
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((item) => (
              <ProductCard key={item.productId} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
