"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  az: "AZ",
  en: "EN",
  ru: "RU",
};

export type LocaleSwitcherProps = {
  variant?: "default" | "inverse" | "mobile";
};

/** justhome `LocaleSwitcher.js` məntiqi + əvvəlki Tailwind görünüşü */
export default function LocaleSwitcher({
  variant = "default",
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const changeLocale = (next: string) => {
    if (next && next !== locale) {
      router.replace(pathname, { locale: next });
    }
    setOpen(false);
  };

  /** Açılan siyahı — `HeaderUserNav` hesab menyusu ilə eyni kölgə, radius, düymə ölçüsü. */
  const menuPanelCls =
    "absolute right-0 top-[calc(100%+8px)] z-[10050] m-0 min-w-[200px] list-none rounded-xl border border-[#EBEBEB] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]";

  const optionBase =
    "flex min-h-[41px] w-full cursor-pointer items-center justify-center rounded-full border px-3.5 text-center text-[15px] font-medium transition-colors";

  const optionIdle =
    "border-transparent bg-transparent text-[#1A1A1A] hover:bg-black/5";

  const optionActive =
    "border-[#8bd457] bg-[#8bd457] text-white hover:brightness-[0.96]";

  if (variant === "mobile") {
    return (
      <div
        className="locale-switcher locale-switcher--mobile"
        ref={rootRef}
      >
        <div className="locale-switcher-mobile__label">{t("language")}</div>
        <div
          className="locale-switcher-mobile__pills"
          role="group"
          aria-label={t("language")}
        >
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              className={`locale-switcher-mobile__pill ${loc === locale ? "is-active" : ""}`}
              onClick={() => changeLocale(loc)}
            >
              {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const triggerInverse =
    variant === "inverse"
      ? "border-white/55 text-white hover:border-white hover:bg-white/[0.08] hover:text-white"
      : "border-[#1A1A1A] text-[#1A1A1A] hover:border-[#8bd457] hover:text-[#8bd457]";

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        className={
          "flex min-h-[41px] cursor-pointer items-center justify-center gap-2 rounded-full border bg-transparent px-3.5 text-sm font-medium leading-none transition-colors " +
          triggerInverse
        }
        aria-label={t("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tracking-wide">
          {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
        </span>
        <span className="flex leading-none opacity-85" aria-hidden>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open ? (
        <ul
          id={listId}
          className={menuPanelCls + " flex flex-col gap-2"}
          role="listbox"
          aria-label={t("language")}
        >
          {routing.locales.map((loc) => (
            <li key={loc} role="option" aria-selected={loc === locale}>
              <button
                type="button"
                className={
                  optionBase +
                  " " +
                  (loc === locale ? optionActive : optionIdle)
                }
                onClick={() => changeLocale(loc)}
              >
                {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
