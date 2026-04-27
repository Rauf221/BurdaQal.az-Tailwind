import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertySingleV5 from "@/components/elanlar/PropertySingleV5";
import {
  buildAnnouncementForClient,
  fetchAnnouncementShowJson,
  fetchAnnouncementsPageJson,
} from "@/lib/announcement-server";
import { getApiBaseUrl } from "@/providers/server";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await fetchAnnouncementShowJson(slug, locale);
  const title = raw?.data?.title;
  const description = raw?.data?.description?.trim().slice(0, 160);
  return {
    title: title ? `${title} | Burdaqal.az` : "Elan | Burdaqal.az",
    ...(description ? { description } : {}),
  };
}

export default async function ElanDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = getApiBaseUrl();
  const raw = await fetchAnnouncementShowJson(slug, locale);
  if (!raw?.data) notFound();
  const announcement = buildAnnouncementForClient(raw, base);
  if (!announcement) notFound();

  const list = await fetchAnnouncementsPageJson(locale, 1);
  const similarHomes = (list?.data ?? []).filter((x) => x.slug !== slug).slice(0, 2);

  return <PropertySingleV5 announcement={announcement} similarHomes={similarHomes} />;
}
