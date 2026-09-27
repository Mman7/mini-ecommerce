import type { ReactNode } from "react";

export function DashboardPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-surface-2 rounded-sm p-3 ${className}`}>
      {children}
    </section>
  );
}
