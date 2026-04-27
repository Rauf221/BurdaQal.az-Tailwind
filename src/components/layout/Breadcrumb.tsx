"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { resolveMediaUrl } from "@/lib/media-url";
import { getBreadcrumbQuery } from "@/services/client/about";

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

/** justhome `Breadcrumb.js` — `/breadcrumb` + hero fon, mətn mərkəzdə. */
export default function Breadcrumb() {
  const locale = useLocale();
  const t = useTranslations("breadcrumb");
  const { data } = useQuery(getBreadcrumbQuery(locale));
  const payload = data?.data;

  const title = payload?.title?.trim() || t("fallbackTitle");
  const description = payload?.description?.trim() || t("fallbackDescription");
  const rawBg = payload?.image?.trim() || payload?.thumb_image?.trim();
  const bgImage = rawBg ? resolveMediaUrl(apiBase(), rawBg) : null;

  return (
    <>
      <div className="h-5" aria-hidden />
      <section
        className={
          "relative z-20 overflow-hidden rounded-[24px] bg-cover bg-center bg-no-repeat px-[14px] py-16 text-center md:min-h-[570px] md:py-24 lg:pt-[241px] lg:pb-[248px] " +
          (bgImage ? "md:bg-fixed" : "bg-gradient-to-b from-[var(--Secondary)] to-[#0d0d0d]")
        }
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-black/40" aria-hidden />
        <div className="themesflat-container relative z-[2] mx-auto max-w-[1428px]">
          <div className="mx-auto max-w-[900px]">
            <h2 className="mb-3.5 text-[32px] font-semibold leading-tight text-[var(--White)] md:text-[40px] md:leading-[47px]">
              {title}
            </h2>
            <div className="text-[17px] font-normal leading-5 text-[var(--White)]">
              {description}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
