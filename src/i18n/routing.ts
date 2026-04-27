import { defineRouting } from "next-intl/routing";

/** justhome `i18n/routing.js` ilə eyni məntiq */
export const routing = defineRouting({
  locales: ["az", "en", "ru"],
  defaultLocale: "az",
  localeDetection: false,
  localePrefix: "as-needed",
});
