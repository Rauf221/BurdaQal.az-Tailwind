"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BlogCard } from "@/components/elements/blog-card/BlogCard";
import { BLOG_LIST } from "@/lib/blogRoutes";
import { getBlogsQuery } from "@/services/client/blogs/queries";

const FALLBACK_BLOG_IMAGES = [
  "/images/image-box/img-1.svg",
  "/images/image-box/img-2.svg",
  "/images/image-box/img-3.svg",
];

export default function SliderNewsHome() {
  const locale = useLocale();
  const tf = useTranslations("flatNewsHome");
  const t = useTranslations("sliderNewsHome");
  const { data: blogsPayload, isPending, isError } = useQuery(
    getBlogsQuery(locale, { page: 1 }),
  );
  const latestBlogs = (blogsPayload?.data ?? []).slice(0, 3);

  return (
    <>
      {isPending ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="h-[318px] animate-pulse rounded-2xl bg-[#dfe1e4]" aria-hidden />
              <div className="flex flex-col gap-3 px-2">
                <div className="flex gap-2">
                  <div className="h-5 w-24 animate-pulse rounded bg-[#dfe1e4]" />
                  <div className="h-5 w-32 animate-pulse rounded bg-[#dfe1e4]" />
                </div>
                <div className="h-14 w-full animate-pulse rounded bg-[#dfe1e4]" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isPending && !isError && latestBlogs.length > 0 ? (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {latestBlogs.map((post, i) => {
              const thumb =
                post.thumb_image ||
                post.image ||
                FALLBACK_BLOG_IMAGES[i % FALLBACK_BLOG_IMAGES.length];
              return (
                <BlogCard key={post.slug} post={post} imageSrc={thumb} />
              );
            })}
          </div>
          <div className="flex justify-center">
            <Link
              href={BLOG_LIST}
              className="inline-flex items-center gap-2 text-[16px] font-medium leading-normal text-[#525658] transition-colors hover:text-[var(--Primary)]"
            >
              {tf("seeMore")}
              <ChevronRight className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </div>
      ) : null}

      {!isPending && isError ? (
        <p className="rounded-2xl border border-[var(--Border)] bg-[var(--White)] px-6 py-8 text-center text-sm text-[var(--Text)]">
          {t("loadError")}
        </p>
      ) : null}

      {!isPending && !isError && latestBlogs.length === 0 ? (
        <p className="rounded-2xl border border-[var(--Border)] bg-[var(--White)] px-6 py-8 text-center text-sm text-[var(--Text)]">
          {t("empty")}
        </p>
      ) : null}
    </>
  );
}
