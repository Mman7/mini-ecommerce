import {
  ChartNoAxesCombined,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";

export type DashboardSection =
  | "overview"
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "analytics"
  | "settings";

const navigation = [
  {
    key: "overview" as const,
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "products" as const,
    label: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    key: "categories" as const,
    label: "Categories",
    href: "/dashboard/categories",
    icon: Tags,
  },
  {
    key: "orders" as const,
    label: "Orders",
    href: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    key: "customers" as const,
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    key: "analytics" as const,
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    key: "settings" as const,
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardNavigation({
  activeSection,
  compact = false,
  onNavigate,
}: {
  activeSection: DashboardSection;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav
      className={compact ? "grid gap-1 sm:grid-cols-2" : "px-4 pt-8"}
      aria-label="Dashboard navigation"
    >
      <div className={compact ? "contents" : "space-y-2"}>
        {navigation.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={item.key === activeSection ? "page" : undefined}
            onClick={onNavigate}
            className={`meta-font flex items-center gap-3 rounded-md text-sm transition ${compact ? "px-3 py-2" : "rounded-none px-5 py-4 text-base"} ${item.key === activeSection ? "border-primary border-l-5" : "text-text-muted hover:text-foreground hover:bg-surface-3"}`}
          >
            <item.icon
              size={14}
              strokeWidth={item.key === activeSection ? 2.3 : 1.8}
            />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
