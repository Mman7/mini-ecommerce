"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus, Role } from "@/src/types/user";
import { DashboardShell } from "../../components/dashboard";
import { DashboardPageTransition } from "@/src/components/motion/PageTransition";
import { DashboardSection } from "@/src/components/dashboard/DashboardNavigationSidebar";

function getActiveSection(pathname: string): DashboardSection {
  if (pathname.startsWith("/dashboard/products")) return "products";
  if (pathname.startsWith("/dashboard/categories")) return "categories";
  if (pathname.startsWith("/dashboard/orders")) return "orders";
  if (pathname.startsWith("/dashboard/customers")) return "customers";
  if (pathname.startsWith("/dashboard/analytics")) return "analytics";
  return "overview";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const authStatus = useGlobalStore((state) => state.authStatus);
  const role = useGlobalStore((state) => state.user?.role);

  useEffect(() => {
    if (authStatus === AuthStatus.Unauthenticated) router.replace("/login");
    if (authStatus === AuthStatus.Authenticated && role !== Role.ADMIN) {
      router.replace("/");
    }
  }, [authStatus, role, router]);

  if (authStatus !== AuthStatus.Authenticated || role !== Role.ADMIN)
    return null;
  return (
    <DashboardShell activeSection={getActiveSection(pathname)}>
      <DashboardPageTransition>{children}</DashboardPageTransition>
    </DashboardShell>
  );
}
