"use client";

import { useId, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { ImageOff } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "@/i18n/navigation";
import { ElanlarCardContent } from "@/components/elements/elanlar-card/ElanlarCardContent";
import { ElanlarCardImageOverlays } from "@/components/elements/elanlar-card/ElanlarCardImageOverlays";
import { ElanlarCardNavArrows } from "@/components/elements/elanlar-card/ElanlarCardNavArrows";

/**
 * Figma: **2116:7177** (default) + **2116:7155** (hover — nav).
 * Alt komponentlər: `elanlar-card/ElanlarCardContent`, `ElanlarCardImageOverlays`, `ElanlarCardNavArrows`.
 */
export type ElanlarCardProps = {
  href: string;
  title: string;
  address: string;
  imageAlt?: string;
  images: string[];
  className?: string;
  priceLine?: string;
  priceLabel?: string;
  priceTextClassName?: string;
  beds: number | null;
  baths: number | null;
  rooms: number | null;
  emptyLabel?: string;
  badge?: string;
  mediaReady?: boolean;
  autoplayOnHover?: boolean;
  onSwiperReady?: (swiper: SwiperType) => void;
};

const CARD_FRAME = "w-full max-w-[342px] overflow-hidden rounded-2xl ";

export default function ElanlarCard({
  href,
  title,
  address,
  imageAlt = "",
  images: imagesIn,
  className = "",
  priceLine,
  priceLabel = "",
  priceTextClassName,
  beds,
  baths,
  rooms,
  emptyLabel = "—",
  badge,
  mediaReady = true,
  autoplayOnHover = false,
  onSwiperReady,
}: ElanlarCardProps) {
  const uid = useId().replace(/:/g, "");
  const paginationClass = `elanlar-card-pag-${uid}`;
  const swiperRef = useRef<SwiperType | null>(null);
  const images = mediaReady ? imagesIn : imagesIn.length > 0 ? [imagesIn[0]!] : [];
  const hasImage = images.length > 0;
  const multi = images.length > 1;

  const showAutoplay = Boolean(autoplayOnHover && multi && mediaReady);
  const priceContent =
    priceLine != null && String(priceLine).length > 0
      ? String(priceLine)
      : priceLabel != null && String(priceLabel).length > 0
        ? `₼${priceLabel}`
        : emptyLabel;

  const priceClass =
    priceTextClassName ??
    "text-[16px] font-semibold leading-5 text-black";

  return (
    <article
      className={`group ${CARD_FRAME} ${className}`.trim()}
      data-figma-default="2116:7177"
      data-figma-hover="2116:7155"
      onMouseEnter={() => {
        if (showAutoplay) swiperRef.current?.autoplay?.start();
      }}
      onMouseLeave={() => {
        if (showAutoplay) swiperRef.current?.autoplay?.stop();
      }}
    >
      <div className="relative h-[312px] w-full box-border">
        {badge ? (
          <div className="absolute left-5 top-5 z-10 flex gap-2.5">
            <span className="rounded-[120px] bg-jh-fourth px-[15px] py-2 text-[13px] font-medium leading-[15px] text-jh-white">
              {badge}
            </span>
          </div>
        ) : null}
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#e8e8ed]">
          {hasImage && multi ? (
            <>
              <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                spaceBetween={0}
                pagination={{
                  el: `.${paginationClass}`,
                  clickable: true,
                }}
                autoplay={
                  showAutoplay
                    ? {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                onSwiper={(s) => {
                  swiperRef.current = s;
                  onSwiperReady?.(s);
                  if (showAutoplay) s.autoplay?.stop();
                }}
                className="elanlar-card-swiper m-0! h-full w-full"
              >
                {images.map((src, i) => (
                  <SwiperSlide key={`${src}-${i}`} className="m-0!">
                    <Link href={href} className="block h-full w-full" aria-label={title || imageAlt}>
                      <img
                        src={src}
                        alt={imageAlt || title || ""}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  </SwiperSlide>
                ))}
                <div
                  className={`${paginationClass} swiper-pagination elanlar-card-swiper-pag bottom-3! left-0! right-0! top-auto! z-2`}
                />
              </Swiper>
              <ElanlarCardImageOverlays />
              <ElanlarCardNavArrows
                onPrev={() => swiperRef.current?.slidePrev()}
                onNext={() => swiperRef.current?.slideNext()}
              />
            </>
          ) : hasImage && !multi ? (
            <>
              <Link href={href} className="block h-full w-full" aria-label={title || imageAlt}>
                <img
                  src={images[0]}
                  alt={imageAlt || title || ""}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <ElanlarCardImageOverlays />
            </>
          ) : (
            <Link
              href={href}
              className="flex h-full w-full items-center justify-center text-jh-text/35"
              aria-hidden
            >
              <ImageOff className="h-10 w-10" strokeWidth={1.25} />
            </Link>
          )}
        </div>
      </div>

      <ElanlarCardContent
        href={href}
        title={title}
        priceText={priceContent}
        priceClassName={priceClass}
        address={address}
        beds={beds}
        baths={baths}
        rooms={rooms}
        emptyLabel={emptyLabel}
      />
    </article>
  );
}
