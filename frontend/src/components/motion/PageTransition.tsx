"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { AuthPage, AuthMode } from "../auth/AuthPage";
import { NavbarSection } from "../sections/NavbarSection";
import { FooterSection } from "../sections/FooterSection";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // ignore login and register pages for the page transition animation
  if (pathname === "/login" || pathname === "/register") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <NavbarSection />
        <AuthPage
          mode={pathname === "/login" ? AuthMode.LOGIN : AuthMode.REGISTER}
        />
        <FooterSection />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14, scale: 0.98, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, scale: 0.985, filter: "blur(3px)" }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
          mass: 0.7,
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
