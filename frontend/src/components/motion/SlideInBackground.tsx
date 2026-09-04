"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";

export type SlideDirection = "left" | "right" | "top" | "bottom";

type SlideInBackgroundProps = {
  image: string;
  alt: string;
  direction?: SlideDirection;
  delay?: number;
  objectPosition?: CSSProperties["objectPosition"];
};

const initialPosition: Record<SlideDirection, { x: string; y: string }> = {
  left: { x: "-100%", y: "0%" },
  right: { x: "100%", y: "0%" },
  top: { x: "0%", y: "-100%" },
  bottom: { x: "0%", y: "100%" },
};

export function SlideInBackground({
  image,
  alt,
  direction = "left",
  delay = 0,
  objectPosition = "center",
}: SlideInBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black"
        variants={{
          hidden: initialPosition[direction],
          visible: { x: "0%", y: "0%" },
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.div
        className="absolute inset-0"
        variants={{
          hidden: { ...initialPosition[direction], opacity: 0.2 },
          visible: { x: "0%", y: "0%", opacity: 1 },
        }}
        transition={{
          duration: 0.8,
          delay: 0.25 + delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </motion.div>
    </motion.div>
  );
}
