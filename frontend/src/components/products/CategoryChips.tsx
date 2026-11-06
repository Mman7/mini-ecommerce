"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Category } from "../../api/category.api";

const chipBase =
  "focus-amber shrink-0 rounded-full border h-10 min-[820px]:h-9 px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors";
const GAP = 8;
const DROPDOWN_WIDTH = 140;

export function chipClass(active: boolean) {
  return `${chipBase} ${
    active
      ? "border-primary bg-primary/[0.16] text-primary-soft"
      : "text-on-surface/75 hover:text-on-surface border-white/12 hover:border-white/25"
  }`;
}

// Number of chips that fit: the first `widths.length` chips if all fit, otherwise
// as many as possible while leaving room for the "More" dropdown.
function countFittingChips(widths: number[], available: number) {
  const total =
    widths.reduce((sum, width) => sum + width, 0) + GAP * (widths.length - 1);
  if (total <= available) return widths.length;

  let used = 0;
  let count = 0;
  for (const width of widths) {
    const next = used + (count > 0 ? GAP : 0) + width;
    if (next + GAP + DROPDOWN_WIDTH > available) break;
    used = next;
    count++;
  }
  return Math.max(count, 1);
}

export function CategoryChips({
  categories,
  activeId,
  onSelect,
  className = "",
}: {
  categories: Category[];
  activeId: number | null;
  onSelect: (id: number | null) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    setWidths(
      Array.from(
        measure.children,
        (child) => child.getBoundingClientRect().width,
      ),
    );
  }, [categories]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => setAvailable(element.clientWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Widths include "All" first; until measured, show every chip.
  const measured = widths.length === categories.length + 1;
  const shownCount = measured
    ? countFittingChips(widths, available)
    : categories.length + 1;
  const shownCategories = categories.slice(0, shownCount - 1);
  const hiddenCategories = categories.slice(shownCount - 1);
  const hiddenActive = hiddenCategories.some(
    (category) => category.categoryId === activeId,
  );

  return (
    <div
      ref={containerRef}
      className={`relative flex min-w-0 items-center gap-2 ${className}`}
    >
      <button
        type="button"
        aria-pressed={activeId === null}
        onClick={() => onSelect(null)}
        className={chipClass(activeId === null)}
      >
        All
      </button>
      {shownCategories.map((category) => (
        <button
          key={category.categoryId}
          type="button"
          aria-pressed={activeId === category.categoryId}
          onClick={() => onSelect(category.categoryId)}
          className={chipClass(activeId === category.categoryId)}
        >
          {category.name}
        </button>
      ))}
      {hiddenCategories.length > 0 && (
        <select
          aria-label="More categories"
          value={hiddenActive ? String(activeId) : ""}
          onChange={(event) => onSelect(Number(event.target.value))}
          className={`${chipClass(hiddenActive)} bg-surface-2 cursor-pointer`}
        >
          <option value="" disabled>
            More
          </option>
          {hiddenCategories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 flex gap-2 whitespace-nowrap"
      >
        <span className={chipClass(false)}>All</span>
        {categories.map((category) => (
          <span key={category.categoryId} className={chipClass(false)}>
            {category.name}
          </span>
        ))}
      </div>
    </div>
  );
}
