import { publicStorageUrl } from "@/services/client/properties";
import type { PublicAnnouncementItem } from "@/services/client/properties/api";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

/** Elan kartı / oxşar elan üçün şəkil URL siyahısı */
export function announcementCardImages(media: PublicAnnouncementItem["media"]) {
  if (!media?.cover_image && !(media?.gallery?.length)) {
    return [PLACEHOLDER_IMG];
  }
  const paths = [media.cover_image, ...(media.gallery ?? [])].filter(Boolean);
  const uniq = [...new Set(paths)] as string[];
  const urls = uniq
    .map((p) => publicStorageUrl(p))
    .filter((u): u is string => u != null && u !== "");
  return urls.length ? urls : [PLACEHOLDER_IMG];
}
