"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ElanlarCard from "@/components/elements/ElanlarCard";
import { announcementCardImages } from "@/components/elanlar/announcementCardImages";
import {
  announcementsListQuery,
  type PublicAnnouncementItem,
} from "@/services/client/properties";
import {
  announcementMatchesAdvanced,
  hasAdvancedListingParams,
  parseAdvancedListingParams,
} from "@/services/client/properties/announcementAdvancedFilter";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";

const PropertyCard = memo(function PropertyCard({
  row,
}: {
  row: PublicAnnouncementItem;
}) {
  const t = useTranslations("listings");
  const tc = useTranslations("common");
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!cardRef.current || isVisible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "220px 0px" },
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const d = row.detail;
  const street = row.address?.street;
  const images = announcementCardImages(row.media);
  const detailHref = `/elanlar/${row.slug}`;

  return (
    <div ref={cardRef} className="mb-[30px] min-w-0">
      <ElanlarCard
        href={detailHref}
        title={row.title ?? ""}
        imageAlt={row.title ?? ""}
        priceLine={
          row.price ? t("priceAzn", { price: row.price }) : tc("dash")
        }
        address={street || tc("dash")}
        beds={d?.bedroom ?? null}
        baths={d?.bathroom ?? null}
        rooms={d?.room ?? null}
        emptyLabel={tc("dash")}
        images={images}
        mediaReady={isVisible}
        badge={t("tagListing")}
        className="w-full max-w-full"
      />
    </div>
  );
});

export default function ElanlarListings() {
  const locale = useLocale();
  const t = useTranslations("listings");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const searchKey = searchParams.toString();
  const search = String(searchParams.get("search") ?? "").trim();
  const category_id = String(searchParams.get("category_id") ?? "").trim();
  const region_id = String(searchParams.get("region_id") ?? "").trim();
  const advanced = useMemo(
    () => parseAdvancedListingParams(new URLSearchParams(searchKey)),
    [searchKey],
  );
  const q = useQuery(
    announcementsListQuery(locale, page, {
      search,
      category_id,
      region_id,
      ...(advanced.min_bedrooms && { min_bedrooms: advanced.min_bedrooms }),
      ...(advanced.min_bathrooms && { min_bathrooms: advanced.min_bathrooms }),
      ...(advanced.min_area && { min_area: advanced.min_area }),
      ...(advanced.max_area && { max_area: advanced.max_area }),
      ...(advanced.min_price && { min_price: advanced.min_price }),
      ...(advanced.max_price && { max_price: advanced.max_price }),
      ...(advanced.amenities && { amenities: advanced.amenities }),
      ...(advanced.attribute_ids && { attribute_ids: advanced.attribute_ids }),
    }),
  );

  useEffect(() => {
    setPage(1);
  }, [searchKey]);

  const items = useMemo(() => q.data?.data ?? [], [q.data?.data]);
  const clientFiltered = useMemo(() => {
    if (!hasAdvancedListingParams(advanced)) return items;
    return items.filter((row) => announcementMatchesAdvanced(row, advanced));
  }, [items, advanced]);
  const meta = q.data?.meta;
  const total = hasAdvancedListingParams(advanced)
    ? clientFiltered.length
    : meta?.total ?? 0;
  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;

  return (
    <div className="property-grid-wrap-v2 box-border w-full max-w-full overflow-x-hidden pb-20">
      <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
        <FadeIn>
          <div className="top mb-[21px]">
          <div className="sub flex flex-wrap items-center justify-between gap-4">
            <p className="m-0 text-[var(--Text)]">
              {q.isPending ? tc("ellipsis") : tc("resultsCount", { count: total })}
            </p>
            <div className="sort-wrap flex items-center gap-[7px]">
              <p className="m-0 w-full text-[var(--Fourth)]">{t("sortLabel")}</p>
              <select
                className="nice-select default cursor-not-allowed rounded-xl border border-[var(--Border)] bg-[var(--White)] px-3 py-2 text-sm text-[var(--Secondary)] opacity-80"
                tabIndex={0}
                disabled
                aria-disabled="true"
              >
                <option>{t("sortNewest")}</option>
              </select>
            </div>
          </div>
        </div>
        </FadeIn>
        <FadeInStagger className="grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
          {q.isError ? (
            <div className="col-span-full px-3 py-6 text-[#c62828]">
              {t("loadError")}
            </div>
          ) : q.isPending ? (
            <div className="col-span-full px-3 py-6 text-[var(--Text)]">{t("loading")}</div>
          ) : (
            clientFiltered.map((row) => (
              <FadeInStaggerItem key={row.id} className="min-w-0">
                <PropertyCard row={row} />
              </FadeInStaggerItem>
            ))
          )}
        </FadeInStagger>
        {!q.isPending && !q.isError && clientFiltered.length === 0 ? (
          <div className="px-3 py-6 text-[var(--Text)]">
            {items.length === 0 ? t("emptyAll") : t("emptyFiltered")}
          </div>
        ) : null}
        {lastPage > 1 && !hasAdvancedListingParams(advanced) ? (
          <ul className="wg-pagination mt-2.5 mb-10 flex list-none flex-wrap items-center justify-center gap-2 p-0">
            <li className="list-none">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-[var(--Primary)] px-4 py-3 text-[15px] font-medium text-[var(--White)] transition-colors hover:bg-[#6fb042] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label={tc("prevPage")}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </button>
            </li>
            <li className="list-none">
              <span className="px-3 text-sm text-[var(--Secondary)]">
                {tc("pageOf", { current: currentPage, last: lastPage })}
              </span>
            </li>
            <li className="list-none">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-[var(--Primary)] px-4 py-3 text-[15px] font-medium text-[var(--White)] transition-colors hover:bg-[#6fb042] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage >= lastPage}
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                aria-label={tc("nextPage")}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}
