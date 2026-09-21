"use client";

import { ArrowUpRight, Bell, LogOut, Menu, Store, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authApi } from "@/src/api/auth.api";
import { useCartStore } from "@/src/store/cart.store";
import { useGlobalStore } from "@/src/store/global.store";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DashboardNavigationSidebar,
  type DashboardSection,
} from "./DashboardNavigationSidebar";

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
      await authApi.logout();
    } finally {
      logout();
      clearCart();
      router.push("/login");
    }
  }

  return (
    <div className="text-foreground bg-background min-h-screen">
      <div className="mx-auto grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* desktop sidebar */}
        <aside className="bg-surface-1 hidden self-start lg:sticky lg:top-0 lg:flex lg:h-screen lg:max-h-screen lg:flex-col lg:overflow-y-auto">
          <DashboardBrand />
          <DashboardNavigationSidebar activeSection={activeSection} />
          <AdminIdentity
            userName={user?.name}
            onLogout={() => void handleLogout()}
          />
        </aside>

        {/* main content area */}
        <div className="min-w-0">
          <header className="bg-background px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* mobile sidebar trigger */}
              <div className="flex items-center gap-3 lg:hidden">
                <Drawer
                  open={mobileOpen}
                  onOpenChange={setMobileOpen}
                  swipeDirection="left"
                >
                  <DrawerTrigger
                    render={
                      <button
                        type="button"
                        aria-label="Toggle dashboard navigation"
                        className="text-text-muted hover:border-primary hover:text-primary flex h-8 w-8 items-center justify-center rounded-md border border-(--glass-border) transition"
                      />
                    }
                  >
                    {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                  </DrawerTrigger>
                  <DrawerContent className="bg-surface-1 w-[min(85vw,20rem)]">
                    <DrawerHeader className="border-b border-(--glass-border) px-6 py-5 text-left">
                      <DrawerTitle className="sr-only">
                        Dashboard navigation
                      </DrawerTitle>
                      <DashboardBrand compact />
                    </DrawerHeader>
                    <div className="overflow-y-auto p-4">
                      <DashboardNavigationSidebar
                        activeSection={activeSection}
                        onNavigate={() => setMobileOpen(false)}
                      />
                      <AdminIdentity
                        userName={user?.name}
                        onLogout={() => void handleLogout()}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
                <DashboardBrand compact />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/"
                  aria-label="Store"
                  className={buttonVariants({
                    variant: "outline",
                    size: "default",
                    className:
                      "hover:border-primary group-hover:bg-primary group bg-primary text-primary-foreground! hover:text-primary-soft! relative group-hover:ml-10 hover:pl-7! lg:w-auto lg:px-2.5",
                  })}
                >
                  <ArrowUpRight className="group-hover:text-primary-soft absolute left-2.5 opacity-0 transition group-hover:opacity-100" />
                  <Store size={14} />
                  <span className="hidden lg:inline">Store</span>
                </Link>
              </div>
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
      <img src="/Shared/logo.png" alt="logo" className="h-8 w-8" />
      <span
        className={`title-font block font-semibold tracking-wide whitespace-nowrap ${compact ? "text-primary-soft text-sm" : "text-foreground text-xl"}`}
      >
        Komorebi Gift Atelier
      </span>
    </Link>
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
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="Open account menu"
              className="bg-surface-2 hover:bg-surface-3 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition"
            />
          }
        >
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
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <p className="truncate">{userName ?? "Administrator"}</p>
              <p className="text-text-muted mt-1 text-xs font-normal">
                Administrator
              </p>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onLogout}>
            <LogOut size={14} />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
