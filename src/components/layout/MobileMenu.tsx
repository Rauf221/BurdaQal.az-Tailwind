"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import HeaderUserNav from "@/components/elements/HeaderUserNav";
import LocaleSwitcher from "@/components/elements/LocaleSwitcher";
import Menu from "@/components/layout/Menu";
import { Link } from "@/i18n/navigation";
import { useSiteBranding } from "@/providers/SiteBrandingProvider";

/** justhome `MobileMenu.js` + `style.css` / `_mobilemenu.scss` strukturu (sol panel, loqo, backdrop, bağla). */
export default function MobileMenu({
  isMobileMenu,
  handleMobileMenu,
  handleLogin,
}: {
  isMobileMenu: boolean;
  handleMobileMenu: () => void;
  handleLogin: () => void;
}) {
  const t = useTranslations("mobileMenu");
  const branding = useSiteBranding();
  const menuLogo = branding.logoOnLightBg || branding.logoOnDarkBg;

  if (!isMobileMenu) return null;

  return (
    <div className="mobile-menu lg:hidden" aria-modal="true" role="dialog">
      <button
        type="button"
        className="menu-backdrop"
        aria-label={t("closeBackdrop")}
        onClick={handleMobileMenu}
      />
      <nav className="menu-box" aria-label={t("navLabel")}>
        <div className="nav-logo">
          <div className="nav-logo__row">
            <Link
              href="/"
              className="site-logo__link min-w-0 flex-1"
              onClick={handleMobileMenu}
            >
              {menuLogo ? (
                <img
                  className="site-logo__img max-w-[200px]"
                  src={menuLogo}
                  alt=""
                  width={174}
                  height={44}
                />
              ) : (
                <span className="text-base font-semibold text-[var(--Secondary)]">
                  {t("siteName")}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="mobile-menu__close"
              onClick={handleMobileMenu}
              aria-label={t("close")}
            >
              <X className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
        <div className="bottom-canvas">
          <div className="menu-outer">
            <div className="mobile-menu-body" id="navbarSupportedContent">
              <Menu variant="mobile" />
              <LocaleSwitcher variant="mobile" />
              <HeaderUserNav
                handleLogin={handleLogin}
                placement="mobile"
                onAfterNavigate={handleMobileMenu}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
