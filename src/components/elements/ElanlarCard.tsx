"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
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
 * Kart üzərində ən çox 3 şəkil; bütün fotoşəkillər elan tək səhifəsində (slug).
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
  mediaReady?: boolean;
  onSwiperReady?: (swiper: SwiperType) => void;
};

const CARD_IMAGE_LIMIT = 3;

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
  mediaReady = true,
  onSwiperReady,
}: ElanlarCardProps) {
  const uid = useId().replace(/:/g, "");
  const paginationClass = `elanlar-card-pag-${uid}`;
  const swiperRef = useRef<SwiperType | null>(null);
  const coverRef = useRef<HTMLImageElement | null>(null);
  const fromMedia = mediaReady ? imagesIn : imagesIn.length > 0 ? [imagesIn[0]!] : [];
  const images = fromMedia.slice(0, CARD_IMAGE_LIMIT);
  const hasImage = images.length > 0;
  const multi = images.length > 1;

  const [isCoverLoaded, setIsCoverLoaded] = useState(false);
  const [enableSwiper, setEnableSwiper] = useState(false);

  useEffect(() => {
    setIsCoverLoaded(false);
    setEnableSwiper(false);
  }, [images[0]]);

  useEffect(() => {
    if (!coverRef.current) return;
    if (coverRef.current.complete && coverRef.current.naturalWidth > 0) {
      setIsCoverLoaded(true);
    }
  }, [images[0]]);

  useEffect(() => {
    if (!isCoverLoaded || !multi || !mediaReady || enableSwiper) return;
    if (typeof window === "undefined") return;
    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const enable = () => setEnableSwiper(true);
    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(enable, { timeout: 800 });
    } else {
      timerId = setTimeout(enable, 80);
    }
    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, [isCoverLoaded, multi, mediaReady, enableSwiper]);

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
    >
      <div className="relative h-[312px] w-full box-border">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#e8e8ed]">
          {!hasImage ? (
            <Link
              href={href}
              className="flex h-full w-full items-center justify-center text-jh-text/35"
              aria-hidden
            >
              <ImageOff className="h-10 w-10" strokeWidth={1.25} />
            </Link>
          ) : !enableSwiper ? (
            <>
              <Link href={href} className="block h-full w-full" aria-label={title || imageAlt}>
                <img
                  ref={coverRef}
                  src={images[0]}
                  alt={imageAlt || title || ""}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    isCoverLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setIsCoverLoaded(true)}
                  onError={() => setIsCoverLoaded(true)}
                />
              </Link>
              {!isCoverLoaded ? (
                <div
                  className="pointer-events-none absolute inset-0 animate-pulse bg-[#e8e8ed]"
                  aria-hidden
                />
              ) : null}
              <ElanlarCardImageOverlays />
            </>
          ) : (
            <>
              <Swiper
                modules={[Pagination]}
                slidesPerView={1}
                spaceBetween={0}
                rewind
                pagination={{
                  el: `.${paginationClass}`,
                  clickable: true,
                }}
                onSwiper={(s) => {
                  swiperRef.current = s;
                  onSwiperReady?.(s);
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
