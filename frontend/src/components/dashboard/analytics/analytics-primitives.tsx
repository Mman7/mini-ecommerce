import type { ReactNode } from "react";
import { DashboardPanel } from "../index";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DashboardPanel className={`overflow-hidden ${className}`}>
      {children}
    </DashboardPanel>
  );
}

export function SectionTitle({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="heading-font text-foreground text-base font-semibold">
            {title}
          </h2>
          {icon}
        </div>
        <p className="meta-font text-text-muted mt-1 text-xs">{description}</p>
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = "amber",
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: "amber" | "pink" | "cyan" | "green";
}) {
  const toneClass = {
    amber: "text-primary-soft",
    pink: "text-secondary",
    cyan: "text-tertiary",
    green: "text-emerald-400",
  }[tone];
  return (
    <div className="bg-surface-1 hover:border-primary/50 rounded-lg  p-4 transition">
      <div className="flex items-start justify-between gap-3">
        <p className="meta-font text-text-muted text-xs tracking-wider uppercase">
          {label}
        </p>
        <span
          className={`bg-surface-3 flex h-8 w-8 items-center justify-center rounded-md ${toneClass}`}
        >
          {icon}
        </span>
      </div>
      <p className="heading-font text-foreground mt-3 text-xl font-semibold">
        {value}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-(--glass-border) pt-3">
        <span className="meta-font text-xs text-emerald-400">↗ {detail}</span>
      </div>
    </div>
  );
}

export function LedgerStat({
  label,
  value,
  tone = "text-foreground",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="border-l px-3 first:border-0">
      <p className="meta-font text-text-muted mb-1 text-xs">{label}</p>
      <p className={`text-xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export function Insight({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="bg-surface-2 rounded-md border border-(--glass-border) p-3">
      <p className="meta-font text-text-muted text-xs">{title}</p>
      <p className={`heading-font mt-1 text-xl font-semibold ${tone}`}>
        {value}
      </p>
      <p className="meta-font text-text-muted mt-1 text-xs">{detail}</p>
    </div>
  );
}

export function Progress({
  label,
  value,
  count,
  tone,
}: {
  label: string;
  value: number;
  count: string;
  tone: string;
}) {
  return (
    <div>
      <div className="meta-font mb-1 flex justify-between text-xs">
        <span>
          {label} ({value.toFixed(1)}%)
        </span>
        <strong>{count}</strong>
      </div>
      <div className="bg-surface-3 h-2 rounded-full">
        <div
          className={`${tone} h-full rounded-full`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function FooterStat({
  icon,
  label,
  value,
  tone = "text-foreground",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-text-muted ${tone}`}>{icon}</span>
      <div>
        <p className="meta-font text-text-muted text-xs uppercase">{label}</p>
        <p className={`text-sm font-semibold ${tone}`}>{value}</p>
      </div>
    </div>
  );
}
