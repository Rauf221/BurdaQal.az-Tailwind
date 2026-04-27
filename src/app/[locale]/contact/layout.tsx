import {
  fetchMetaTagList,
  metaKeywordsToArray,
  pickMetaRow,
} from "@/lib/site-api-server";
import { routing } from "@/i18n/routing";

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
  const metaList = await fetchMetaTagList(locale);
  const row = pickMetaRow(metaList, "Contact");
  return {
    title: row?.meta_title ?? messages.metadata?.title,
    description: row?.meta_description ?? messages.metadata?.description,
    keywords: metaKeywordsToArray(row?.meta_keywords),
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
