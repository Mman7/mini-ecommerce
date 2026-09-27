import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { TextInView } from "../motion/TextInView";

export function PanelHeading({
  title,
  action,
  icon,
  titleClassName,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <TextInView>
          <h2
            className={`heading-font text-foreground flex items-center gap-2 text-sm font-medium ${titleClassName ?? ""}`}
          >
            {icon && <span>{icon}</span>}
            {title}
          </h2>
        </TextInView>
        {action}
      </div>
      <Separator className="text-primary mt-3" />
    </div>
  );
}
