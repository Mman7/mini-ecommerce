"use client";

import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout as logoutRequest } from "@/src/api/auth.api";
import { useGlobalStore } from "@/src/store/global.store";

export type ProfileSection =
  "profile" | "orders" | "wishlist" | "addresses" | "settings";

type ProfileSidebarProps = {
  activeSection?: ProfileSection;
};

const navigation = [
  {
    key: "profile" as const,
    label: "Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    key: "orders" as const,
    label: "My Orders",
    href: "/profile/orders",
    icon: Package,
  },
  {
    key: "wishlist" as const,
    label: "Wishlist",
    href: "/profile/wishlist",
    icon: Heart,
  },
  {
    key: "addresses" as const,
    label: "Addresses",
    href: "/profile/addresses",
    icon: MapPin,
  },
  {
    key: "settings" as const,
    label: "Settings",
    href: "/profile/settings",
    icon: Settings,
  },
];

export function ProfileSidebar({
  activeSection = "profile",
}: ProfileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useGlobalStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <aside className="flex flex-col gap-5 md:sticky md:top-24 md:h-[calc(100dvh-7rem)]">
      <nav
        aria-label="Profile navigation"
        className="glass-panel rounded-lg p-3"
      >
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 md:grid-cols-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.key !== "profile" &&
                pathname.startsWith(`${item.href}/`)) ||
              (!pathname && item.key === activeSection);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`meta-font flex items-center justify-center gap-2 rounded-md px-3 py-3 text-xs transition sm:justify-start md:px-4 ${
                  active
                    ? "border-primary bg-surface-2 text-primary border-l-2"
                    : "text-text-muted hover:text-foreground hover:bg-(--glass-bg)"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="meta-font glass-panel text-text-muted hover:border-error/40 hover:text-error border-error/20 flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-xs transition md:mt-auto"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </aside>
  );
}
