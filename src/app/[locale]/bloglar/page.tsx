"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { BLOG_LIST } from "@/lib/blogRoutes";
import { Link } from "@/i18n/navigation";
import { getBlogsQuery, getTagsQuery } from "@/services/client/blogs";
import {
  BlogFilterSkeletonRow,
  BlogGridSkeleton,
  BlogListPageSkeleton,
} from "@/components/blog/BlogListSkeleton";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";
import { BlogCard } from "@/components/elements/blog-card/BlogCard";

const FALLBACK_BLOG_IMAGES = [
  "/images/image-box/img-1.svg",
  "/images/image-box/img-2.svg",
  "/images/image-box/img-3.svg",
];

function BlogListFallback() {
  return <BlogListPageSkeleton />;
}

function BlogListContent() {
  const locale = useLocale();
  const t = useTranslations("blogPage");
  const tn = useTranslations("navigation");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  const tagFilters = useMemo(
    () => (activeTag ? { tagSlugs: [activeTag], page } : { page }),
    [activeTag, page],
  );

  const { data: tagsPayload, isPending: tagsPending } = useQuery(
    getTagsQuery(locale, 1),
  );
  const { data: blogsPayload, isPending: blogsPending, isError } = useQuery(
    getBlogsQuery(locale, tagFilters),
  );

  const tags = tagsPayload?.data ?? [];
  const posts = blogsPayload?.data ?? [];
  const meta = blogsPayload?.meta;

  const hrefForPage = (targetPage: number) => {
    const p = new URLSearchParams();
    if (activeTag) p.set("tag", activeTag);
    if (targetPage > 1) p.set("page", String(targetPage));
    const q = p.toString();
    return q ? `${BLOG_LIST}?${q}` : BLOG_LIST;
  };

  const pageNavBtnClass =
    "flex h-10 w-[61px] shrink-0 items-center justify-center rounded-full border border-[var(--Border)] text-[var(--Secondary)] transition-colors hover:border-[var(--Secondary)] hover:bg-[#F9F9F9]";
  const pageNumClass =
    "flex h-10 min-w-[40px] items-center justify-center rounded-full px-2 text-[15px] font-normal leading-7 text-[var(--Secondary)] transition-colors hover:bg-[#F9F9F9]";

  const tabActiveClass =
    "active border-transparent bg-black text-white";
  const tabIdleClass =
    "border-transparent bg-transparent text-[var(--Text)]";

  return (
    <>
      <FadeIn>
        <div className="flat-title relative z-20 pt-[52px] pb-[36px] ">
          <div className="themesflat-container full mx-auto w-full max-w-[1920px] px-[14px]">
            <div className="text-center">
              <h2 className="mb-[14px] text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
                {t("title")}
              </h2>
              <ul className="breadcrumbs style-1 flex flex-wrap items-center justify-center gap-[5px]">
                <li>
                  <Link href="/" className="text-[15px] leading-7 text-[var(--Text)]">
                    {tn("home")}
                  </Link>
                </li>
                <li className="text-[15px] leading-7 text-[var(--Text)]">/</li>
                <li className="text-[15px] leading-7 text-[var(--Text)]">{t("title")}</li>
              </ul>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="blog-list-api-wrap px-5">
        <FadeIn>
          <div className="widget-tabs style-1">
          <div className="themesflat-container mx-auto mb-10 w-full max-w-[1428px] px-[14px]">
            {tagsPending ? (
              <BlogFilterSkeletonRow />
            ) : (
              <ul className="widget-menu-tab flex flex-wrap justify-center gap-x-2 gap-y-2">
                <li
                  className={`item-title rounded-full border px-0.5 py-0.5 transition-colors ${!activeTag ? tabActiveClass : tabIdleClass}`}
                >
                  <Link
                    href={BLOG_LIST}
                    className="blog-filter-tab-link block px-3 py-1.5 text-inherit sm:px-3.5"
                  >
                    <span className="inner text-[13px] font-medium leading-5 text-inherit sm:text-sm">
                      {tc("all")}
                    </span>
                  </Link>
                </li>
                {tags.map((tag) => (
                  <li
                    key={tag.slug}
                    className={`item-title rounded-full border px-0.5 py-0.5 transition-colors ${activeTag === tag.slug ? tabActiveClass : tabIdleClass}`}
                  >
                    <Link
                      href={`${BLOG_LIST}?tag=${encodeURIComponent(tag.slug)}`}
                      className="blog-filter-tab-link block px-3 py-1.5 text-inherit sm:px-3.5"
                    >
                      <span className="inner text-[13px] font-medium leading-5 text-inherit sm:text-sm">
                        {tag.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        </FadeIn>

        <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px] mb-30">
          <FadeInStagger className="grid grid-cols-1 gap-[29px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
            {blogsPending ? <BlogGridSkeleton /> : null}
            {isError ? (
              <div className="col-span-full text-[var(--Text)]">
                <p>{t("loadError")}</p>
              </div>
            ) : null}
            {!blogsPending &&
              !isError &&
              posts.map((post, i) => (
                <FadeInStaggerItem key={post.slug} className="min-w-0">
                  <BlogCard
                    post={post}
                    imageSrc={
                      post.thumb_image ||
                      post.image ||
                      FALLBACK_BLOG_IMAGES[i % FALLBACK_BLOG_IMAGES.length]
                    }
                  />
                </FadeInStaggerItem>
              ))}
            {!blogsPending && !isError && posts.length === 0 ? (
              <div className="col-span-full text-[var(--Text)]">
                <p>{t("emptyFilter")}</p>
              </div>
            ) : null}
            {meta && meta.last_page > 1 ? (
              <div className="col-span-full">
                <ul className="wg-pagination flex flex-wrap items-center justify-center gap-2.5">
                  <li className="mr-2.5 list-none">
                    {meta.current_page > 1 ? (
                      <Link href={hrefForPage(meta.current_page - 1)} className={pageNavBtnClass}>
                        <ChevronLeft className="h-6 w-6" strokeWidth={2} />
                      </Link>
                    ) : (
                      <span
                        className={`${pageNavBtnClass} opacity-40`}
                        aria-disabled="true"
                      >
                        <ChevronLeft className="h-6 w-6" strokeWidth={2} />
                      </span>
                    )}
                  </li>
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                    <li key={n} className="list-none">
                      <Link
                        href={hrefForPage(n)}
                        className={`${pageNumClass} ${n === meta.current_page ? "bg-[var(--Secondary)] !text-[var(--White)] hover:bg-[var(--Secondary)]" : ""}`}
                      >
                        {n}
                      </Link>
                    </li>
                  ))}
                  <li className="ml-2.5 list-none">
                    {meta.current_page < meta.last_page ? (
                      <Link href={hrefForPage(meta.current_page + 1)} className={pageNavBtnClass}>
                        <ChevronRight className="h-6 w-6" strokeWidth={2} />
                      </Link>
                    ) : (
                      <span
                        className={`${pageNavBtnClass} opacity-40`}
                        aria-disabled="true"
                      >
                        <ChevronRight className="h-6 w-6" strokeWidth={2} />
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            ) : null}
          </FadeInStagger>
        </div>
      </div>
    </>
  );
}

export default function BlogListPage() {
  return (
    <Layout
      headerStyle={12}
      mainContentCls="px-[14px] sm:px-8 md:px-12 lg:px-20 default"
    >
      <Suspense fallback={<BlogListFallback />}>
        <BlogListContent />
      </Suspense>
    </Layout>
  );
}
