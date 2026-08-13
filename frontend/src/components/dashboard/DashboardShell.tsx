import {
  Bell,
  ChartNoAxesCombined,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Tags,
  Search,
  Settings,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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

type DashboardShellProps = {
  activeSection: DashboardSection;
  children: ReactNode;
};

export function DashboardShell({
  activeSection,
  children,
}: DashboardShellProps) {
  return (
    <div className="text-foreground bg-background min-h-screen">
      <div className="mx-auto grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="bg-surface-1 hidden border-r border-(--glass-border) lg:flex lg:flex-col">
          <DashboardBrand />

          <nav className="px-4 pt-8" aria-label="Dashboard navigation">
            <div className="space-y-2">
              {navigation.map((item) => (
                <DashboardNavLink
                  key={item.key}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  active={item.key === activeSection}
                />
              ))}
            </div>
          </nav>

          <div className="mt-auto px-4 pb-5">
            <div className="mb-4 border-t border-(--glass-border)" />
            <div className="flex items-center gap-3 rounded-lg bg-(--glass-bg) px-3 py-3">
              <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-(--primary-ink)">
                EM
              </div>
              <div className="min-w-0">
                <p className="text-foreground truncate text-xs font-medium">
                  Eric Man
                </p>
                <p className="meta-font text-text-muted truncate text-xs">
                  Administrator
                </p>
              </div>
              <LogOut className="ml-auto shrink-0 text-(--outline)" size={13} />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="bg-background/95 border-b border-(--glass-border) px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <DashboardBrand compact />
              </div>
              <div className="relative hidden max-w-full flex-1 sm:block">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-(--outline)"
                  size={14}
                />
                <input
                  aria-label="Search dashboard"
                  type="search"
                  placeholder="Search anything..."
                  className="meta-font bg-surface-1 text-foreground focus:border-primary h-8 w-full rounded-md border border-(--glass-border) pl-9 text-xs outline-none placeholder:text-(--outline)"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="text-text-muted hover:border-primary hover:text-primary-soft relative flex h-8 w-8 items-center justify-center rounded-md border border-(--glass-border) transition"
                >
                  <Bell size={14} />
                  <span className="bg-primary absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full" />
                </button>
                <button
                  type="button"
                  aria-label="Store settings"
                  className="text-text-muted hover:border-primary hover:text-primary-soft flex h-8 w-8 items-center justify-center rounded-md border border-(--glass-border) transition"
                >
                  <Store size={14} />
                </button>
              </div>
            </div>

            <nav
              className="mt-3 flex gap-1 overflow-x-auto lg:hidden"
              aria-label="Mobile dashboard navigation"
            >
              {navigation.map((item) => (
                <DashboardNavLink
                  key={item.key}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  active={item.key === activeSection}
                  compact
                />
              ))}
            </nav>
          </header>

          <main className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className={`flex items-center ${compact ? "gap-2" : "justify-center px-7 py-8"}`}
    >
      <span
        className={`title-font block font-semibold tracking-wide whitespace-nowrap ${compact ? "text-primary-soft text-sm" : "text-foreground text-xl"}`}
      >
        Komorebi Gift Atelier
      </span>
    </Link>
  );
}

function DashboardNavLink({
  label,
  href,
  icon: Icon,
  active,
  compact = false,
}: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`meta-font flex items-center gap-3 rounded-md text-sm transition ${
        compact
          ? "px-3 py-2 whitespace-nowrap"
          : "rounded-none px-5 py-4 text-base"
      } ${
        active
          ? "bg-surface-2 text-primary shadow-(--glow)"
          : "text-text-muted hover:text-foreground hover:bg-(--glass-bg)"
      }`}
    >
      <Icon size={14} strokeWidth={active ? 2.3 : 1.8} />
      {label}
    </Link>
  );
}
