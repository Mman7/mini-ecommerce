import type { ReactNode } from "react";

export function DashboardPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-surface-2 rounded-lg ${className}`}>
      {children}
    </section>
  );
}
