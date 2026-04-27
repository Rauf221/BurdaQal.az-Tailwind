"use client";

import { useMemo } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ImageOff } from "lucide-react";
import { Link } from "@/i18n/navigation";

type SliderBoxDreamProps = {
  start: number;
  end: number;
  path: string;
  detailHref?: string;
  images?: string[];
  navKey?: string;
  autoplayOnHover?: boolean;
  onSwiperReady?: (swiper: SwiperType) => void;
};

/**
 * justhome `SliderBoxDream.js` — elan kartında şəkil slayderi.
 */
export default function SliderBoxDream({
  start,
  end,
  path,
  detailHref,
  images,
  navKey,
  autoplayOnHover,
  onSwiperReady,
}: SliderBoxDreamProps) {
  const explicitEmpty = Array.isArray(images) && images.length === 0;
  const useRemoteImages = Array.isArray(images) && images.length > 0;

  if (explicitEmpty) {
    const voidInner = (
      <div
        className="flex h-full min-h-0 w-full min-w-0 items-center justify-center bg-[#f0f0f0] text-[var(--Text)]/35"
        aria-hidden
      >
        <ImageOff className="h-10 w-10" strokeWidth={1.25} />
      </div>
    );
    return (
      <div className="slider-box-dream h-full min-h-0 w-full max-w-full">
        {detailHref ? (
          <Link href={detailHref} className="block h-full min-h-0 w-full">
            {voidInner}
          </Link>
        ) : (
          voidInner
        )}
      </div>
    );
  }

  const slideEntries = useMemo(() => {
    if (useRemoteImages) {
      return images!.map((src, i) => ({ src, key: `remote-${i}` }));
    }
    return Array.from({ length: end - start }, (_, i) => ({
      src: `/images/${path}-${start + i}.jpg`,
      key: start + i,
    }));
  }, [useRemoteImages, images, path, start, end]);

  const navId = useRemoteImages ? (navKey ?? `r-${start}-${end}`) : null;
  const nextNavClass = useRemoteImages ? `sdp-next-${navId}` : `sdp${start}`;
  const prevNavClass = useRemoteImages ? `sdp-prev-${navId}` : `sdp${end}`;
  const paginationClass = useRemoteImages
    ? `box-dream-pagination-${navId}`
    : `box-dream-pagination-${start}-${end}`;

  const sliderConfig = useMemo(
    () => ({
      modules: [Navigation, Pagination, Autoplay],
      spaceBetween: 0,
      slidesPerView: 1,
      autoplay: autoplayOnHover
        ? {
            delay: 3000,
            disableOnInteraction: false,
            enabled: false,
            pauseOnMouseEnter: false,
          }
        : {
            delay: 3000,
            disableOnInteraction: false,
            enabled: true,
          },
      observer: false,
      observeParents: false,
      navigation: {
        nextEl: `.${nextNavClass}`,
        prevEl: `.${prevNavClass}`,
        clickable: true,
      },
      pagination: {
        el: `.${paginationClass}`,
        clickable: true,
      },
    }),
    [autoplayOnHover, nextNavClass, prevNavClass, paginationClass],
  );

  return (
    <Swiper
      {...sliderConfig}
      onSwiper={(swiper) => onSwiperReady?.(swiper)}
      className="swiper-container slider-box-dream arrow-style-1 pagination-style-1 h-full min-h-0 w-full max-w-full"
    >
      {slideEntries.map((entry, i) => (
        <SwiperSlide key={entry.key ?? `${start}-${i}`}>
          <div className="h-full min-h-0 w-full">
            {detailHref ? (
              <Link href={detailHref} className="block h-full min-h-0">
                <img
                  src={entry.src}
                  alt=""
                  className="block h-full w-full max-w-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ) : (
              <img
                src={entry.src}
                alt=""
                className="block h-full w-full max-w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </SwiperSlide>
      ))}
      <div className={`swiper-pagination ${paginationClass}`} />
      <div className={`box-dream-next swiper-button-next ${nextNavClass}`} />
      <div className={`box-dream-prev swiper-button-prev ${prevNavClass}`} />
    </Swiper>
  );
}
