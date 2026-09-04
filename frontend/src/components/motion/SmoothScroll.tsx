"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.5,
      smoothWheel: true,
      // More movement from each wheel input
      wheelMultiplier: 0.8,
      // Keep touch relatively natural
      touchMultiplier: 1.1,
      // Long, slippery deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
