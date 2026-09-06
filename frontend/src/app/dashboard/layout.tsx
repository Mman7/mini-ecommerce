"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/src/store/global.store";
import { AuthStatus, Role } from "@/src/types/user";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
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
  return children;
}
