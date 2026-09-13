"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) return;

    const lenis = new Lenis({
      duration: 2,

      smoothWheel: true,

      wheelMultiplier: 0.35,

      easing: (t) => 1 - Math.pow(1 - t, 3),

      autoRaf: true,
    });

    let target = window.scrollY;
    let velocity = 0;

    const WHEEL_POWER = 0.06;
    const FRICTION = 0.96;
    const MAX_VELOCITY = 100;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();

      velocity += event.deltaY * WHEEL_POWER;

      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
    };

    const update = () => {
      // momentum
      target += velocity;

      // friction
      velocity *= FRICTION;

      // scroll boundary
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      target = Math.max(0, Math.min(target, maxScroll));

      // Lenis 负责 smooth
      lenis.scrollTo(target, {
        immediate: false,
        duration: 0.8,
      });

      requestAnimationFrame(update);
    };

    window.addEventListener("wheel", onWheel, {
      passive: false,
    });

    const raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
