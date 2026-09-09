"use client";

import {
  Bell,
  ChartNoAxesCombined,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Store,
  Tags,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logout as logoutRequest } from "@/src/api/auth.api";
import { useCartStore } from "@/src/store/cart.store";
import { useGlobalStore } from "@/src/store/global.store";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useGlobalStore((state) => state.user);
  const logout = useGlobalStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.clearCart);

  async function handleLogout() {
    try {
      await logoutRequest();
    } finally {
      logout();
      clearCart();
      router.push("/login");
    }
  }

  return (
    <div className="text-foreground bg-background min-h-screen">
      <div className="mx-auto grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="bg-surface-1 hidden border-r border-(--glass-border) lg:flex lg:flex-col">
          <DashboardBrand />
          <DashboardNavigation activeSection={activeSection} />
          <AdminIdentity
            userName={user?.name}
            onLogout={() => void handleLogout()}
          />
        </aside>

        <div className="min-w-0">
          <header className="bg-background border-b border-(--glass-border) px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-dashboard-navigation"
                  aria-label="Toggle dashboard navigation"
                  onClick={() => setMobileOpen((current) => !current)}
                  className="text-text-muted hover:border-primary hover:text-primary flex h-8 w-8 items-center justify-center rounded-md border border-(--glass-border) transition"
                >
                  {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
                <DashboardBrand compact />
              </div>
              <div className="relative hidden max-w-full flex-1 sm:block">
                <input
                  aria-label="Search dashboard"
                  type="search"
                  placeholder="Search anything..."
                  className="meta-font bg-surface-1 text-foreground focus:border-primary h-8 w-full rounded-md border border-(--glass-border) px-3 text-xs outline-none placeholder:text-(--outline)"
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

            <div
              id="mobile-dashboard-navigation"
              className={`${mobileOpen ? "block" : "hidden"} mt-3 border-t border-(--glass-border) pt-3 lg:hidden`}
            >
              <DashboardNavigation
                activeSection={activeSection}
                compact
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
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

function DashboardNavigation({
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

function AdminIdentity({
  userName,
  onLogout,
}: {
  userName?: string;
  onLogout: () => void;
}) {
  const initials = (userName ?? "Admin")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="mt-auto px-4 pb-5">
      <div className="mb-4 border-t border-(--glass-border)" />
      <div className="bg-surface-2 flex items-center gap-3 rounded-lg px-3 py-3">
        <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-foreground truncate text-xs font-medium">
            {userName ?? "Administrator"}
          </p>
          <p className="meta-font text-text-muted truncate text-xs">
            Administrator
          </p>
        </div>
        <button
          type="button"
          aria-label="Sign out"
          onClick={onLogout}
          className="text-text-muted hover:text-secondary ml-auto shrink-0 rounded p-1 transition"
        >
          <LogOut size={13} />
        </button>
      </div>
    </div>
  );
}
