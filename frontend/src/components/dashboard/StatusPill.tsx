import { DashboardStatus } from "./types/dashboard-status.enum";

export function StatusPill({ status }: { status: DashboardStatus | string }) {
  const normalized = status.toLowerCase();
  const style =
    normalized.includes(DashboardStatus.Active) ||
    normalized.includes(DashboardStatus.Delivered) ||
    normalized === DashboardStatus.Paid
      ? "bg-tertiary/15 text-tertiary"
      : normalized.includes(DashboardStatus.Stock) ||
          normalized.includes(DashboardStatus.Pending) ||
          normalized.includes(DashboardStatus.Processing) ||
          normalized === DashboardStatus.Vip
        ? "bg-primary/15 text-primary-soft"
        : normalized.includes(DashboardStatus.Cancelled) ||
            normalized.includes(DashboardStatus.Out)
          ? "bg-secondary/14 text-secondary"
          : normalized === DashboardStatus.Shipped ||
              normalized === DashboardStatus.Regular
            ? "bg-tertiary/13 text-tertiary"
            : "bg-(--glass-bg) text-text-muted";

  return (
    <span
      className={`meta-font inline-flex rounded px-2 py-1 text-xs leading-none ${style}`}
    >
      {status}
    </span>
  );
}
