"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import {
  Bath,
  BedDouble,
  Building2,
  CalendarArrowDown,
  CalendarArrowUp,
  Check,
  ImageOff,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { FreeMode, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

import { useTranslations } from "next-intl";
import Layout from "@/components/layout/Layout";
import ElanlarCard from "@/components/elements/ElanlarCard";
import { ElanlarCardNavArrows } from "@/components/elements/elanlar-card/ElanlarCardNavArrows";
import { announcementCardImages } from "@/components/elanlar/announcementCardImages";
import { Link } from "@/i18n/navigation";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";
import type { ResolvedAnnouncement } from "@/lib/announcement-server";
import { publicStorageUrl } from "@/services/client/properties";
import type {
  PublicAnnouncementAttribute,
  PublicAnnouncementItem,
} from "@/services/client/properties/api";

import "@/styles/property-single-v5.css";

const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2643.6895046810805!2d-122.52642526124438!3d38.00014098339506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085976736097a2f%3A0xbe014d20e6e22654!2sSan+Rafael%2C+California%2C+Hoa+K%E1%BB%B3!5e0!3m2!1svi!2s!4v1678975266976!5m2!1svi!2s";

function groupAttributesForFeatures(attributes: PublicAnnouncementAttribute[] | undefined) {
  const groups: Record<number, PublicAnnouncementAttribute[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const a of attributes ?? []) {
    const pid = groups[a.parent_id] !== undefined ? a.parent_id : 4;
    groups[pid].push(a);
  }
  return groups;
}

function extractMapEmbedSrc(mapValue: string | null | undefined): string {
  if (!mapValue) return "";
  let raw = String(mapValue).trim();
  if (!raw) return "";
  raw = raw
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
  if (!raw.includes("<")) {
    return /^https?:\/\//i.test(raw) ? raw : "";
  }
  const m = raw.match(/src\s*=\s*["']([^"']+)["']/i);
  const src = m?.[1] ? m[1].trim() : "";
  return /^https?:\/\//i.test(src) ? src : "";
}

function extractVideoEmbedSrc(videoValue: string | null | undefined): string {
  if (!videoValue) return "";
  let raw = String(videoValue).trim();
  if (!raw) return "";
  raw = raw
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
  if (raw.includes("<")) {
    const m = raw.match(/src\s*=\s*["']([^"']+)["']/i);
    const src = m?.[1] ? m[1].trim() : "";
    return /^https?:\/\//i.test(src) ? src : "";
  }
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      if (u.pathname.startsWith("/embed/")) return raw;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\/+/, "").split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    return raw;
  } catch {
    return "";
  }
}

function attributeIconSrc(icon: string | null | undefined): string | null {
  if (!icon) return null;
  const raw = String(icon).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return publicStorageUrl(raw) || null;
}

const TAB_KEYS = [
  "tabDescription",
  "tabAddress",
  "tabDetails",
  "tabFeatures",
  "tabVideo",
  "tabMaps",
] as const;

export type PropertySingleV5Props = {
  announcement: ResolvedAnnouncement;
  similarHomes: PublicAnnouncementItem[];
};

