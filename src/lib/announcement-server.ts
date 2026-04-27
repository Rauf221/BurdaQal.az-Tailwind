import { resolveMediaUrl } from "@/lib/media-url";
import { getAcceptLanguageHeader } from "@/lib/utils";
import { getApiBaseUrl } from "@/providers/server";
import type { PublicAnnouncementItem, PublicAnnouncementShowResponse } from "@/services/client/properties/api";

const REVALIDATE_SEC = 300;

export type ResolvedAnnouncement = PublicAnnouncementItem;

export async function fetchAnnouncementShowJson(
  slug: string,
  locale: string,
): Promise<PublicAnnouncementShowResponse | null> {
  const base = getApiBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/announcement/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_SEC },
      headers: {
        "Accept-Language": getAcceptLanguageHeader(locale || "az"),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicAnnouncementShowResponse;
  } catch {
    return null;
  }
}

export async function fetchAnnouncementsPageJson(
  locale: string,
  page = 1,
): Promise<{ data: PublicAnnouncementItem[] } | null> {
  const base = getApiBaseUrl();
  if (!base) return null;
  try {
    const u = new URL(`${base}/announcements`);
    u.searchParams.set("page", String(page));
    const res = await fetch(u.href, {
      next: { revalidate: REVALIDATE_SEC },
      headers: {
        "Accept-Language": getAcceptLanguageHeader(locale || "az"),
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as { data: PublicAnnouncementItem[] };
  } catch {
    return null;
  }
}

/**
 * justhome `buildAnnouncementForClient` — media və user şəkilləri tam URL.
 */
export function buildAnnouncementForClient(
  payload: PublicAnnouncementShowResponse | null,
  apiBase: string,
): ResolvedAnnouncement | null {
  const data = payload?.data;
  if (!data) return null;
  const resolve = (p: string | null | undefined) => (p ? resolveMediaUrl(apiBase, p) : "");
  const media = data.media;
  const galleryRaw = media?.gallery?.length ? media.gallery : [];
  const cover = media?.cover_image ? resolve(media.cover_image) : "";
  const gallery = galleryRaw.map(resolve).filter(Boolean);
  const slides = gallery.length ? gallery : cover ? [cover] : [];
  const thumbsRaw = media?.thumb_gallery?.length ? media.thumb_gallery : [];
  const thumbsResolved = thumbsRaw.map(resolve).filter(Boolean);
  const thumbGallery =
    thumbsResolved.length >= slides.length
      ? thumbsResolved.slice(0, slides.length)
      : slides;

  return {
    ...data,
    media: media
      ? {
          ...media,
          cover_image: cover,
          gallery: slides,
          thumb_gallery: thumbGallery,
        }
      : null,
    user: data.user
      ? {
          ...data.user,
          image: data.user.image ? resolve(data.user.image) : data.user.image,
        }
      : data.user,
  };
}
