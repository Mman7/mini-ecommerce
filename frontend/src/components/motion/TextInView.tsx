"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

type TextInViewProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function TextInView({
  children,
  className,
  delay = 0,
}: TextInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      data-text-in-view="true"
    >
      {children}
    </motion.div>
  );
}
