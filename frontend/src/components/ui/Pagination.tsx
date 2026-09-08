"use client";

import { Fragment } from "react";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    <PaginationRoot className="mt-8" aria-label="Pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hrefFor(page - 1)}
            aria-disabled={page === 1}
            className={`bg-surface-3 text-on-surface/70 hover:bg-surface-4 hover:text-on-surface ${page === 1 ? "pointer-events-none opacity-35" : ""}`}
            text=""
          />
        </PaginationItem>
        {pages.map((item, index) => (
          <Fragment key={item}>
            {index > 0 && pages[index - 1] !== item - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href={hrefFor(item)}
                isActive={item === page}
                className={`meta-font text-[13px] font-semibold ${
                  item === page
                    ? "!bg-primary !text-on-primary !border-transparent shadow-[0_6px_18px_rgba(233,139,44,0.18)]"
                    : "!bg-surface-3 !text-on-surface/70 hover:!bg-surface-4 hover:!text-on-surface !border-transparent"
                }`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          </Fragment>
        ))}
        <PaginationItem>
          <PaginationNext
            href={hrefFor(page + 1)}
            aria-disabled={page === totalPages}
            className={`bg-surface-3 text-on-surface/70 hover:bg-surface-4 hover:text-on-surface ${page === totalPages ? "pointer-events-none opacity-35" : ""}`}
            text=""
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
