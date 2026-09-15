"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  ["productId:asc", "Featured"],
  ["createdAt:desc", "Newest"],
  ["price:asc", "Price: Low to High"],
  ["price:desc", "Price: High to Low"],
  ["name:asc", "Name: A to Z"],
] as const;
// TODO add mobile filter with drawer

export default function SortingBar({ total }: { total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = `${searchParams.get("sortBy") ?? "productId"}:${searchParams.get("sortOrder") ?? "asc"}`;

  function updateSort(value: string) {
    const [sortBy, sortOrder] = value.split(":");
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-on-surface/65 mx-auto text-sm">
        Showing
        <span className="text-on-surface font-semibold">{` ${total} `}</span>
        products
      </p>
      <div className="meta-font flex items-center gap-3">
        <span className="text-on-surface/50 hidden text-sm md:block">
          Sort by:
        </span>
        <div className="relative">
          <select
            value={selected}
            onChange={(event) => updateSort(event.target.value)}
            className="text-primary bg-surface-2 appearance-none rounded-md border border-(--outline-strong) px-3 py-2 pr-10 text-sm font-semibold"
          >
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="text-on-surface/60 pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
}
