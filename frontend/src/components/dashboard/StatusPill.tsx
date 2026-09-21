import { DashboardStatus } from "./types/dashboard-status.enum";

const STATUS_STYLES = {
  success: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  primary: "border border-primary/30 bg-primary/15 text-primary-soft",
  danger: "border border-red-500/20 bg-red-500/10 text-red-300",
  neutral: "border border-(--glass-border) bg-(--glass-bg) text-text-muted",
} as const;

function getStatusStyle(status: DashboardStatus | string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes(DashboardStatus.Active) ||
    normalized.includes(DashboardStatus.Delivered) ||
    normalized === DashboardStatus.Paid
  ) {
    return STATUS_STYLES.success;
  }

  if (normalized === DashboardStatus.Vip) {
    return "border border-secondary/30 bg-secondary/15 text-secondary";
  }

  if (
    normalized.includes(DashboardStatus.Stock) ||
    normalized.includes(DashboardStatus.Pending) ||
    normalized.includes(DashboardStatus.Processing) ||
    normalized === DashboardStatus.Vip
  ) {
    return STATUS_STYLES.primary;
  }

  if (
    normalized.includes(DashboardStatus.Cancelled) ||
    normalized.includes(DashboardStatus.Out)
  ) {
    return STATUS_STYLES.danger;
  }

  if (normalized === DashboardStatus.Shipped) {
    return "border border-tertiary/30 bg-tertiary/15 text-tertiary";
  }

  if (normalized === DashboardStatus.Regular) {
    return STATUS_STYLES.success;
  }

  return STATUS_STYLES.neutral;
}

export function StatusPill({ status }: { status: DashboardStatus | string }) {
  return (
    <span
      className={`meta-font inline-flex rounded px-2 py-1 text-xs leading-none ${getStatusStyle(status)}`}
    >
      {status}
    </span>
  );
}
