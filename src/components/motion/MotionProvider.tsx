"use client";

import { domAnimation, LazyMotion } from "framer-motion";

type MotionProviderProps = {
  children: React.ReactNode;
};

/** `LazyMotion` + `m` importları — bundle üçün `motion` ağır yolundan istifadə etmirik. */
export default function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
