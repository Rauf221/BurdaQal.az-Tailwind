"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useSiteBranding } from "@/providers/SiteBrandingProvider";
import { getContactQuery } from "@/services/client/contact/queries";
import { getSocialMediaListQuery } from "@/services/client/settings/queries";
import { categoriesListQuery } from "@/services/dashboard/Add-New-Properties/queries";

function normalizeExternalLink(raw: string | null | undefined): string {
  if (!raw?.trim()) return "/#";
  const val = raw.trim();
  if (/^https?:\/\//i.test(val)) return val;
  return `https://${val}`;
}

export default function FooterMain({ footerCls }: { footerCls?: string }) {
  const locale = useLocale();
  const t = useTranslations("footer");
  const tn = useTranslations("navigation");
  const branding = useSiteBranding();
  const logoFooter = branding.logoOnDarkBg || branding.logoOnLightBg;
  const { data: categoriesRes } = useQuery(categoriesListQuery(locale));
  const categories = (categoriesRes?.data ?? []).slice(0, 6);
  const { data: socialRes } = useQuery(getSocialMediaListQuery());
  const socials = socialRes?.data ?? [];
  const { data: contactRes } = useQuery(getContactQuery(locale));
  const c = contactRes?.data;
  const email = c?.email?.trim() ?? "";
  const phone = c?.phone?.trim() ?? "";
  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : "";
  const address = c?.address?.trim() ?? "";

  return (
    <footer className={`footer px-5 pb-5 pt-0 ${footerCls ?? ""}`.trim()}>
      <div className="footer-inner rounded-[24px] bg-[var(--Secondary)] px-5 pb-10 pt-[50px]">
        <div className="footer-inner-wrap mx-auto w-full max-w-[1680px]">
          <div className="top-footer flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="logo-footer h-16 w-[200px] shrink-0">
              <Link href="/" className="block h-full w-full">
                {logoFooter ? (
                  <img
                    id="logo-footer"
                    src={logoFooter}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </Link>
            </div>
            <div className="wg-social mt-0.5 flex gap-4 align-center">
              <span className="mb-3 block text-[15px] font-medium text-[var(--White)]">
                {t("followUs")}
              </span>
              <ul className="list-social flex flex-wrap gap-4">
                {socials.length ? (
                  socials.map((s, i) => (
                    <li key={`${s.link}-${i}`}>
                      <a
                        href={normalizeExternalLink(s.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-90 transition-opacity hover:opacity-100"
                      >
                        <img
                          src={s.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-white/70">—</li>
                )}
              </ul>
            </div>
          </div>

          <div className="center-footer flex flex-col gap-10 pt-[95px] pb-[87px] lg:flex-row lg:justify-between lg:gap-[15px]">
            <div className="footer-cl-1 w-full max-w-[420px]">
              <div className="mb-5 text-[17px] font-semibold leading-snug text-[#8b8b8b]">
                {t("subscribe")}
              </div>
              <form
                className="mb-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="flex items-end gap-2 sm:gap-3 border-b border-white/25 pb-2.5 pt-1">
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">{t("emailSrOnly")}</span>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder={t("emailPlaceholder")}
                      className="w-full border-0  bg-transparent pb-2.5 pt-1 text-[15px] font-normal text-[var(--White)] outline-none placeholder:text-[var(--White)] focus:border-white/45"
                    />
                  </label>
                  <button
                    type="submit"
                    className="flex shrink-0 items-center gap-2 rounded-[999px] bg-white/12 px-4 py-2.5 text-[14px] font-medium text-[var(--White)] transition-colors hover:bg-white/18 sm:px-5"
                  >
                    {t("send")}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </div>
              </form>
              <div className="text text-[15px] leading-7 text-[var(--White)]">
                {t("subscribeHint")}
              </div>
            </div>

            <div className="footer-cl-2">
              <div className="ft-title mb-[30px] text-[19px] font-medium leading-7 text-white/50">
                {t("discover")}
              </div>
              <ul className="navigation-menu-footer flex flex-col">
                {categories.length ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/elanlar?category=${encodeURIComponent(cat.slug)}`}
                        className="text-[15px] leading-[35px] text-[var(--White)] hover:underline"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link
                      href="/elanlar"
                      className="text-[15px] leading-[35px] text-[var(--White)]"
                    >
                      {t("listingsLink")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="footer-cl-3">
              <div className="ft-title mb-[30px] text-[19px] font-medium leading-7 text-white/50">
                {t("quickLinks")}
              </div>
              <ul className="navigation-menu-footer flex flex-col">
                <li>
                  <Link
                    href="/"
                    className="text-[15px] leading-[35px] text-[var(--White)]"
                  >
                    {tn("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/elanlar"
                    className="text-[15px] leading-[35px] text-[var(--White)]"
                  >
                    {tn("property")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-[15px] leading-[35px] text-[var(--White)]"
                  >
                    {tn("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[15px] leading-[35px] text-[var(--White)]"
                  >
                    {tn("contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#faq"
                    className="text-[15px] leading-[35px] text-[var(--White)]"
                  >
                    {tn("faqPage")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bloglar"
                    className="text-[15px] leading-[35px] text-[var(--White)]"
                  >
                    {tn("blog")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-10 lg:gap-16">
              <div className="footer-cl-5 w-[171px]">
                <div className="ft-title mb-[34px] text-[19px] font-medium leading-7 text-white/50">
                  {t("contactUs")}
                </div>
                <ul className="navigation-menu-footer flex flex-col">
                  <li>
                    <div className="text flex flex-col gap-1 text-[15px] leading-7 text-[var(--White)]">
                      {email ? (
                        <a href={`mailto:${email}`} className="hover:underline">
                          {email}
                        </a>
                      ) : null}
                      {phone ? (
                        <a href={phoneHref} className="hover:underline">
                          {phone}
                        </a>
                      ) : null}
                    </div>
                  </li>
                </ul>
              </div>
              <div className="footer-cl-5 w-[171px]">
                <div className="ft-title mb-[34px] text-[19px] font-medium leading-7 text-white/50">
                  {t("ourAddress")}
                </div>
                <ul className="navigation-menu-footer">
                  <li>
                    <div className="text text-[15px] leading-7 text-[var(--White)]">
                      {address || "—"}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bottom-footer border-t border-white/10 pt-11 text-center">
            <div className="text text-[15px] text-[var(--White)]">
              {t("copyright")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
