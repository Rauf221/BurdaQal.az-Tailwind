import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/** justhome `proxy.js` intl hissəsi ilə eyni seçimlər */
export default createMiddleware({
  ...routing,
  alternateLinks: false,
  localeDetection: false,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
