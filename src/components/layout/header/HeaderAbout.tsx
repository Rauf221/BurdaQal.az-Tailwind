"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAuthToken } from "@/lib/api/client";
import HeaderUserNav from "@/components/elements/HeaderUserNav";
import LocaleSwitcher from "@/components/elements/LocaleSwitcher";
import { useSiteBranding } from "@/providers/SiteBrandingProvider";
import Menu from "@/components/layout/Menu";

export type HeaderAboutProps = {
  scroll: boolean;
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  isLogin: boolean;
  handleLogin: () => void;
  isRegister: boolean;
  handleRegister: () => void;
};

/** justhome `Header12.js` ilə eyni struktur — Tailwind (`header-fixed`, standart menyu rəngləri). */
export default function HeaderAbout({
  scroll,
  handleMobileMenu,
  handleLogin,
}: HeaderAboutProps) {
  const t = useTranslations("navigation");
  const th = useTranslations("header");
  const branding = useSiteBranding();
  const forDesktop = branding.logoOnLightBg || branding.logoOnDarkBg;
  const forMobile = branding.logoOnLightBg || branding.logoOnDarkBg;

  const outer = [
    "header header-fixed",
    "relative z-[100] w-full ",
    scroll ? "is-fixed is-small" : "",
    "max-[991px]:border-b max-[991px]:border-[#EBEBEB] ",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = [
    "header-inner ",
    scroll ? "pt-0" : "pt-5",
    "px-5 pb-0 ",
    scroll
      ? "max-[991px]:!px-[15px] max-[991px]:!py-2  "
      : "max-[991px]:px-[15px] max-[991px]:py-2",
  ].join(" ");

  const innerWrap = [
    "header-inner-wrap",
    "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
    "rounded-[24px] border border-[#EBEBEB] bg-white px-10 py-5",
    "min-[992px]:grid-cols-[1fr_auto_1fr] min-[992px]:items-center min-[992px]:gap-4",
    scroll
      ? "min-[992px]:shadow-[0_8px_30px_rgba(0,0,0,0.08)] min-[992px]:py-5"
      : "",
    scroll
      ? "max-[991px]:rounded-2xl max-[991px]:border-0 max-[991px]:bg-white max-[991px]:px-3.5 max-[991px]:py-2"
      : "",
    "max-[991px]:gap-3",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header id="header_main" className={outer}>
      <div className={inner}>
        <div className={innerWrap}>
          <div id="site-logo" className="min-w-0 justify-self-start leading-none">
            <Link
              href="/"
              rel="home"
              className="site-logo__link flex max-w-full items-center leading-none"
            >
              {forDesktop ? (
                <img
                  id="logo-header"
                  className={
                    "site-logo__img site-logo__img--desktop hidden w-auto max-w-[200px] object-contain min-[992px]:block " +
                    (scroll
                      ? "h-[52px] min-[992px]:h-[56px]"
                      : "h-[60px]")
                  }
                  src={forDesktop}
                  alt=""
                />
              ) : null}
              {forMobile ? (
                <img
                  id="logo-header-mobile"
                  className="site-logo__img site-logo__img--mobile hidden h-10 w-auto max-w-[200px] object-contain max-[991px]:block max-[991px]:h-[45px] max-[991px]:max-h-[50px] min-[992px]:hidden"
                  src={forMobile}
                  alt=""
                />
              ) : null}
            </Link>
          </div>

          <nav className="main-menu relative z-[1] hidden min-w-0 min-[992px]:block min-[992px]:justify-self-center">
            <Menu variant="default" />
          </nav>

          <div className="header-right relative z-30 hidden shrink-0 items-center justify-self-end gap-5 min-[992px]:flex max-[1200px]:gap-[15px]">
            <LocaleSwitcher variant="default" />
            <HeaderUserNav handleLogin={handleLogin} accountMenuTheme="green" />
            <div className="header-btn">
              <Link
                href="/dashboard-add-properties"
                className="tf-button-default inline-flex items-center justify-center gap-2.5 rounded-full border border-[#1A1A1A] bg-transparent px-6 py-2.5 text-base font-medium leading-[19px] text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A] hover:text-white"
                onClick={(e) => {
                  if (!getAuthToken()) {
                    e.preventDefault();
                    handleLogin();
                  }
                }}
              >
                {t("addListing")}
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="mobile-nav-toggler mobile-button relative hidden h-11 w-11 shrink-0 cursor-pointer appearance-none items-center justify-center justify-self-end border-0 bg-transparent p-0 max-[991px]:inline-flex"
            aria-label={th("menuAria")}
            aria-expanded={false}
            onClick={handleMobileMenu}
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 block h-0.5 w-[23px] -translate-x-1/2 -translate-y-[6px] bg-[#1A1A1A]" />
            <span className="pointer-events-none absolute left-1/2 top-1/2 block h-0.5 w-[23px] -translate-x-1/2 translate-y-0.5 bg-[#1A1A1A]" />
          </button>
        </div>
      </div>
    </header>
  );
}
