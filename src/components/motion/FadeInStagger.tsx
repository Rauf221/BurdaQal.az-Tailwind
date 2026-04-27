"use client";

import { m, useReducedMotion } from "framer-motion";
import { FADE_DURATION, FADE_EASE } from "./transition";
import { useRevealInView } from "./useRevealInView";

const listContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: FADE_DURATION, ease: FADE_EASE },
  },
};

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function FadeInStagger({ children, className }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  const { ref, visible } = useRevealInView<HTMLDivElement>({
    once: true,
    amount: 0.08,
    margin: "0px",
  });
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <m.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
      variants={listContainer}
    >
      {children}
    </m.div>
  );
}

export function FadeInStaggerItem({ children, className }: StaggerProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <m.div className={className} variants={listItem}>
      {children}
    </m.div>
  );
}
