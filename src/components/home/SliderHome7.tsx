"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ImageOff, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Link, useRouter } from "@/i18n/navigation";
import { getSliderQuery } from "@/services/client/home/queries";
import {
  announcementsListQuery,
  publicStorageUrl,
} from "@/services/client/properties";
import {
  appendAdvancedFilterParams,
  emptyExtraFilters,
  PropertyAdvancedFilterPanel,
} from "@/components/properties/PropertyAdvancedFilterPanel";
import {
  attributesListQuery,
  categoriesListQuery,
  groupAttributesByParent,
  regionsListQuery,
} from "@/services/dashboard/Add-New-Properties";

const sliderCfg = {
  modules: [Navigation, EffectFade],
  spaceBetween: 0,
  slidesPerView: 1,
  observer: true,
  observeParents: true,
  effect: "fade" as const,
  fadeEffect: { crossFade: true },
  navigation: {
    nextEl: ".home7-next",
    prevEl: ".home7-prev",
    clickable: true,
  },
};

function TitleLines({ text }: { text: string | undefined }) {
  const lines = String(text || "")
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <h1 className="mx-auto mb-6 max-w-[887px] text-[22px] font-medium leading-[28px] text-[var(--White)] sm:text-[28px] sm:leading-[34px] md:mb-8 md:text-[60px] md:leading-[70px]">
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </h1>
  );
}

