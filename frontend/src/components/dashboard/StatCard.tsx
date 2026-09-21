"use client";
import type { ReactNode } from "react";
import CountUp from "../motion/CountUp";

type StatCardAccent = "amber" | "pink" | "cyan" | "green";

const accentStyles: Record<StatCardAccent, string> = {
  amber: "text-primary-soft",
  pink: "text-secondary",
  cyan: "text-tertiary",
  green: "text-emerald-400",
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
    <div className="bg-surface-1 rounded-lg border border-(--glass-border) p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="meta-font text-text-muted text-sm">{label}</p>
        <span
          className={`bg-surface-2 flex h-10 w-10 items-center justify-center rounded-lg ${accentStyles[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="heading-font text-foreground mt-4 text-2xl font-medium">
        {typeof parseFloat(value) === "number" && !isNaN(parseFloat(value)) ? (
          <CountUp
            duration={0.1}
            to={parseFloat(value)}
            className="heading-font text-foreground mt-4 text-2xl font-medium"
          />
        ) : (
          value
        )}
      </p>
      <p
        className={`meta-font mt-1 bg-transparent text-sm opacity-90 ${accentStyles[accent]}`}
      >
        {detail}
      </p>
    </div>
  );
}
