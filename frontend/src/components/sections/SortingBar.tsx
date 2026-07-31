"use client";

import { ChevronDown } from "lucide-react";

export default function SortingBar() {
  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-on-surface/65 text-[15px]">
        Showing <span className="text-on-surface font-semibold">24</span> of 210
        products
      </p>
      <div className="meta-font flex items-center gap-3">
        <span className="text-on-surface/50 hidden text-[12px] md:block">
          Sort by:
        </span>
        <button
          type="button"
          className="text-primary inline-flex items-center gap-1.5 text-[14px] font-semibold"
          aria-label="Sort by newest first"
        >
          Newest First
          <ChevronDown className="text-on-surface/60 h-3.5 w-3.5 stroke-current" />
        </button>
      </div>
    </div>
  );
}
