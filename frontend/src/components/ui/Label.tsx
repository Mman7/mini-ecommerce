"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "new" | "limited" | "collector" | string;
  className?: string;
};

export default function Label({ children, variant, className = "" }: Props) {
  const base = "rounded-full  text-xs font-semibold tracking-widest uppercase";

  let variantClass = "bg-primary-soft! text-(--outline-strong)"; // primary

  if (variant === "limited")
    variantClass = "bg-secondary text-(--outline-strong)";

  if (variant === "collector")
    variantClass = "bg-tertiary text-(--outline-strong)";

  if (variant === "new")
    variantClass = "bg-primary-soft text-(--outline-strong)";

  return (
    <span
      className={`${base} ${variantClass} ${children ? "px-3 py-1" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
