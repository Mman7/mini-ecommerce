"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  total = 9,
}: {
  page?: number;
  total?: number;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visiblePages = [1, 2, 3, "ellipsis", total] as const;
  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        aria-label="Previous page"
        className="bg-surface-3 text-on-surface/70 flex h-8 w-8 items-center justify-center rounded-full"
      >
        <ChevronLeft className="h-3.5 w-3.5 stroke-current" />
      </button>
      {visiblePages.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="text-on-surface/55 flex h-8 w-8 items-center justify-center text-sm"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            aria-current={item === page ? "page" : undefined}
            className={`meta-font flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${
              item === page
                ? "bg-primary text-on-primary shadow-[0_6px_18px_rgba(233,139,44,0.18)]"
                : "bg-surface-3 text-on-surface/70"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        aria-label="Next page"
        className="bg-surface-3 text-on-surface/70 flex h-8 w-8 items-center justify-center rounded-full"
      >
        <ChevronRight className="h-3.5 w-3.5 stroke-current" />
      </button>
    </nav>
  );
}
