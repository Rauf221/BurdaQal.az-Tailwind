"use client";

import Lenis from "lenis";
import { useEffect, useMemo, useState } from "react";
import "lenis/dist/lenis.css";

const LENIS_OPTIONS: ConstructorParameters<typeof Lenis>[0] = {
  lerp: 0.12,
  smoothWheel: true,
  syncTouch: true,
  touchMultiplier: 1.2,
  wheelMultiplier: 0.9,
};

type LenisRootProps = {
  children: React.ReactNode;
};

/**
 * Bütün sayt üçün yumşaq scroll — `new Lenis` birbaşa (window + documentElement).
 * `prefers-reduced-motion: reduce` olanda instans açılmır.
 */
export default function LenisRoot({ children }: LenisRootProps) {
  const [allowLenis, setAllowLenis] = useState<boolean | null>(null);
  const options = useMemo(() => LENIS_OPTIONS, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowLenis(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (allowLenis !== true) return;

    const lenis = new Lenis({
      ...options,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, [allowLenis, options]);

  return <>{children}</>;
}
