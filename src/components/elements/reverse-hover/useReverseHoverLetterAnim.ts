"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * `ReverseHoverLetterLink` və header Giriş düyməsi üçün: hərflər aşağıdan yuxarı stagger.
 */
export function useReverseHoverLetterAnim(text: string) {
  const letters = useMemo(() => Array.from(text), [text]);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = innerRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLSpanElement>(".jh-reverse-btn__letter");
    els.forEach((l, i) => {
      window.setTimeout(() => {
        l.style.transform = "translateY(0)";
      }, 10 * i);
    });
  }, [text]);

  const animIn = useCallback(() => {
    const root = innerRef.current;
    if (!root) return;
    const letterEls = root.querySelectorAll<HTMLSpanElement>(".jh-reverse-btn__letter");
    letterEls.forEach((l) => {
      l.style.transition = "transform 0.01s, color 0.22s";
      l.style.transform = "translateY(110%)";
    });
    letterEls.forEach((l, i) => {
      window.setTimeout(() => {
        l.style.transition = `transform 0.38s cubic-bezier(0.76,0,0.24,1) ${i * 10}ms, color 0.22s`;
        l.style.transform = "translateY(0)";
      }, 20);
    });
  }, []);

  const animOut = useCallback(() => {
    const root = innerRef.current;
    if (!root) return;
    const letterEls = root.querySelectorAll<HTMLSpanElement>(".jh-reverse-btn__letter");
    const n = letterEls.length;
    letterEls.forEach((l, i) => {
      window.setTimeout(() => {
        l.style.transition = "transform 0.28s cubic-bezier(0.76,0,0.24,1), color 0.22s";
        l.style.transform = "translateY(110%)";
      }, i * 10);
    });
    window.setTimeout(() => {
      letterEls.forEach((l) => {
        l.style.transition = "none";
        l.style.transform = "translateY(110%)";
      });
      window.setTimeout(() => {
        letterEls.forEach((l, i) => {
          window.setTimeout(() => {
            l.style.transition = "transform 0.38s cubic-bezier(0.76,0,0.24,1), color 0.22s";
            l.style.transform = "translateY(0)";
          }, i * 40);
        });
      }, 20);
    }, n * 30 + 200);
  }, []);

  return { letters, innerRef, animIn, animOut };
}
