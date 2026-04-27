"use client";

import { useTranslations } from "next-intl";

/** Yalnız rəqəm; 3-cü və 4-cü simvoldan sonra avtomatik «:» (məs. 1221 → 12:21). Uncontrolled — edit hydrate `form.elements` ilə uyğun gəlir. */
function formatTimeDigits(raw: string) {
  const digits = String(raw).replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export type TimeDigitsInputProps = {
  id: string;
  name: string;
  placeholder?: string;
  tabIndex?: number;
};

export default function TimeDigitsInput({
  id,
  name,
  placeholder,
  tabIndex,
}: TimeDigitsInputProps) {
  const t = useTranslations("timeDigits");
  const ph = placeholder ?? t("placeholder");
  return (
    <input
      id={id}
      name={name}
      type="text"
      defaultValue=""
      onChange={(e) => {
        const formatted = formatTimeDigits(e.target.value);
        if (formatted !== e.target.value) e.target.value = formatted;
      }}
      placeholder={ph}
      maxLength={5}
      inputMode="numeric"
      autoComplete="off"
      tabIndex={tabIndex}
      title={t("inputTitle")}
      className="box-border w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-[19px] py-3 text-base text-[var(--Secondary)] outline-none focus:border-[var(--Fourth)]"
    />
  );
}
