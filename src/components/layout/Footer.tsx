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

type FooterProps = { footerCls?: string };

/** Sayt ALT – abunə, kategoriyalar API, sosial/network, əlaqə; `footer`/`navigation` tərcümələri. */
export default function FooterMain({ footerCls }: FooterProps) {
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

  const footerNavLink =
    "text-[15px] leading-[35px] text-[var(--White)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--White)]";

  return (
    <footer
      role="contentinfo"
      aria-label={t("ariaLabel")}
      className={`footer px-5 pb-5 pt-0 ${footerCls ?? ""}`.trim()}
    >
      <div className="footer-inner rounded-[24px] bg-[var(--Secondary)] px-5 pb-10 pt-10 md:pb-14 md:pt-12 lg:rounded-3xl">
        <div className="footer-inner-wrap mx-auto w-full max-w-[1680px]">
          <div className="top-footer flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between md:gap-10 md:pb-10">
            <div className="logo-footer h-14 w-[180px] shrink-0 sm:h-16 sm:w-[200px]">
              <Link href="/" className="block h-full w-full">
                {logoFooter ? (
                  <img
                    id="logo-footer"
                    src={logoFooter}
                    alt=""
                    className="h-full w-full object-contain object-left"
                  />
                ) : null}
              </Link>
            </div>
            <div className="wg-social flex flex-col gap-3 sm:items-end">
              <span className="text-[15px] font-medium text-[var(--White)]">
                {t("followUs")}
              </span>
              <ul className="list-social flex flex-wrap gap-4 sm:justify-end">
                {socials.length ? (
                  socials.map((s, i) => (
                    <li key={`${s.link}-${i}`}>
                      <a
                        href={normalizeExternalLink(s.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex opacity-90 transition-opacity hover:opacity-100"
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

          <div className="center-footer mt-0 grid gap-14 pt-12 pb-10 lg:grid-cols-12 lg:gap-8 lg:pt-14 lg:pb-12 xl:gap-10">
            <div className="footer-cl-1 lg:col-span-4">
              <div className="mb-4 text-[17px] font-semibold leading-snug text-[#8b8b8b]">
                {t("subscribe")}
              </div>
              <form className="mb-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex items-end gap-2 border-b border-white/25 pb-2.5 pt-1 sm:gap-3">
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">{t("emailSrOnly")}</span>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder={t("emailPlaceholder")}
                      className="w-full border-0 bg-transparent pb-2.5 pt-1 text-[15px] font-normal text-[var(--White)] outline-none placeholder:text-[var(--White)] focus:border-white/45"
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
              <div className="max-w-[26rem] text-[15px] leading-7 text-[var(--White)] opacity-95">
                {t("subscribeHint")}
              </div>
            </div>

            <div className="footer-cl-2 lg:col-span-2">
              <div className="ft-title mb-6 text-[19px] font-medium leading-7 text-white/50 lg:mb-[30px]">
                {t("discover")}
              </div>
              <ul className="navigation-menu-footer flex flex-col gap-0">
                {categories.length ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/elanlar?category=${encodeURIComponent(cat.slug)}`}
                        className={footerNavLink}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link href="/elanlar" className={footerNavLink}>
                      {t("listingsLink")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="footer-cl-3 lg:col-span-2">
              <div className="ft-title mb-6 text-[19px] font-medium leading-7 text-white/50 lg:mb-[30px]">
                {t("quickLinks")}
              </div>
              <ul className="navigation-menu-footer flex flex-col">
                <li>
                  <Link href="/" className={footerNavLink}>
                    {tn("home")}
                  </Link>
                </li>
                <li>
                  <Link href="/elanlar" className={footerNavLink}>
                    {tn("property")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={footerNavLink}>
                    {tn("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className={footerNavLink}>
                    {tn("contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/about#faq" className={footerNavLink}>
                    {tn("faqPage")}
                  </Link>
                </li>
                <li>
                  <Link href="/bloglar" className={footerNavLink}>
                    {tn("blog")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:gap-12">
              <div className="footer-cl-5 min-w-0">
                <div className="ft-title mb-6 text-[19px] font-medium leading-7 text-white/50 lg:mb-[34px]">
                  {t("contactUs")}
                </div>
                <ul className="navigation-menu-footer flex flex-col">
                  <li>
                    <div className="flex flex-col gap-1 text-[15px] leading-7 text-[var(--White)]">
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
              <div className="footer-cl-5 min-w-0">
                <div className="ft-title mb-6 text-[19px] font-medium leading-7 text-white/50 lg:mb-[34px]">
                  {t("ourAddress")}
                </div>
                <ul className="navigation-menu-footer">
                  <li>
                    <div className="whitespace-pre-line text-[15px] leading-7 text-[var(--White)]">
                      {address || "—"}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bottom-footer border-t border-white/10 pt-8 text-center md:pt-10">
            <div className="text-[15px] text-[var(--White)]">
              {t("copyright")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
