import type { ReactNode } from "react";

export function DashboardPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-surface-1/80 rounded-lg border border-(--glass-border) ${className}`}
    >
      {children}
    </section>
  );
}
