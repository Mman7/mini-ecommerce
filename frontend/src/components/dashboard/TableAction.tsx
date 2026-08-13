import { Package, Pencil } from "lucide-react";
import Link from "next/link";

export function TableAction({
  label = "View",
  href,
}: {
  label?: string;
  href?: string;
}) {
  const content = href ? <Pencil size={13} /> : <Package size={13} />;
  const className =
    "hover:border-primary hover:text-primary-soft flex h-6 w-6 items-center justify-center rounded border border-(--glass-border) text-(--outline)";

  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={className}>
      {content}
    </button>
  );
}
