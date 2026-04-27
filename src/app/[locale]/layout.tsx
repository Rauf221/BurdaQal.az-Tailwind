import HtmlLang from "@/components/elements/HtmlLang";
import { routing } from "@/i18n/routing";
import { fetchSiteSettings } from "@/lib/site-api-server";
import MotionProvider from "@/components/motion/MotionProvider";
import QueryProvider from "@/providers/QueryProvider";
import { SiteBrandingProvider } from "@/providers/SiteBrandingProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {};
  }
  const messages = (await import(`@/messages/${locale}.json`)).default as {
    metadata?: { title?: string; description?: string };
  };
  return {
    title: messages.metadata?.title,
    description: messages.metadata?.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const initialSiteSettings = await fetchSiteSettings(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <SiteBrandingProvider initialSiteSettings={initialSiteSettings}>
          <MotionProvider>
            <HtmlLang locale={locale} />
            {children}
          </MotionProvider>
        </SiteBrandingProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
