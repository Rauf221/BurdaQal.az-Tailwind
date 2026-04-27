"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getAuthToken } from "@/lib/api/client";
import HeaderUserNav from "@/components/elements/HeaderUserNav";
import LocaleSwitcher from "@/components/elements/LocaleSwitcher";
import { useSiteBranding } from "@/providers/SiteBrandingProvider";
import Menu from "@/components/layout/Menu";

export type HeaderHomeProps = {
  scroll: boolean;
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  isLogin: boolean;
  handleLogin: () => void;
  isRegister: boolean;
  handleRegister: () => void;
};

export default function HeaderHome({
  scroll,
  handleMobileMenu,
  handleLogin,
}: HeaderHomeProps) {
  const t = useTranslations("navigation");
  const th = useTranslations("header");
  const branding = useSiteBranding();
  const forDesktop = branding.logoOnDarkBg || branding.logoOnLightBg;
  const forMobile = branding.logoOnLightBg || branding.logoOnDarkBg;

  const headerCls = [
    "header header-fixed style-no-bg style-absolute",
    scroll ? "is-fixed is-small" : "",
    scroll
      ? "fixed left-0 top-0 z-[9999] w-full max-[991px]:border-b max-[991px]:border-[var(--Border)] min-[992px]:bg-transparent"
      : "absolute left-0 top-0 z-[100] w-full max-[991px]:border-b max-[991px]:border-[var(--Border)] max-[991px]:bg-[var(--White)] min-[992px]:bg-transparent",
  ]
    .filter(Boolean)
    .join(" ");

  const innerCls = [
    "header-inner",
    scroll ? "" : "min-[992px]:pt-5",
    "min-[992px]:px-5 min-[992px]:pb-0",
    scroll ? "" : "max-[991px]:px-[15px] max-[991px]:py-2.5",
  ]
    .filter(Boolean)
    .join(" ");

  const innerWrapCls = [
    "header-inner-wrap",
    "w-full min-w-0 rounded-[24px] border-0 py-5",
    "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
    "max-[991px]:rounded-2xl max-[991px]:px-3.5 max-[991px]:py-2",
    "min-[992px]:grid min-[992px]:grid-cols-[1fr_auto_1fr] min-[992px]:items-center min-[992px]:gap-4 min-[992px]:px-10",
    !scroll ? "bg-transparent" : "",
    scroll
      ? "min-[992px]:bg-[var(--Secondary)] max-[991px]:bg-transparent"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header id="header_main" className={headerCls}>
      <div className={innerCls}>
        <div className={innerWrapCls}>
          <div
            id="site-logo"
            className="min-w-0 justify-self-start leading-none min-[992px]:justify-self-start"
          >
            <Link
              href="/"
              rel="home"
              className="site-logo__link flex max-w-full items-center leading-none"
            >
              {forDesktop ? (
                <img
                  id="logo-header"
                  className="site-logo__img site-logo__img--desktop hidden h-[60px] w-auto max-w-[200px] object-contain min-[992px]:block"
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

          <nav className="main-menu style-white relative z-[1] hidden min-w-0 min-[992px]:block min-[992px]:justify-self-center">
            <Menu variant="inverse" />
          </nav>

          <div className="header-right relative z-30 hidden shrink-0 items-center gap-5 min-[992px]:flex min-[992px]:justify-self-end max-[1200px]:gap-[15px]">
            <LocaleSwitcher variant="inverse" />
            <HeaderUserNav
              handleLogin={handleLogin}
              inverse
              accountMenuTheme="dark"
            />
            <div className="header-btn">
              <Link
                href="/dashboard-add-properties"
                className="tf-button-default style-white inline-flex items-center justify-center gap-2.5 rounded-[120px] border border-white bg-transparent px-6 py-2.5 text-base font-medium leading-[19px] text-white transition-colors hover:bg-white hover:text-[var(--Secondary)]"
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
            className="mobile-nav-toggler mobile-button relative hidden h-11 w-11 shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 max-[991px]:inline-flex"
            aria-label={th("menuAria")}
            aria-expanded={false}
            onClick={handleMobileMenu}
          >
            <span className="pointer-events-none absolute left-1/2 top-1/2 block h-0.5 w-[23px] -translate-x-1/2 translate-y-[-6px] bg-[var(--Secondary)]" />
            <span className="pointer-events-none absolute left-1/2 top-1/2 block h-0.5 w-[23px] -translate-x-1/2 translate-y-0.5 bg-[var(--Secondary)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
