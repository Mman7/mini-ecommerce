import type { Metadata } from "next";
import type { ReactNode } from "react";
import ProductsLayoutContent from "./ProductsLayoutContent";

export const metadata: Metadata = {
  title: "Shop Kawaii Gifts and Artisan Treasures",
  description:
    "Browse kawaii gifts, Japanese-inspired stationery, plush collectibles, and small artisan treasures curated by Komorebi Gift Atelier.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Shop Kawaii Gifts and Artisan Treasures | Komorebi Gift Atelier",
    description:
      "Browse the curated collection of gifts, stationery, plush collectibles, and artisan treasures.",
    images: [{ url: "/homepage/komorebi-gift-atelier-store-display.png" }],
  },
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <ProductsLayoutContent>{children}</ProductsLayoutContent>;
}
