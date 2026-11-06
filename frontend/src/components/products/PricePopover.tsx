"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRICE_CEIL, PRICE_FLOOR, PRICE_STEP } from "@/src/lib/product-filters";
import { Button } from "../ui/Button";
import { chipClass } from "./CategoryChips";

const thumbClass =
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-1 [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-1 [&::-moz-range-thumb]:bg-primary";

export function formatYen(value: number) {
  return `¥${value.toLocaleString()}`;
}

function formatUpper(max: number | null) {
  return max === null ? `${formatYen(PRICE_CEIL)}+` : formatYen(max);
}

export function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number | null;
  onChange: (min: number, max: number | null) => void;
}) {
  const upper = max ?? PRICE_CEIL;
  const percent = (value: number) =>
    ((value - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  return (
    <div>
      <div className="relative h-6">
        <div className="bg-surface-3 absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full" />
        <div
          className="bg-primary absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{
            left: `${percent(min)}%`,
            right: `${100 - percent(upper)}%`,
          }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={PRICE_FLOOR}
          max={PRICE_CEIL}
          step={PRICE_STEP}
          value={min}
          onChange={(event) =>
            onChange(Math.min(Number(event.target.value), upper), max)
          }
          className={`focus-amber pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent ${thumbClass}`}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={PRICE_FLOOR}
          max={PRICE_CEIL}
          step={PRICE_STEP}
          value={upper}
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), min);
            onChange(min, next >= PRICE_CEIL ? null : next);
          }}
          className={`focus-amber pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent ${thumbClass}`}
        />
      </div>
      <div className="text-on-surface/75 meta-font mt-2 flex justify-between text-sm">
        <span>{formatYen(min)}</span>
        <span>{formatUpper(max)}</span>
      </div>
    </div>
  );
}

export function PricePopover({
  min,
  max,
  onApply,
}: {
  min: number;
  max: number | null;
  onApply: (min: number, max: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ min, max });
  const rootRef = useRef<HTMLDivElement>(null);
  const active = min > PRICE_FLOOR || max !== null;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open) setDraft({ min, max });
    setOpen(!open);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggle}
        className={`${chipClass(active)} inline-flex items-center gap-1.5`}
      >
        {active ? `${formatYen(min)}–${formatUpper(max)}` : "Price"}
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Price range"
          className="bg-surface-1/95 absolute top-full left-0 z-50 mt-2 w-72 rounded-2xl border border-white/10 p-4 shadow-xl backdrop-blur-xl"
        >
          <PriceRange
            min={draft.min}
            max={draft.max}
            onChange={(nextMin, nextMax) =>
              setDraft({ min: nextMin, max: nextMax })
            }
          />
          <Button
            variant="primary"
            onClick={() => {
              onApply(draft.min, draft.max);
              setOpen(false);
            }}
            className="mt-4 w-full rounded-full"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
