import type { PublicAnnouncementItem } from "@/services/client/properties/api";

export type AdvancedListingParams = {
  min_bedrooms: string;
  min_bathrooms: string;
  min_area: string;
  max_area: string;
  min_price: string;
  max_price: string;
  /** Köhnə URL: slug vergüllə */
  amenities: string;
  /** Yeni: attribute id vergüllə */
  attribute_ids: string;
};

export function parseAdvancedListingParams(
  searchParams: URLSearchParams,
): AdvancedListingParams {
  return {
    min_bedrooms: String(searchParams.get("min_bedrooms") ?? "").trim(),
    min_bathrooms: String(searchParams.get("min_bathrooms") ?? "").trim(),
    min_area: String(searchParams.get("min_area") ?? "").trim(),
    max_area: String(searchParams.get("max_area") ?? "").trim(),
    min_price: String(searchParams.get("min_price") ?? "").trim(),
    max_price: String(searchParams.get("max_price") ?? "").trim(),
    amenities: String(searchParams.get("amenities") ?? "").trim(),
    attribute_ids: String(searchParams.get("attribute_ids") ?? "").trim(),
  };
}

export function hasAdvancedListingParams(a: AdvancedListingParams): boolean {
  return Object.values(a).some((v) => v !== "");
}

function parseAznPrice(raw: string | null | undefined): number | null {
  if (raw == null || raw === "") return null;
  const digits = String(raw).replace(/[^\d.]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

/**
 * API cavabını əlavə şərtlərlə daraldır (backend parametrləri tanımırsa və ya yalnız səhifə məlumatı gəlirsə).
 */
export function announcementMatchesAdvanced(
  row: PublicAnnouncementItem,
  a: AdvancedListingParams,
): boolean {
  const minB = Number(a.min_bedrooms);
  if (a.min_bedrooms !== "" && Number.isFinite(minB)) {
    const v = row.detail?.bedroom ?? 0;
    if (v < minB) return false;
  }
  const minBt = Number(a.min_bathrooms);
  if (a.min_bathrooms !== "" && Number.isFinite(minBt)) {
    const v = row.detail?.bathroom ?? 0;
    if (v < minBt) return false;
  }
  const price = parseAznPrice(row.price);
  const minP = Number(a.min_price);
  if (a.min_price !== "" && Number.isFinite(minP)) {
    if (price == null || price < minP) return false;
  }
  const maxP = Number(a.max_price);
  if (a.max_price !== "" && Number.isFinite(maxP)) {
    if (price == null || price > maxP) return false;
  }
  if (a.attribute_ids !== "") {
    const needed = a.attribute_ids
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (needed.length > 0) {
      const have = new Set((row.attributes ?? []).map((at) => at.id));
      for (const id of needed) {
        if (!have.has(id)) return false;
      }
    }
  }
  if (a.amenities !== "") {
    const needed = a.amenities
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const attrs = row.attributes ?? [];
    for (const token of needed) {
      const hit = attrs.some(
        (at) =>
          (at.slug && at.slug.toLowerCase().includes(token)) ||
          (at.name &&
            at.name.toLowerCase().includes(token.replace(/-/g, " "))),
      );
      if (!hit) return false;
    }
  }
  return true;
}
