import { publicStorageUrl } from "@/services/client/properties";
import type { PublicAnnouncementItem } from "@/services/client/properties/api";

const CARD_IMAGE_LIMIT = 3;

/**
 * Elan kartı üçün şəkil URL-ləri (ən çox 3):
 * 1) kart üçün `cover_image_thumb` (yoxdursa `cover_image`)
 * 2–3) `gallery`-nin ilk iki elementi üçün `thumb_gallery` (yoxdursa tam `gallery` yolu).
 * Tək elan səhifəsi tam `gallery` göstərir — bax: `PropertySingleV5` mainSlides.
 */
export function announcementCardImages(media: PublicAnnouncementItem["media"]) {
  if (!media) return [];

  const out: string[] = [];
  const seen = new Set<string>();

  function pushResolved(path: string | null | undefined) {
    if (path == null || String(path).trim() === "") return;
    const u = publicStorageUrl(String(path).trim());
    if (!u || u === "" || seen.has(u)) return;
    seen.add(u);
    out.push(u);
  }

  const coverForCard =
    media.cover_image_thumb != null && String(media.cover_image_thumb).trim() !== ""
      ? String(media.cover_image_thumb).trim()
      : media.cover_image;

  pushResolved(coverForCard);
  if (out.length === 0 && !(media.gallery?.length)) return [];

  const gallery = media.gallery ?? [];
  const thumbs = media.thumb_gallery ?? [];

  for (let i = 0; i < gallery.length && out.length < CARD_IMAGE_LIMIT; i++) {
    const g = gallery[i];
    if (g == null || String(g).trim() === "") continue;
    const thumbPath = thumbs[i];
    const chosen =
      thumbPath != null && String(thumbPath).trim() !== "" ? String(thumbPath).trim() : String(g).trim();
    pushResolved(chosen);
  }

  return out;
}
