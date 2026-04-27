import { publicStorageUrl } from "@/services/client/properties";
import type { PublicAnnouncementItem } from "@/services/client/properties/api";

/** Elan kartı / oxşar elan üçün şəkil URL siyahısı (mediada şəkil yoxdursa boş) */
export function announcementCardImages(media: PublicAnnouncementItem["media"]) {
  if (!media?.cover_image && !(media?.gallery?.length)) {
    return [];
  }
  const paths = [media.cover_image, ...(media.gallery ?? [])].filter(Boolean);
  const uniq = [...new Set(paths)] as string[];
  return uniq
    .map((p) => publicStorageUrl(p))
    .filter((u): u is string => u != null && u !== "");
}
