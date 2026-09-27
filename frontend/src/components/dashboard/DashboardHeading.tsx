import type { ReactNode } from "react";
import { TextInView } from "../motion/TextInView";

export type DashboardHeadingLabelVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger";

export function DashboardHeading({
  eyebrow,
  title,
  titleLabel,
  titleLabelVariant = "neutral",
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  titleLabel?: string;
  titleLabelVariant?: DashboardHeadingLabelVariant;
  description: string;
  action?: ReactNode;
}) {
  const labelVariantClass = {
    neutral: "border-(--glass-border) bg-surface-2 text-text-muted",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    danger: "border-red-500/30 bg-red-500/10 text-red-300",
  }[titleLabelVariant];

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="meta-font text-primary mb-2 text-xs tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <TextInView className="flex items-center gap-3">
          <h1 className="heading-font text-foreground text-2xl font-semibold sm:text-3xl">
            {title}
          </h1>
          {titleLabel ? (
            <span
              className={`meta-font rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase ${labelVariantClass}`}
            >
              {titleLabel}
            </span>
          ) : null}
        </TextInView>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex gap-2">{action}</div>
    </div>
  );
}
