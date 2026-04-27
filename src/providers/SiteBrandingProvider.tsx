"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import {
  DEFAULT_SITE_BRANDING,
  type SiteBrandingValue,
} from "@/lib/site-branding";
import { settingsQueryOptions } from "@/services/client/settings/queries";
import type { SiteSettingsData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

export type { SiteBrandingValue };

const EMPTY: SiteBrandingValue = {
  logoOnDarkBg: "",
  logoOnLightBg: "",
  logoFooter: "",
};

const SiteBrandingContext = createContext<SiteBrandingValue>(EMPTY);

export function useSiteBranding(): SiteBrandingValue {
  return useContext(SiteBrandingContext);
}

function apiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

function hasLogoFields(s: SiteSettingsData | null | undefined): s is SiteSettingsData {
  if (!s) return false;
  return Boolean(s.logo?.trim() || s.dark_logo?.trim());
}

/**
 * SSR-dən `initialSiteSettings` — ilk paint API loqoları ilə; client `GET /settings` ilə yenilənir (justhome kimi).
 */
export function SiteBrandingProvider({
  children,
  initialSiteSettings = null,
}: {
  children: ReactNode;
  initialSiteSettings?: SiteSettingsData | null;
}) {
  const base = apiBaseUrl();

  const initialData = useMemo(
    () =>
      hasLogoFields(initialSiteSettings)
        ? { data: initialSiteSettings }
        : undefined,
    [initialSiteSettings],
  );

  const { data: loose } = useQuery({
    ...settingsQueryOptions,
    initialData,
  });

  const value = useMemo(() => {
    const fromServer = hasLogoFields(initialSiteSettings)
      ? {
          logo: initialSiteSettings.logo,
          dark_logo: initialSiteSettings.dark_logo,
          favicon: initialSiteSettings.favicon,
        }
      : null;
    const raw = loose ?? fromServer;
    if (!raw || (!raw.logo?.trim() && !raw.dark_logo?.trim())) {
      return DEFAULT_SITE_BRANDING;
    }
    const logo = resolveMediaUrl(base, raw.logo);
    const dark = resolveMediaUrl(base, raw.dark_logo);
    return {
      logoOnDarkBg:
        logo || dark || DEFAULT_SITE_BRANDING.logoOnDarkBg,
      logoOnLightBg:
        dark || logo || DEFAULT_SITE_BRANDING.logoOnLightBg,
      logoFooter:
        dark || logo || DEFAULT_SITE_BRANDING.logoFooter,
    };
  }, [loose, base, initialSiteSettings]);

  return (
    <SiteBrandingContext.Provider value={value}>
      {children}
    </SiteBrandingContext.Provider>
  );
}
