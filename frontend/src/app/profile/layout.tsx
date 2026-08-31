"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGlobalStore } from "@/src/store/global.store";
import { ProfileSidebar } from "../../components/profile/ProfileSidebar";
import { AuthStatus } from "@/src/types/user";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const authStatus = useGlobalStore((state) => state.authStatus);

  useEffect(() => {
    if (authStatus === AuthStatus.Unauthenticated) {
      router.replace("/login");
    }
  }, [authStatus, router]);

  if (authStatus !== AuthStatus.Authenticated) return null;

  return (
    <main className="bg-background text-foreground min-h-dvh pt-20">
      <div className="mx-auto grid w-full max-w-360 gap-8 px-4 py-8 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-start lg:px-10 xl:gap-10 xl:px-16">
        <ProfileSidebar />
        <section className="min-w-0 space-y-10 md:col-start-2">
          {children}
        </section>
      </div>
    </main>
  );
}
