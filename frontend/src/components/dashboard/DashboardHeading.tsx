import type { ReactNode } from "react";

export function DashboardHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="meta-font text-primary mb-2 text-xs tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
          {title}
        </h1>
        <p className="text-text-muted mt-1 text-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}
