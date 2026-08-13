import type { ReactNode } from "react";

type StatCardAccent = "amber" | "pink" | "cyan" | "green";

const accentStyles: Record<StatCardAccent, string> = {
  amber: "bg-primary/15 text-primary-soft",
  pink: "bg-secondary/12 text-secondary",
  cyan: "bg-primary-soft/12 text-primary-soft",
  green: "bg-tertiary/12 text-tertiary",
};

export function StatCard({
  label,
  value,
  detail,
  accent = "amber",
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: StatCardAccent;
  icon: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-(--glass-border) p-4 ${accentStyles[accent]} `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="meta-font text-text-muted text-sm">{label}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentStyles[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="heading-font text-foreground mt-4 text-2xl font-medium">
        {value}
      </p>
      <p className="meta-font mt-1 text-sm text-(--outline)">{detail}</p>
    </div>
  );
}
