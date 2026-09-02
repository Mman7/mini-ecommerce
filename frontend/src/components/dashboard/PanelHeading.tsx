import type { ReactNode } from "react";
import { TextInView } from "../motion/TextInView";

export function PanelHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
      <TextInView>
        <h2 className="heading-font text-foreground text-sm font-medium">
          {title}
        </h2>
      </TextInView>
      {action}
    </div>
  );
}
