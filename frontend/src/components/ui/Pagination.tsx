"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  query = "",
}: {
  page: number;
  totalPages: number;
  total: number;
  query: string;
}) {
  if (totalPages <= 1)
    return (
      <p className="text-text-muted mt-8 text-center text-sm">
        {total} treasures in this collection
      </p>
    );
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (value) =>
      value === 1 || value === totalPages || Math.abs(value - page) <= 1,
  );
  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams(query);
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    return `/products?${params.toString()}`;
  };
  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Link
        aria-label="Previous page"
        href={hrefFor(page - 1)}
        aria-disabled={page === 1}
        className={`bg-surface-3 text-on-surface/70 flex h-8 w-8 items-center justify-center rounded-full ${page === 1 ? "pointer-events-none opacity-35" : ""}`}
      >
        <ChevronLeft className="h-3.5 w-3.5 stroke-current" />
      </Link>
      {pages.map((item, index) => (
        <span key={item} className="contents">
          {index > 0 && pages[index - 1] !== item - 1 && (
            <span className="text-on-surface/55 px-1">...</span>
          )}
          <Link
            href={hrefFor(item)}
            aria-current={item === page ? "page" : undefined}
            className={`meta-font flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${
              item === page
                ? "bg-primary text-on-primary shadow-[0_6px_18px_rgba(233,139,44,0.18)]"
                : "bg-surface-3 text-on-surface/70"
            }`}
          >
            {item}
          </Link>
        </span>
      ))}
      <Link
        aria-label="Next page"
        href={hrefFor(page + 1)}
        aria-disabled={page === totalPages}
        className={`bg-surface-3 text-on-surface/70 flex h-8 w-8 items-center justify-center rounded-full ${page === totalPages ? "pointer-events-none opacity-35" : ""}`}
      >
        <ChevronRight className="h-3.5 w-3.5 stroke-current" />
      </Link>
    </nav>
  );
}
