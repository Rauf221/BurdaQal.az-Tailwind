import { metaKeywordsToArray } from "@/lib/site-api-server";
import { getBlogShow } from "@/services/client/blogs/api";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return {};
  }
  const messages = (await import(`@/messages/${locale}.json`)).default as {
    metadata?: { title?: string; description?: string };
  };

  try {
    const res = await getBlogShow(slug, locale);
    const d = res.data;
    const title = d.meta_title?.trim() || d.title;
    const description = d.meta_description?.trim() || undefined;
    return {
      title,
      description: description ?? messages.metadata?.description,
      keywords: metaKeywordsToArray(d.meta_keywords),
    };
  } catch {
    return {
      title: messages.metadata?.title,
      description: messages.metadata?.description,
    };
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
