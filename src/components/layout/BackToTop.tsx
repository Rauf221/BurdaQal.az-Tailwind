"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop({ target = "#top" }: { target?: string }) {
  const t = useTranslations("backToTop");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = () => {
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={go}
      className="fixed bottom-8 right-8 z-[9990] flex h-12 w-12 items-center justify-center rounded-full bg-[var(--Primary)] text-[var(--White)] shadow-lg transition-[filter] hover:brightness-95"
      aria-label={t("aria")}
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  );
}
