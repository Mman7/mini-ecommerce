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
      <p className="text-on-surface/65 text-[15px]">
        Showing <span className="text-on-surface font-semibold">{total}</span>
        products
      </p>
      <div className="meta-font flex items-center gap-3">
        <span className="text-on-surface/50 hidden text-[12px] md:block">
          Sort by:
        </span>
        <select
          value={selected}
          onChange={(event) => updateSort(event.target.value)}
          className="text-primary bg-surface-2 inline-flex items-center gap-1.5 rounded-md border border-(--outline-strong) px-3 py-2 text-[14px] font-semibold"
        >
          {options.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="hidden">
          <ChevronDown className="text-on-surface/60 h-3.5 w-3.5 stroke-current" />
        </span>
      </div>
    </div>
  );
}
