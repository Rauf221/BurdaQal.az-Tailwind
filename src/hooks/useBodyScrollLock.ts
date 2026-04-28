"use client";

import { useEffect } from "react";

let lockCount = 0;

function getScrollbarWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

function applyLock() {
  const body = document.body;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  body.dataset.scrollLockY = String(scrollY);

  const sbw = getScrollbarWidth();
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  if (sbw > 0) body.style.paddingRight = `${sbw}px`;

  body.classList.add("modal-open");
}

function releaseLock() {
  const body = document.body;
  const raw = body.dataset.scrollLockY;
  const scrollY = raw ? Number(raw) : 0;

  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.paddingRight = "";

  body.classList.remove("modal-open");
  delete body.dataset.scrollLockY;

  window.scrollTo(0, Number.isFinite(scrollY) ? scrollY : 0);
}

type UseBodyScrollLockArgs = Readonly<{
  locked: boolean;
}>;

export function useBodyScrollLock({ locked }: UseBodyScrollLockArgs) {
  useEffect(() => {
    if (!locked) return;
    if (typeof document === "undefined") return;

    lockCount += 1;
    if (lockCount === 1) applyLock();

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) releaseLock();
    };
  }, [locked]);
}