export default function PropertySingleV5({ announcement, similarHomes }: PropertySingleV5Props) {
  const t = useTranslations("propertySingle");
  const tc = useTranslations("common");
  const tl = useTranslations("listings");
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  function featureGroupTitle(pid: number) {
    if (pid === 1) return t("featureInterior");
    if (pid === 2) return t("featureOutdoor");
    if (pid === 3) return t("featureUtilities");
    return t("featureOther");
  }

  const title = announcement.title ?? "";
  const detail = announcement.detail;
  const address = announcement.address;
  const category = announcement.category;
  const media = announcement.media;
  const user = announcement.user;
  const checkIn = announcement.check_in;
  const checkOut = announcement.check_out;
  const attrGroups = useMemo(
    () => groupAttributesForFeatures(announcement.attributes),
    [announcement.attributes],
  );

  const { mainSlides, thumbSlides } = useMemo(() => {
    const coverPath = media?.cover_image?.trim();
    const galleryPaths = media?.gallery ?? [];

    type Slot = { full: string; thumb?: string | null };
    const slots: Slot[] = [];

    if (coverPath) {
      slots.push({ full: coverPath, thumb: media?.cover_image_thumb ?? null });
    }

    let gi = 0;
    for (const g of galleryPaths) {
      if (!g?.trim()) continue;
      const p = g.trim();
      if (coverPath && p === coverPath) continue;
      slots.push({ full: p, thumb: media?.thumb_gallery?.[gi] ?? null });
      gi += 1;
    }

    const main = slots
      .map((s) => publicStorageUrl(s.full))
      .filter((u): u is string => u != null && u !== "");

    if (main.length === 0) {
      return { mainSlides: [] as string[], thumbSlides: [] as string[] };
    }

    const thumbs = slots.map((s, i) => {
      const thumbResolved =
        s.thumb != null && String(s.thumb).trim() !== "" ? publicStorageUrl(String(s.thumb).trim()) : null;
      return thumbResolved && thumbResolved !== "" ? thumbResolved : main[i]!;
    });

    return { mainSlides: main, thumbSlides: thumbs };
  }, [media]);

  const agentDisplayUrl = useMemo(() => {
    const raw = user?.image && String(user.image).trim() !== "" ? String(user.image).trim() : null;
    if (!raw) return null;
    const u = publicStorageUrl(raw);
    return u && u !== "" ? u : null;
  }, [user?.image]);

  const locationLine = [address?.street].filter(Boolean).join(", ") || tc("dash");

  const phoneDigits = user?.mobile ? String(user.mobile).replace(/\D/g, "") : "";
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}` : "/#";
  const telHref = user?.mobile ? `tel:${String(user.mobile).replace(/\s/g, "")}` : "/#";

  const mapSrcFromApi = extractMapEmbedSrc(address?.map);
  const mapEmbedSrc = mapSrcFromApi || DEFAULT_MAP_EMBED;
  const videoSource =
    (announcement.video_youtube_url && String(announcement.video_youtube_url).trim()) ||
    (media?.link && String(media.link).trim()) ||
    "";
  const videoEmbedSrc = extractVideoEmbedSrc(videoSource);

  return (
    <>
      <Layout headerStyle={12} mainContentCls="px-5">
        <div className="property-single-wrap v5 pb-16 pt-6">
          <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
            <div className="w-full px-[14px]">
              <FadeIn>
                <div className="flex flex-wrap items-center justify-start gap-[30px] py-[30px]">
                <ul className="breadcrumbs style-1 justify-start">
                  <li>
                    <Link href="/">{t("breadcrumbHome")}</Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/elanlar">{t("breadcrumbListings")}</Link>
                  </li>
                  <li>/</li>
                  <li>{title}</li>
                </ul>
                </div>
              </FadeIn>
            </div>

            <div className="w-full px-[14px]">
              <FadeIn delay={0.05}>
              <div className="head-title">
                <div>
                  <h3>{title}</h3>
                  <div className="location">
                    <MapPin className="h-5 w-5 shrink-0 text-[var(--Text)]" strokeWidth={1.75} />
                    <div className="text-content">{locationLine}</div>
                  </div>
                </div>
                <div>
                  <div className="square">{t("priceLabel")}</div>
                  <div className="price">
                    {" "}
                    {announcement.price ?? tc("dash")} ₼
                  </div>
                </div>
              </div>
              </FadeIn>
            </div>

            <div className="w-full px-[14px]">
              <FadeIn delay={0.08}>
              <div className="thumbs-slider-column v5-thumbs">
                {mainSlides.length > 0 ? (
                  <>
                    <div className="slider-thumbs-gallery-2 relative group min-h-[280px] flex-1 min-w-0 overflow-hidden rounded-2xl md:min-h-[400px]">
                      <Swiper
                        modules={[FreeMode, Thumbs]}
                        spaceBetween={0}
                        thumbs={{
                          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                        }}
                        className="m-0! h-full max-h-[650px] min-h-[280px] w-full shrink-0 md:min-h-[400px]"
                        onSwiper={(s) => {
                          mainSwiperRef.current = s;
                        }}
                      >
                        {mainSlides.map((src, idx) => (
                          <SwiperSlide key={`main-${idx}`}>
                            <div className="relative h-full min-h-[280px] md:min-h-[400px]">
                              <div className="list-tags type-1">
                                <span className="tags-item for-sell">{t("tagListing")}</span>
                                <span className="tags-item featured">{t("tagFeatured")}</span>
                              </div>
                              <img src={src} alt="" className="h-full w-full object-cover" />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {mainSlides.length > 1 ? (
                        <ElanlarCardNavArrows
                          large
                          prevLabel={t("galleryPrev")}
                          nextLabel={t("galleryNext")}
                          onPrev={() => mainSwiperRef.current?.slidePrev()}
                          onNext={() => mainSwiperRef.current?.slideNext()}
                        />
                      ) : null}
                    </div>

                    <Swiper
                      modules={[FreeMode, Thumbs]}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={2}
                      direction="vertical"
                      freeMode
                      watchSlidesProgress
                      breakpoints={{
                        450: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        868: { slidesPerView: 5 },
                        1400: { slidesPerView: 6 },
                      }}
                      className="slider-thumbs-gallery-1"
                    >
                      {thumbSlides.map((src, idx) => (
                        <SwiperSlide key={`thumb-${idx}`}>
                          <img src={src} alt="" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </>
                ) : (
                  <div
                    className="flex w-full min-h-[280px] items-center justify-center bg-[#f0f0f0] md:min-h-[400px]"
                    aria-hidden
                  >
                    <ImageOff className="h-16 w-16 text-[var(--Text)]/30" strokeWidth={1.25} />
                  </div>
                )}
              </div>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
              <FadeIn className="xl:col-span-8">
                <div className="content-wrap">
                  <div className="overview">
                    <h4>{t("overviewTitle")}</h4>
                    <div className="box-items">
                      <div className="item">
                        <Building2 className="h-5 w-5 shrink-0 text-[var(--Secondary)]" strokeWidth={1.75} />
                        <div className="text-content">
                          {category?.name ??
                            (detail?.room != null ? t("roomsCount", { count: detail.room }) : tc("dash"))}
                        </div>
                      </div>
                      <div className="item">
                        <CalendarArrowUp className="h-5 w-5 shrink-0 text-[var(--Secondary)]" strokeWidth={1.75} />
                        <div className="text-content">
                          {t("checkInLabel")} {checkIn ? `${checkIn}` : tc("dash")}
                        </div>
                      </div>
                      <div className="item">
                        <CalendarArrowDown className="h-5 w-5 shrink-0 text-[var(--Secondary)]" strokeWidth={1.75} />
                        <div className="text-content">
                          {t("checkOutLabel")} {checkOut ? `${checkOut}` : tc("dash")}
                        </div>
                      </div>
                      <div className="item">
                        <LayoutGrid className="h-5 w-5 shrink-0 text-[var(--Secondary)]" strokeWidth={1.75} />
                        <div className="text-content">
                          {detail?.guest != null
                            ? t("guestsCount", { count: detail.guest })
                            : tc("dash")}
                        </div>
                      </div>
                      <div className="item">
                        <BedDouble className="h-5 w-5 shrink-0 text-[var(--Secondary)]" strokeWidth={1.75} />
                        <div className="text-content">
                          {detail?.bedroom != null
                            ? t("bedroomsCount", { count: detail.bedroom })
                            : tc("dash")}
                        </div>
                      </div>
                      <div className="item">
                        <Bath className="h-5 w-5 shrink-0 text-[var(--Secondary)]" strokeWidth={1.75} />
                        <div className="text-content">
                          {detail?.bathroom != null
                            ? t("bathroomsCount", { count: detail.bathroom })
                            : tc("dash")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="widget-tabs style-2">
                    <ul className="widget-menu-tab" role="tablist">
                      {TAB_KEYS.map((key, i) => (
                        <li
                          key={key}
                          className={`item-title ${activeTab === i ? "active" : ""}`}
                          role="presentation"
                        >
                          <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === i}
                            className="inner m-0 cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit"
                            onClick={() => setActiveTab(i)}
                          >
                            {t(key)}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="widget-content-tab">
                      <div className="widget-content-inner" role="tabpanel" hidden={activeTab !== 0}>
                        <div className="desc">
                          <h4>{t("tabDescription")}</h4>
                          <p>
                            {(announcement.description ?? tc("dash")).split(/\r?\n/).map((line, i, arr) => (
                              <Fragment key={i}>
                                {line}
                                {i < arr.length - 1 ? <br /> : null}
                              </Fragment>
                            ))}
                          </p>
                        </div>
                      </div>
                      <div className="widget-content-inner" role="tabpanel" hidden={activeTab !== 1}>
                        <div className="address">
                          <div className="mb-8 flex flex-wrap items-center justify-between gap-[30px]">
                            <h4 className="mb-0">{t("tabAddress")}</h4>
                            <Link
                              href={
                                locationLine !== tc("dash")
                                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLine)}`
                                  : "/#"
                              }
                              className="tf-button-green"
                            >
                              <MapPin className="h-4 w-4" strokeWidth={1.75} />
                              {t("openInGoogleMaps")}
                            </Link>
                          </div>
                          <div className="list-item">
                            <div className="item gap20">
                              <div className="text">{t("addrField")}</div>
                              <p>{address?.street ?? tc("dash")}</p>
                            </div>
                            <div className="item">
                              <div className="text">{t("cityField")}</div>
                              <p>{address?.region_name ?? tc("dash")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-inner" role="tabpanel" hidden={activeTab !== 2}>
                        <div className="details">
                          <h4>{t("tabDetails")}</h4>
                          <div className="list-item">
                            <div className="item">
                              <div className="text">{t("detailPrice")}</div>
                              <p>{announcement.price ?? tc("dash")}</p>
                            </div>
                            <div className="item">
                              <div className="text">{t("detailSize")}</div>
                              <p>
                                {detail?.room != null
                                  ? t("roomsCount", { count: detail.room })
                                  : tc("dash")}
                              </p>
                            </div>
                            <div className="item">
                              <div className="text">{t("detailBedrooms")}</div>
                              <p>{detail?.bedroom ?? tc("dash")}</p>
                            </div>
                            <div className="item">
                              <div className="text">{t("detailType")}</div>
                              <p>{category?.name ?? tc("dash")}</p>
                            </div>
                            <div className="item">
                              <div className="text">{t("detailBathrooms")}</div>
                              <p>{detail?.bathroom ?? tc("dash")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-inner" role="tabpanel" hidden={activeTab !== 3}>
                        <div className="features">
                          <h4>{t("featuresHeading")}</h4>
                          <p className="mb-8 text-[var(--Text)]">{t("featuresBlurb")}</p>
                          <ul className="list-none p-0">
                            {([1, 2, 3, 4] as const).map((pid) => (
                              <li key={pid}>
                                <h5 className="mb-2.5 text-[17px] font-bold text-[var(--Secondary)]">
                                  {featureGroupTitle(pid)}
                                </h5>
                                <div className="wrap-check-ellipse mb-8">
                                  {(attrGroups[pid] ?? []).map((attr) => {
                                    const iconUrl = attributeIconSrc(attr.icon);
                                    return (
                                      <div key={attr.id} className="check-ellipse-item">
                                        <div className="icon">
                                          {iconUrl ? (
                                            <img
                                              src={iconUrl}
                                              alt=""
                                              width={20}
                                              height={20}
                                              className="object-contain"
                                            />
                                          ) : (
                                            <Check className="h-3 w-3 text-[var(--Secondary)]" strokeWidth={3} />
                                          )}
                                        </div>
                                        <p>{attr.name}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="widget-content-inner" role="tabpanel" hidden={activeTab !== 4}>
                        <div className="video">
                          <h4>{t("tabVideo")}</h4>
                          <div className="video-wrap">
                            {videoEmbedSrc ? (
                              <iframe
                                src={videoEmbedSrc}
                                height={530}
                                className="block w-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={t("videoIframeTitle")}
                              />
                            ) : (
                              <p className="text-[var(--Text)]">{t("videoNo")}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="widget-content-inner" role="tabpanel" hidden={activeTab !== 5}>
                        <div className="map">
                          <h4>{t("tabMaps")}</h4>
                          <iframe
                            src={mapEmbedSrc}
                            height={400}
                            className="w-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={t("mapIframeTitle")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn className="xl:col-span-4 max-h-[500px] overflow-y-auto" delay={0.06}>
                <div className="property-single-sidebar">
                  <div className="sidebar-item sidebar-contact-info">
                    <div className="sidebar-title">{t("contactTitle")}</div>
                    <div className="contact-info">
                      <div className="person">
                        <div className="image-group relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
                          {agentDisplayUrl ? (
                            <img src={agentDisplayUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div
                              className="flex h-full w-full items-center justify-center bg-[#e8e8e8] text-[var(--Text)]/40"
                              aria-hidden
                            >
                              <User className="h-10 w-10" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className="content">
                          <div className="name">
                            <Link href="/#">{user?.name ?? tc("dash")}</Link>
                          </div>
                          <p>{user?.email ?? tc("dash")}</p>
                          <p>{user?.mobile ?? tc("dash")}</p>
                        </div>
                      </div>
                      <form className="form-comment">
                        <div className="flex gap20">
                          <Link href={telHref} className="tf-button-primary style-bg-white w-full">
                            {t("callCta")}
                            <Phone className="h-[18px] w-[18px]" strokeWidth={1.75} />
                          </Link>
                          <Link href={whatsappHref} className="tf-button-primary style-bg-white w-full">
                            {t("whatsappCta")}
                            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="">
              <FadeIn className="xl:col-span-8">
            <div className="smilar-homes mt-16 w-full flex flex-col gap-6 justify-center items-center">
                    <h4 className="mb-6 text-center text-5xl font-bold">{t("similarHomes")}</h4>
                    <FadeInStagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {similarHomes.map((row) => {
                        const d = row.detail;
                        const imgs = announcementCardImages(row.media);
                        const href = `/elanlar/${row.slug}`;
                        return (
                          <FadeInStaggerItem key={row.id} className="min-w-0 flex justify-center">
                            <ElanlarCard
                              href={href}
                              title={row.title ?? ""}
                              imageAlt={row.title ?? ""}
                              priceLine={
                                row.price ? tl("priceAzn", { price: row.price }) : tc("dash")
                              }
                              address={row.address?.street || tc("dash")}
                              beds={d?.bedroom ?? null}
                              baths={d?.bathroom ?? null}
                              rooms={d?.room ?? null}
                              emptyLabel={tc("dash")}
                              images={imgs}
                              mediaReady
                              className="w-full max-w-full"
                            />
                          </FadeInStaggerItem>
                        );
                      })}
                    </FadeInStagger>
                  </div>
                  </FadeIn>
                
                </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
