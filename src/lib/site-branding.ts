export type SiteBrandingValue = {
  logoOnDarkBg: string;
  logoOnLightBg: string;
  logoFooter: string;
};

/** API əlçatmaz və ya boş olanda header/footer üçün statik loqolar. */
export const DEFAULT_SITE_BRANDING: SiteBrandingValue = {
  logoOnDarkBg: "/images/logo/logo-white.svg",
  logoOnLightBg: "/images/logo/logo.svg",
  logoFooter: "/images/logo/logo-footer.svg",
};
