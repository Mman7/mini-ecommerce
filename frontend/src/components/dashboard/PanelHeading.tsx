import type { ReactNode } from "react";

export function PanelHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
      <h2 className="heading-font text-foreground text-sm font-medium">
        {title}
      </h2>
      {action}
    </div>
  );
}
