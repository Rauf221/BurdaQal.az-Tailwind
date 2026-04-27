"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "@/i18n/navigation";
import { blogPostPath } from "@/lib/blogRoutes";
import { getBlogsQuery } from "@/services/client/blogs/queries";

const sliderNews = {
  spaceBetween: 28,
  slidesPerView: 4,
  observer: true,
  observeParents: true,
  breakpoints: {
    0: { slidesPerView: 1 },
    600: { slidesPerView: 2 },
    1400: { slidesPerView: 4 },
  },
};

const FALLBACK_BLOG_IMAGES = [
  "/images/image-box/img-1.svg",
  "/images/image-box/img-2.svg",
  "/images/image-box/img-3.svg",
];

export default function SliderNewsHome() {
  const locale = useLocale();
  const t = useTranslations("sliderNewsHome");
  const tc = useTranslations("common");
  const { data: blogsPayload, isPending, isError } = useQuery(
    getBlogsQuery(locale, { page: 1 })
  );
  const latestBlogs = (blogsPayload?.data ?? []).slice(0, 4);

  return (
    <Swiper {...sliderNews}>
      {isPending ? (
        <SwiperSlide>
          <div className="wg-blog mb-0 overflow-hidden rounded-2xl transition-shadow hover:shadow-[0px_6px_15px_0px_#404F680D]">
            <div className="content has-border rounded-b-2xl border border-[var(--Border)] border-t-0 bg-[var(--White)] px-6 pb-8 pt-6 text-center">
              <p className="mb-0 py-12 text-[var(--Text)]">{tc("ellipsis")}</p>
            </div>
          </div>
        </SwiperSlide>
      ) : null}
      {!isPending &&
        !isError &&
        latestBlogs.length > 0 &&
        latestBlogs.map((post, i) => (
          <SwiperSlide key={post.slug}>
            <div className="wg-blog mb-0 flex h-full flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-[0px_6px_15px_0px_#404F680D]">
              <div className="image h-[225px] overflow-hidden">
                <img
                  src={
                    post.thumb_image ||
                    post.image ||
                    FALLBACK_BLOG_IMAGES[i % FALLBACK_BLOG_IMAGES.length]
                  }
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="content has-border flex flex-1 flex-col rounded-b-2xl border border-[var(--Border)] border-t-0 bg-[var(--White)] px-6 pb-8 pt-6 text-center">
                <div className="sub-blog mb-3 flex flex-wrap items-center justify-center gap-6">
                  <div className="relative text-[15px] leading-7 text-[var(--Text)] after:absolute after:-right-3.5 after:top-1/2 after:h-1 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-[var(--Text)] last:after:hidden">
                    {post.tags?.[0]?.name ?? tc("blogFallbackTag")}
                  </div>
                  <div className="text-[15px] leading-7 text-[var(--Text)]">
                    {post.created_at ?? tc("dash")}
                  </div>
                </div>
                <div className="name mb-6 min-h-[56px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                  <Link
                    href={blogPostPath(post.slug)}
                    className="line-clamp-2 text-[var(--Secondary)] hover:underline"
                  >
                    {post.title}
                  </Link>
                </div>
                <Link
                  href={blogPostPath(post.slug)}
                  className="tf-button-no-bg mx-auto mt-auto inline-flex items-center gap-2 text-[15px] font-medium leading-[18px] text-[var(--Secondary)] hover:text-[var(--Primary)]"
                >
                  {t("readMore")}
                  <ArrowRight className="h-[18px] w-[18px]" />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      {!isPending && isError ? (
        <SwiperSlide>
          <div className="wg-blog rounded-2xl border border-[var(--Border)] bg-[var(--White)] p-8 text-center text-sm text-[var(--Text)]">
            {t("loadError")}
          </div>
        </SwiperSlide>
      ) : null}
      {!isPending && !isError && latestBlogs.length === 0 ? (
        <SwiperSlide>
          <div className="wg-blog rounded-2xl border border-[var(--Border)] bg-[var(--White)] p-8 text-center text-sm text-[var(--Text)]">
            {t("empty")}
          </div>
        </SwiperSlide>
      ) : null}
    </Swiper>
  );
}
