import { CalendarDays, Check, ChevronDown, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AnalyticsRange } from "./analytics.types";

export const analyticsRanges = [
  { value: "1d", label: "Today", days: 1 },
  { value: "7d", label: "7D", days: 7 },
  { value: "30d", label: "Last 30 Days", days: 30 },
  { value: "90d", label: "90D", days: 90 },
] as const;

export function AnalyticsHeader({
  selectedRange,
  onRangeChange,
  onExport,
}: {
  selectedRange: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
  onExport: () => void;
}) {
  const selectedLabel = analyticsRanges.find(
    (range) => range.value === selectedRange,
  )?.label;
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="meta-font bg-surface-1 text-text-muted hover:border-primary hover:text-primary-soft inline-flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs"
            />
          }
        >
          <CalendarDays size={13} /> {selectedLabel} <ChevronDown size={13} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {analyticsRanges.map((range) => (
            <DropdownMenuItem
              key={range.value}
              onClick={() => onRangeChange(range.value)}
              className="justify-between"
            >
              {range.label}
              {range.value === selectedRange && (
                <Check size={14} className="text-primary-soft" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        type="button"
        onClick={onExport}
        className="meta-font bg-surface-2 text-foreground hover:border-primary inline-flex h-8 items-center gap-2 rounded-md border border-(--glass-border) px-3 text-xs"
      >
        <Download size={13} className="text-primary-soft" /> Export Products CSV
      </button>
    </div>
  );
}
