"use client";

import { useEffect } from "react";

/** Root `<html lang>` ilə aktiv next-intl locale sinxron saxlayır (justhome ilə eyni). */
export default function HtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
