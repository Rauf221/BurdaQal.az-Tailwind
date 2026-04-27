"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "@/i18n/navigation";
import { getRandomRegionsQuery } from "@/services/client/home/queries";
import type { RandomRegionItem } from "@/types";

/** Figma: 2007:312 — default; 2049:5002 — hover (mərkəzi ox). */
const SWIPER_FROM_COUNT = 5;

const sliderCities2 = {
  modules: [Navigation],
  spaceBetween: 25,
  slidesPerView: "auto" as const,
  observer: true,
  observeParents: true,
  breakpoints: {
    0: { spaceBetween: 16 },
    600: { spaceBetween: 25 },
  },
  navigation: {
    prevEl: ".flat-cities-prev",
    nextEl: ".flat-cities-next",
    clickable: true,
  },
};

/** API-də şəkil yoxdursa — yalnız lokal rəng keçidləri, xarici şəkil yoxdur */
const CITY_PLACEHOLDER_GRADIENTS = [
  "bg-gradient-to-br from-[#2a3a28] to-[#121512]",
  "bg-gradient-to-br from-[#283440] to-[#12181c]",
  "bg-gradient-to-br from-[#3a3028] to-[#1a1512]",
  "bg-gradient-to-br from-[#2a3038] to-[#121418]",
  "bg-gradient-to-br from-[#283828] to-[#121812]",
] as const;

/** Kart hover (sm+) → ox; mobilde yalnız statik kadr (Figma: 2007/2049) */
function CenterArrowCta() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 ease-out sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 sm:group-focus-visible:pointer-events-auto sm:group-focus-visible:opacity-100"
      aria-hidden
    >
      <div className="group/icon flex h-12 w-12 items-center justify-center rounded-full border border-white bg-[rgba(0,0,0,0.4)] p-3">
        <ArrowUpRight
          className="h-6 w-6 shrink-0 text-white transition-transform duration-200 ease-out sm:group-hover/icon:scale-[1.15]"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

/** Figma 268×290 — əvvəlki ölçü; dar ekranda üfüqi sürüşdürmə, aşağı sətir yox */
const cardClass =
  "group relative block h-[290px] w-[268px] min-w-[250px] max-w-[220px] shrink-0 overflow-hidden rounded-2xl";
const slideW = "!w-[268px] !min-w-[268px] !max-w-[268px]";
const staticRowClass =
  "flex w-full min-w-0 flex-nowrap justify-start gap-x-4 overflow-x-auto overflow-y-visible py-1 sm:gap-x-6";
const swiperShellClass = "w-full min-w-0";

/** Swiper 12 oxu `::after` deyil — `svg.swiper-navigation-icon`; default 100%×100% doldurur; yalnız ikon üçün ölçü */
const flatCitiesSwiperNavSvg =
  "[&_svg.swiper-navigation-icon]:!block [&_svg.swiper-navigation-icon]:!h-[20px] [&_svg.swiper-navigation-icon]:!w-[10.5px] [&_svg.swiper-navigation-icon]:shrink-0";

