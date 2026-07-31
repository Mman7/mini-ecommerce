"use client";

import type { Product } from "../../types/product";
import { Button } from "./Button";
import Label from "./Label";
import { Heart, Star, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group hover:border-primary/30 flex flex-col overflow-hidden rounded-md border border-white/6 bg-[linear-gradient(180deg,rgba(44,42,46,0.86),rgba(33,31,35,0.96))] shadow-[0_10px_28px_rgba(0,0,0,0.26)] transition-all duration-500">
      <div className="bg-surface-container-high relative aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute top-4 left-4">
          <Label variant={product.variant}>{product.label}</Label>
        </div>

        <button className="text-on-surface/80 hover:text-secondary absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-md transition-colors">
          <Heart className="h-4 w-4 stroke-current" />
        </button>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary leading-tight transition-colors">
            {product.name}
          </h3>
          <div className="text-primary-soft! flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current stroke-current" />
            <span className="text-primary-soft! text-md text-[12px] leading-none font-semibold tracking-wide">
              {product.rating?.toFixed(1) ?? "—"}
            </span>
          </div>
        </div>
        <p className="meta-font text-on-surface/38 text-[11px] font-semibold tracking-tight uppercase">
          {product.brand}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-headline-md font-display-lg title-font text-primary-soft! text-md leading-none font-semibold tracking-wide">
            ¥{product.price.toLocaleString()}
          </span>
          <Button
            variant="primary"
            className="meta-font flex scale-100 items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-semibold transition-transform active:scale-90"
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-current" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}