export default function SliderHome7() {
  const locale = useLocale();
  const t = useTranslations("sliderHome7");
  const router = useRouter();
  const { data, isPending } = useQuery(getSliderQuery(locale, 1));
  const categoriesQ = useQuery(categoriesListQuery(locale));
  const regionsQ = useQuery(regionsListQuery(locale));
  const attributesQ = useQuery(attributesListQuery(locale));
  const [filters, setFilters] = useState({
    search: "",
    region_id: "",
    category_id: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [extraFilters, setExtraFilters] = useState(emptyExtraFilters);
  /** Seçilmiş imkanlar — açar: attribute id (string) */
  const [attributeSel, setAttributeSel] = useState<Record<string, boolean>>({});
  const [searchFieldFocused, setSearchFieldFocused] = useState(false);
  const searchFieldWrapRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const previewQ = useQuery(
    announcementsListQuery(locale, 1, {
      search: filters.search,
      category_id: filters.category_id,
      region_id: filters.region_id,
    })
  );

  const fallbackSlides = useMemo(
    () => [
      {
        title: t("fallbackTitle"),
        description: t("fallbackDescription"),
        image: "",
        thumb_image: "",
        btn: t("fallbackBtn"),
        btn_link: "/elanlar",
      },
      {
        title: t("fallbackTitle"),
        description: t("fallbackDescription"),
        image: "",
        thumb_image: "",
        btn: t("fallbackBtn"),
        btn_link: "/elanlar",
      },
      {
        title: t("fallbackTitle"),
        description: t("fallbackDescription"),
        image: "",
        thumb_image: "",
        btn: t("fallbackBtn"),
        btn_link: "/elanlar",
      },
    ],
    [t],
  );

  const slides =
    !isPending && data?.data && data.data.length > 0 ? data.data : fallbackSlides;
  const categories = categoriesQ.data?.data ?? [];
  const regions = regionsQ.data?.data ?? [];
  const attributeSections = useMemo(() => {
    const raw = attributesQ.data?.data;
    if (!raw?.length) return [];
    return groupAttributesByParent(raw);
  }, [attributesQ.data?.data]);
  const previewItems = (previewQ.data?.data ?? []).slice(0, 4);
  const searchTrimmed = filters.search.trim();
  const hasSearchQuery = searchTrimmed.length > 0;

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const q = new URLSearchParams();
    if (searchTrimmed) q.set("search", searchTrimmed);
    if (filters.category_id) q.set("category_id", filters.category_id);
    if (filters.region_id) q.set("region_id", filters.region_id);
    appendAdvancedFilterParams(q, extraFilters, attributeSel);
    const qs = q.toString();
    router.push(`/elanlar${qs ? `?${qs}` : ""}`);
    setFilterOpen(false);
  };

  const showSearchDropdown =
    (hasSearchQuery && searchFieldFocused) ||
    (!hasSearchQuery && searchFieldFocused && previewItems.length > 0);

  const showSearchEmpty =
    hasSearchQuery &&
    searchFieldFocused &&
    !previewQ.isFetching &&
    previewItems.length === 0;

  useEffect(() => {
    if (!showSearchDropdown) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const el = searchFieldWrapRef.current;
      if (el && !el.contains(e.target as Node)) {
        setSearchFieldFocused(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [showSearchDropdown]);

  useEffect(() => {
    if (!filterOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (filterButtonRef.current?.contains(t)) return;
      if (filterPanelRef.current?.contains(t)) return;
      setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [filterOpen]);

  return (
    <section className="slider home7 overflow-visible">
      <div className="slider-home7 slider-effect-fade arrow-style-1 pagination-style-1 relative">
        <Swiper
          key={
            !isPending && data?.data?.length
              ? `slider-api-${data.data.length}`
              : "slider-fallback"
          }
          className="!overflow-visible"
          {...sliderCfg}
        >
          {slides.map((item, idx) => {
            const img = item.image || item.thumb_image;
            return (
              <SwiperSlide key={`home7-slide-${idx}`}>
                <div className="wrap-slider relative bg-[var(--jh-cream)] md:min-h-[750px] min-h-[500px] overflow-hidden">
                  <div className="image absolute inset-0 ">
                    {img ? (
                      <img
                        src={img}
                        alt={item.title?.replace(/\n/g, " ") || ""}
                        className="h-full w-full object-cover max-h-[800px] min "
                      />
                    ) : (
                      <div
                        className="h-full w-full bg-gradient-to-br from-[#40ef29] via-[#1a1a18] to-[#0a0a0a]"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(26,26,26,0.8)_0%,rgba(26,26,26,0.1)_61.39%,rgba(26,26,26,0)_100%)]"
                    aria-hidden
                  />
                  <div className="slider-item relative z-[5]">
                    <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
                      <div className="row -mx-[14px]">
                        <div className="col-12 px-[14px]">
                          <div className="slider-content px-0 py-[110px] text-center mt-30 md:mt-0 sm:py-[140px] md:pb-[228px] md:pt-[284px] max-w-[700px] mx-auto">
                            <TitleLines text={item.title} />
                            <div className="mb-[20px] text-[14px] font-normal leading-[20px] text-[var(--White)] sm:text-[15px] sm:leading-[22px] md:mb-[33px] md:text-[17px] md:leading-5">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="home7-prev swiper-button-prev has-background !left-4 !top-1/2 !mt-0 !h-[30px] !w-[30px] -translate-y-1/2 rounded-full border-0  after:!text-[12px] after:!font-bold after:!text-[var(--White)] md:!left-[60px]" />
        <div className="home7-next swiper-button-next has-background !right-4 !top-1/2 !mt-0 !h-[30px] !w-[30px] -translate-y-1/2 rounded-full border-0  after:!text-[12px] after:!font-bold after:!text-[var(--White)] md:!right-[60px]" />
      </div>

      <form
        className="form-search-home5 background-secondary relative z-50 mx-auto -mt-[48px] flex max-w-[1162px] flex-col items-stretch gap-6 overflow-visible rounded-[24px] bg-[var(--Secondary)] px-5 py-5 md:flex-row md:flex-nowrap md:items-end md:gap-6 md:px-[30px] md:py-[19px] xl:gap-[50px]"
        onSubmit={onSubmit}
      >
        <div className="list mt-0 flex w-full flex-grow flex-col gap-5 md:flex-row md:flex-nowrap md:items-end md:gap-5 xl:gap-[30px]">
          <div className="group-form form-search-content w-full md:flex-1 md:basis-[240px] md:min-w-0 md:max-w-none lg:basis-[320px] lg:max-w-[400px]">
            <div className="form-style-has-title">
              <div className="title mb-[5px] text-[13px] font-normal leading-[15px] text-[#8b8b8b]">
                {t("searchLabel")}
              </div>
              <div ref={searchFieldWrapRef} className="relative">
                <fieldset className="name border-0 p-0">
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="show-search style-default h-[26px] w-full border-0 bg-transparent p-0 pr-11 text-[15px] font-medium leading-[26px] text-[var(--White)] outline-none placeholder:font-normal placeholder:text-white/75"
                    name="search"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((p) => ({ ...p, search: e.target.value }))
                    }
                    onFocus={() => setSearchFieldFocused(true)}
                  />
                </fieldset>
                <div className="style-absolute-right pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--White)]">
                  <Search className="h-[18px] w-[18px]" />
                </div>
                <div
                  className={`box-content-search style-1 ${showSearchDropdown ? "slider-home7-search-dropdown--open" : ""}`}
                  aria-hidden={!showSearchDropdown}
                >
                  {hasSearchQuery && previewQ.isFetching ? (
                    <p className="slider-home7-search-dropdown-status m-0 px-3 py-6 text-center text-[15px] text-[#6f6f6f]">
                      {t("loading")}
                    </p>
                  ) : previewItems.length > 0 ? (
                    <ul>
                      {previewItems.map((row) => {
                        const cover =
                          publicStorageUrl(row.media?.cover_image_thumb) ??
                          publicStorageUrl(row.media?.cover_image);
                        return (
                        <li key={row.id}>
                          <Link href={`/elanlar/${row.slug}`} className="item1">
                            <div>
                              <div className="image">
                                {cover ? (
                                  <img src={cover} alt={row.title || ""} />
                                ) : (
                                  <div
                                    className="flex h-full min-h-[48px] w-full items-center justify-center bg-[#e8e8e8] text-[var(--Text)]/30"
                                    aria-hidden
                                  >
                                    <ImageOff className="h-5 w-5" strokeWidth={1.5} />
                                  </div>
                                )}
                              </div>
                              <p>{row.title}</p>
                            </div>
                            <div className="text">
                              {row.category?.name || t("listingFallback")}
                            </div>
                          </Link>
                        </li>
                        );
                      })}
                    </ul>
                  ) : showSearchEmpty ? (
                    <p className="slider-home7-search-dropdown-status m-0 px-3 py-6 text-center text-[15px] font-medium text-[var(--Secondary)]">
                      {t("noResults")}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="divider-1 hidden h-[36px] w-px shrink-0 bg-white/10 md:block" />
          <div className="group-form w-full shrink-0 md:w-[110px] lg:w-[126px] xl:w-[140px]">
            <div className="form-style-has-title">
              <div className="title mb-[5px] text-[13px] font-normal leading-[15px] text-[#8b8b8b]">
                {t("region")}
              </div>
              <div className="relative">
                <select
                  className="nice-select style-white h-[26px] w-full cursor-pointer appearance-none border-0 bg-transparent p-0 pr-6 text-[15px] font-medium leading-[26px] text-[#a8a8a8] outline-none"
                  name="region_id"
                  value={filters.region_id}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, region_id: e.target.value }))
                  }
                >
                  <option value="" className="text-[var(--Secondary)]">
                    {t("all")}
                  </option>
                  {regions.map((region) => (
                    <option
                      key={region.id}
                      value={String(region.id)}
                      className="text-[var(--Secondary)]"
                    >
                      {region.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a8a8a]" />
              </div>
            </div>
          </div>
          <div className="divider-1 hidden h-[36px] w-px shrink-0 bg-white/10 md:block" />
          <div className="group-form w-full shrink-0 md:w-[110px] lg:w-[126px] xl:w-[140px]">
            <div className="form-style-has-title">
              <div className="title mb-[5px] text-[13px] font-normal leading-[15px] text-[#8b8b8b]">
                {t("category")}
              </div>
              <div className="relative">
                <select
                  className="nice-select h-[26px] w-full cursor-pointer appearance-none border-0 bg-transparent p-0 pr-6 text-[15px] font-medium leading-[26px] text-[#a8a8a8] outline-none"
                  name="category_id"
                  value={filters.category_id}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, category_id: e.target.value }))
                  }
                >
                  <option value="" className="text-[var(--Secondary)]">
                    {t("all")}
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={String(category.id)}
                      className="text-[var(--Secondary)]"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a8a8a]" />
              </div>
            </div>
          </div>
        </div>

        <div className="slider-home7-form-actions flex w-full shrink-0 flex-row items-stretch gap-2.5 md:w-auto md:gap-2.5 lg:gap-5">
          <div className="group-form shrink-0">
            <div className="wg-filter relative z-[15]">
              <button
                ref={filterButtonRef}
                type="button"
                className={`tf-button-filter btn-filter flex min-h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-4 py-4 text-[15px] font-medium leading-[18px] text-[var(--White)] transition-colors lg:gap-2.5 lg:px-6 xl:px-[30px] ${filterOpen ? "border-white/40" : "border-white/15"}`}
                onClick={() => setFilterOpen((v) => !v)}
              >
                <SlidersHorizontal className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {t("filter")}
              </button>
            </div>
          </div>
          <div className="group-form min-w-0 flex-1 md:w-[120px] md:flex-none lg:w-[140px] xl:w-[150px]">
            <div className="button-submit">
              <button
                type="submit"
                className="flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-xl bg-[var(--Primary)] px-5 py-[19px] text-[15px] font-medium leading-[17px] text-[var(--White)] transition-[filter] hover:brightness-[0.96] lg:px-6 xl:px-[30px]"
              >
                {t("submitCta")}
              </button>
            </div>
          </div>
        </div>

        <PropertyAdvancedFilterPanel
          open={filterOpen}
          panelRef={filterPanelRef}
          idPrefix="home7"
          extraFilters={extraFilters}
          setExtraFilters={setExtraFilters}
          attributeSel={attributeSel}
          setAttributeSel={setAttributeSel}
          attributeSections={attributeSections}
          attributesPending={attributesQ.isPending}
          attributesError={attributesQ.isError}
        />
      </form>
    </section>
  );
}