function RegionCityCard({ region, idx }: { region: RandomRegionItem; idx: number }) {
  const t = useTranslations("flatCitiesHome");
  return (
    <Link
      href={`/elanlar?region=${encodeURIComponent(region.slug)}`}
      className={`${cardClass} block`}
    >
      {region.image ? (
        <img
          src={region.image}
          alt={region.name}
          className="absolute inset-0 size-full max-w-none rounded-2xl object-cover transition-transform duration-500 ease-out sm:group-hover:scale-110 sm:group-focus-visible:scale-110"
        />
      ) : (
        <div
          className={`absolute inset-0 min-h-full rounded-2xl ${CITY_PLACEHOLDER_GRADIENTS[idx % CITY_PLACEHOLDER_GRADIENTS.length]}`}
          aria-hidden
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-transparent to-[rgba(0,0,0,0.5)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[rgba(0,0,0,0.32)] max-sm:opacity-0! opacity-0 transition-opacity duration-500 ease-out sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />
      <div className="absolute left-5 top-5 z-[1] flex flex-col gap-1 text-white not-italic ">
        <p className="text-sm font-medium leading-5">
          {t("propertyCount", {
            count: region.announcements_count ?? 0,
          })}
        </p>
        <p className="text-xl font-semibold leading-6">{region.name}</p>
      </div>
      <CenterArrowCta />
    </Link>
  );
}

export default function FlatCitiesHome() {
  const locale = useLocale();
  const t = useTranslations("flatCitiesHome");
  const { data: regionsPayload, isPending, isError } = useQuery(
    getRandomRegionsQuery(locale)
  );
  const regions = regionsPayload?.data ?? [];
  const useSwiper = !isPending && !isError && regions.length >= SWIPER_FROM_COUNT;

  return (
    <section className="tf-section flat-cities style-4 pb-0 pt-[114px]">
      <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
        <div className="row -mx-[14px]">
          <div className="col-12 px-[14px]">
            <div className="heading-section mb-[46px] text-center">
              <h2 className="-mt-2 mb-4 text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
                {t("title")}
              </h2>
              <div className="text text-[17px] font-normal leading-5 text-[var(--Text)]">
                {t("subtitle")}
              </div>
            </div>
          </div>
        </div>
        <div className="row -mx-[14px]">
          <div className="col-12 min-w-0 px-[14px]">
            <div className="wrap min-w-0">
              <div className="slider-cities-2 min-w-0">
                {isPending ? (
                  <div className={staticRowClass}>
                    <div className={cardClass}>
                      <div
                        className={`absolute inset-0 min-h-full ${CITY_PLACEHOLDER_GRADIENTS[0]}`}
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[rgba(0,0,0,0.32)]" />
                      <div className="absolute left-5 top-5 z-[1] flex flex-col gap-1 text-white not-italic">
                        <p className="text-sm font-medium leading-5">
                          {t("loadingSub")}
                        </p>
                        <p className="text-xl font-semibold leading-6">
                          {t("loadingTitle")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : isError ? (
                  <div className={staticRowClass}>
                    <Link href="/elanlar" className={`${cardClass} block`}>
                      <div
                        className={`absolute inset-0 min-h-full ${CITY_PLACEHOLDER_GRADIENTS[0]}`}
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[rgba(0,0,0,0.32)]" />
                      <div className="absolute left-5 top-5 z-[1] flex flex-col gap-1 text-white not-italic">
                        <p className="text-sm font-medium leading-5">
                          {t("errorCount")}
                        </p>
                        <p className="text-xl font-semibold leading-6">
                          {t("errorTitle")}
                        </p>
                      </div>
                      <CenterArrowCta />
                    </Link>
                  </div>
                ) : useSwiper ? (
                  <div className="flat-cities-swiper">
                    <Swiper {...sliderCities2} className={swiperShellClass}>
                      {regions.map((region, idx) => (
                        <SwiperSlide key={region.id} className={slideW}>
                          <RegionCityCard region={region} idx={idx} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="mt-8 flex items-center justify-center gap-6 sm:mt-10 sm:gap-5">
                      <div
                        className={`flat-cities-prev swiper-button-prev !static !left-auto !right-auto !top-auto mt-0 !h-11 !w-11 -translate-y-0 rounded-full border border-jh-border bg-jh-white  ${flatCitiesSwiperNavSvg}`}
                        role="button"
                        tabIndex={0}
                        aria-label={t("prevSlide")}
                      />
                      <div
                        className={`flat-cities-next swiper-button-next !static !left-auto !right-auto !top-auto mt-0 !h-11 !w-11 -translate-y-0 rounded-full border border-jh-border bg-jh-white ${flatCitiesSwiperNavSvg}`}
                        role="button"
                        tabIndex={0}
                        aria-label={t("nextSlide")}
                      />
                    </div>
                  </div>
                ) : (
                  <div className={staticRowClass}>
                    {regions.map((region, idx) => (
                      <RegionCityCard
                        key={region.id}
                        region={region}
                        idx={idx}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
