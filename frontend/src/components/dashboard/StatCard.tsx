"use client";
import type { ReactNode } from "react";
import CountUp from "../motion/CountUp";

type StatCardAccent = "amber" | "pink" | "cyan" | "green";

const accentStyles: Record<StatCardAccent, string> = {
  amber: "bg-surface-2 text-primary-soft",
  pink: "bg-surface-2 text-secondary",
  cyan: "bg-surface-2 text-primary-soft",
  green: "bg-surface-2 text-tertiary",
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
        <p className={`meta-font text-sm ${accentStyles[accent]}`}>{label}</p>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentStyles[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="heading-font text-foreground mt-4 text-2xl font-medium">
        {typeof parseFloat(value) === "number" && !isNaN(parseFloat(value)) ? (
          <CountUp
            duration={0.2}
            to={parseFloat(value)}
            className="heading-font text-foreground mt-4 text-2xl font-medium"
          />
        ) : (
          value
        )}
      </p>
      <p
        className={`meta-font mt-1 bg-transparent text-sm opacity-75 ${accentStyles[accent]}`}
      >
        {detail}
      </p>
    </div>
  );
}
