"use client";

import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type SortValue } from "@/src/lib/product-filters";
import { BottomSheet } from "../ui/BottomSheet";

export function SortSelect({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  return (
    <Select
      value={value}
      items={SORT_OPTIONS.map(({ value, label }) => ({ value, label }))}
      onValueChange={(next) => {
        if (next) onChange(next as SortValue);
      }}
    >
      <SelectTrigger
        aria-label="Sort products"
        className="text-on-surface bg-surface-2 h-9 w-52 rounded-full border-white/12 text-[13px] font-semibold"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SortSheet({
  value,
  onChange,
  onClose,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet title="Sort by" onClose={onClose}>
      <div role="radiogroup" aria-label="Sort by" className="flex flex-col">
        {SORT_OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                onChange(option.value);
                onClose();
              }}
              className="focus-amber text-on-surface flex min-h-12 w-full items-center justify-between px-2 text-left text-base"
            >
              {option.label}
              {selected && (
                <Check
                  aria-hidden="true"
                  className="text-primary-soft size-5"
                />
              )}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
