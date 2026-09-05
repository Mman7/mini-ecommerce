"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { AuthPage, AuthMode } from "../auth/AuthPage";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // ignore login and register pages for the page transition animation
  if (pathname === "/login" || pathname === "/register") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <AuthPage
          mode={pathname === "/login" ? AuthMode.LOGIN : AuthMode.REGISTER}
        />
      </div>
    );
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14, scale: 0.98, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}

      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.7,
        duration: 0.35,
        ease: "easeOut",
      }}
      className="flex min-h-0 flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
