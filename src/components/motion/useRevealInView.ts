"use client";

import { useInView } from "framer-motion";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";

type RevealOptions = {
  amount?: number;
  once?: boolean;
  margin?: string;
};

/**
 * Bəzi hallarda (ilk açılış, layout) `whileInView` birinci frame-də
 * hələ "kəsişmə" almayır və element `opacity: 0` qalır. Bu hook artıq
 * viewportdakı məzmunu `getBoundingClientRect` ilə aşkarlayır.
 */
export function useRevealInView<T extends HTMLElement = HTMLDivElement>(
  opts: RevealOptions = {},
): { ref: RefObject<T | null>; visible: boolean } {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, {
    once: opts.once ?? true,
    amount: typeof opts.amount === "number" ? opts.amount : 0.01,
    ...(opts.margin != null
      ? { margin: opts.margin as `${number}px` }
      : {}),
  });
  const [preVisible, setPreVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const h = globalThis.innerHeight;
    const w = globalThis.innerWidth;
    if (r.bottom > 0 && r.top < h && r.right > 0 && r.left < w) {
      setPreVisible(true);
    }
  }, []);

  return { ref, visible: inView || preVisible };
}
