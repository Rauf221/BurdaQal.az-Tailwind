"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "@/i18n/navigation";
import { getRandomRegionsQuery } from "@/services/client/home/queries";

const sliderCities2 = {
  spaceBetween: 25,
  slidesPerView: 5,
  observer: true,
  observeParents: true,
  breakpoints: {
    0: { slidesPerView: 1.15 },
    600: { slidesPerView: 2 },
    991: { slidesPerView: 4 },
    1440: { slidesPerView: 5 },
  },
};

const FALLBACK_CITY_IMAGES = [
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
];

export default function FlatCitiesHome() {
  const locale = useLocale();
  const t = useTranslations("flatCitiesHome");
  const { data: regionsPayload, isPending, isError } = useQuery(
    getRandomRegionsQuery(locale)
  );
  const regions = regionsPayload?.data ?? [];

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
          <div className="col-12 px-[14px]">
            <div className="wrap">
              <div className="slider-cities-2">
                <Swiper {...sliderCities2}>
                  {isPending ? (
                    <SwiperSlide>
                      <div className="cities-item style-2 group relative mb-0 h-[300px] overflow-hidden rounded-2xl">
                        <img
                          src={FALLBACK_CITY_IMAGES[0]}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.8)_0%,rgba(26,26,26,0.1)_61.39%,rgba(26,26,26,0)_100%)]" />
                        <div className="absolute left-[30px] top-[27px] z-[3]">
                          <p className="mb-1.5 text-[13px] font-normal leading-[15px] text-[var(--White)]">
                            {t("loadingSub")}
                          </p>
                          <h4 className="text-[19px] font-medium leading-7 text-[var(--White)]">
                            {t("loadingTitle")}
                          </h4>
                        </div>
                        <Link
                          href="/elanlar"
                          className="button-arrow-right absolute bottom-10 left-[30px] z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[var(--White)] opacity-0 transition-all hover:opacity-100 group-hover:opacity-100"
                        >
                          <ArrowRight className="h-[18px] w-[18px] text-[var(--Secondary)]" />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ) : isError ? (
                    <SwiperSlide>
                      <div className="cities-item style-2 group relative mb-0 h-[300px] overflow-hidden rounded-2xl">
                        <img
                          src={FALLBACK_CITY_IMAGES[0]}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.8)_0%,rgba(26,26,26,0.1)_61.39%,rgba(26,26,26,0)_100%)]" />
                        <div className="absolute left-[30px] top-[27px] z-[3]">
                          <p className="mb-1.5 text-[13px] text-[var(--White)]">
                            {t("errorCount")}
                          </p>
                          <h4 className="text-[19px] font-medium text-[var(--White)]">
                            {t("errorTitle")}
                          </h4>
                        </div>
                        <Link
                          href="/elanlar"
                          className="button-arrow-right absolute bottom-10 left-[30px] z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[var(--White)] opacity-0 transition-all group-hover:opacity-100"
                        >
                          <ArrowRight className="h-[18px] w-[18px] text-[var(--Secondary)]" />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ) : (
                    regions.map((region, idx) => (
                      <SwiperSlide key={region.id}>
                        <div className="cities-item style-2 group relative mb-0 h-[300px] overflow-hidden rounded-2xl">
                          <img
                            src={
                              region.image ||
                              FALLBACK_CITY_IMAGES[idx % FALLBACK_CITY_IMAGES.length]
                            }
                            alt={region.name}
                            className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(26,26,26,0.8)_0%,rgba(26,26,26,0.1)_61.39%,rgba(26,26,26,0)_100%)]" />
                          <div className="absolute left-[30px] top-[27px] z-[3]">
                            <p className="mb-1.5 text-[13px] font-normal leading-[15px] text-[var(--White)]">
                              {t("propertyCount", { count: region.announcements_count ?? 0 })}
                            </p>
                            <h4 className="text-[19px] font-medium leading-7 text-[var(--White)]">
                              {region.name}
                            </h4>
                          </div>
                          <Link
                            href={`/elanlar?region=${encodeURIComponent(region.slug)}`}
                            className="button-arrow-right absolute bottom-10 left-[30px] z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[var(--White)] opacity-0 transition-all group-hover:opacity-100"
                          >
                            <ArrowRight className="h-[18px] w-[18px] text-[var(--Secondary)]" />
                          </Link>
                        </div>
                      </SwiperSlide>
                    ))
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
