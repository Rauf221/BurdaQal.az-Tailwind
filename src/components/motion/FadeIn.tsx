"use client";

import { m, useReducedMotion } from "framer-motion";
import { FADE_DURATION, FADE_EASE } from "./transition";
import { useRevealInView } from "./useRevealInView";

export type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  /** saniyə */
  delay?: number;
  /** px — başlanğıc vertikal ofset */
  y?: number;
  /** yalnız bir dəfə animasiya */
  once?: boolean;
  as?: "div" | "section" | "article" | "header" | "main" | "footer" | "aside";
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  y = 14,
  once = true,
  as = "div",
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const { ref, visible } = useRevealInView<HTMLElement>({
    once,
    amount: 0.12,
    margin: "0px",
  });

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Motion =
    as === "section"
      ? m.section
      : as === "article"
        ? m.article
        : as === "header"
          ? m.header
          : as === "main"
            ? m.main
            : as === "footer"
              ? m.footer
              : as === "aside"
                ? m.aside
                : m.div;

  return (
    <Motion
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: FADE_DURATION, delay, ease: FADE_EASE }}
    >
      {children}
    </Motion>
  );
}
