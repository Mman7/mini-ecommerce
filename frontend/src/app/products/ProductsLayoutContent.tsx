"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Full-width listing wrapper; product detail pages render without it.
export default function ProductsLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/products/")) return children;

  return <main className="pb-15">{children}</main>;
}
