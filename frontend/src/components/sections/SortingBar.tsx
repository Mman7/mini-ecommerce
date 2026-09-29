"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <p className="text-on-surface/65 mx-auto text-sm">
        Showing
        <span className="text-on-surface font-semibold">{` ${total} `}</span>
        products
      </p>
      <div className="meta-font flex items-center gap-3">
        <span className="text-on-surface/50 hidden text-sm md:block">
          Sort by:
        </span>
        <Select
          value={selected}
          items={options.map(([value, label]) => ({ value, label }))}
          onValueChange={(value) => {
            if (value) updateSort(value);
          }}
        >
          <SelectTrigger
            aria-label="Sort products"
            className="text-primary bg-surface-2 w-48 border-(--outline-strong) font-semibold"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {options.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
