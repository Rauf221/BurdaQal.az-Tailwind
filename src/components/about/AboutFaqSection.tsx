"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { getFaqQuery } from "@/services/client/about";

function buildFallbackFaq(t: (key: string) => string) {
  return [
    { question: t("fallback1q"), answer: t("fallback1a") },
    { question: t("fallback2q"), answer: t("fallback2a") },
    { question: t("fallback3q"), answer: t("fallback3a") },
    { question: t("fallback4q"), answer: t("fallback4a") },
    { question: t("fallback5q"), answer: t("fallback5a") },
  ];
}

export default function AboutFaqSection() {
  const locale = useLocale();
  const tf = useTranslations("aboutFaq");
  const { data } = useQuery(getFaqQuery(locale));
  const fallback = buildFallbackFaq(tf);
  const items = data?.data && data.data.length > 0 ? data.data : fallback;

  const [openKey, setOpenKey] = useState<number | null>(1);

  const handleAccordion = (key: number) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <section
      id="faq"
      className="tf-section flat-question style-1 pt-24 pb-20 md:pt-[100px] md:pb-[150px]"
    >
      <div className="themesflat-container mx-auto max-w-[1428px] px-[14px]">
        <div className="heading-section mx-auto mb-[46px] max-w-[720px] text-center">
          <h2 className="-mt-2 mb-4 text-[28px] font-semibold leading-tight text-[var(--Secondary)] md:text-[36px] md:leading-[44px]">
            {tf("title")}
          </h2>
          <div className="text-[17px] font-normal leading-5 text-[var(--Text)]">
            {tf("subtitle")}
          </div>
        </div>
        <div className="flat-accordion mx-auto max-w-[804px]">
          {items.map((item, i) => {
            const key = i + 1;
            const isOpen = openKey === key;
            return (
              <div
                key={`${item.question}-${i}`}
                className={
                  "flat-toggle mb-[47px] px-0 transition-colors last:mb-0 " +
                  (isOpen ? "rounded-none bg-[#F9F9F9] px-6 py-10 md:px-10" : "py-0")
                }
              >
                <h4
                  className={
                    "toggle-title relative cursor-pointer pr-10 text-[17px] font-medium text-[var(--Secondary)] " +
                    (isOpen ? "active" : "")
                  }
                  onClick={() => handleAccordion(key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleAccordion(key);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="block">{item.question}</span>
                  <span
                    className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2"
                    aria-hidden
                  >
                    <span
                      className={
                        "absolute right-0 top-1/2 block h-0.5 w-4 -translate-y-1/2 bg-[var(--Secondary)] transition-opacity " +
                        (isOpen ? "opacity-0" : "opacity-100")
                      }
                    />
                    <span className="absolute right-[7px] top-1/2 block h-4 w-0.5 -translate-y-1/2 bg-[var(--Secondary)]" />
                  </span>
                </h4>
                {isOpen ? (
                  <div className="toggle-content mt-[26px]">
                    <p className="m-0 text-[15px] leading-6 text-[var(--Text)]">
                      {item.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
