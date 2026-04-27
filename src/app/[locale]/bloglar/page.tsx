"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { BLOG_LIST, blogPostPath } from "@/lib/blogRoutes";
import { Link, useRouter } from "@/i18n/navigation";
import { getBlogsQuery, getTagsQuery } from "@/services/client/blogs";
import {
  BlogFilterSkeletonRow,
  BlogGridSkeleton,
  BlogListPageSkeleton,
} from "@/components/blog/BlogListSkeleton";

function BlogListFallback() {
  return <BlogListPageSkeleton />;
}

function BlogListContent() {
  const locale = useLocale();
  const t = useTranslations("blogPage");
  const tn = useTranslations("navigation");
  const tc = useTranslations("common");
  const router = useRouter();
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

  return (
    <>
      <div className="flat-title relative z-20 pt-[90px] pb-[94px]">
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

      <div className="blog-list-api-wrap px-5">
        <div className="widget-tabs style-1">
          <div className="themesflat-container mx-auto mb-[30px] w-full max-w-[1428px] px-[14px]">
            {tagsPending ? (
              <BlogFilterSkeletonRow />
            ) : (
              <ul className="widget-menu-tab flex flex-wrap justify-center gap-x-4 gap-y-3">
                <li
                  className={`item-title rounded-[41px] border border-transparent px-[7px] py-[5px] transition-colors ${!activeTag ? "active border-[var(--Secondary)] bg-[var(--jh-cream)]" : ""}`}
                >
                  <Link href={BLOG_LIST} className="blog-filter-tab-link block py-2.5 px-5">
                    <span className="inner text-base font-medium leading-[19px] text-[var(--Text)]">
                      {tc("all")}
                    </span>
                  </Link>
                </li>
                {tags.map((tag) => (
                  <li
                    key={tag.slug}
                    className={`item-title rounded-[41px] border border-transparent px-[7px] py-[5px] transition-colors ${activeTag === tag.slug ? "active border-[var(--Secondary)] bg-[var(--jh-cream)]" : ""}`}
                  >
                    <Link
                      href={`${BLOG_LIST}?tag=${encodeURIComponent(tag.slug)}`}
                      className="blog-filter-tab-link block py-2.5 px-5"
                    >
                      <span className="inner text-base font-medium leading-[19px] text-[var(--Text)]">
                        {tag.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
          <div className="grid grid-cols-1 gap-[29px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {blogsPending ? <BlogGridSkeleton /> : null}
            {isError ? (
              <div className="col-span-full text-[var(--Text)]">
                <p>{t("loadError")}</p>
              </div>
            ) : null}
            {!blogsPending &&
              !isError &&
              posts.map((post) => (
                <div key={post.slug}>
                  <div
                    className="group wg-blog mb-0 flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-[0px_6px_15px_0px_#404F680D]"
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(blogPostPath(post.slug))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(blogPostPath(post.slug));
                      }
                    }}
                  >
                    <div className="image h-[200px] shrink-0 overflow-hidden">
                      <img
                        src={post.thumb_image || post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="content flex flex-1 flex-col rounded-b-2xl border border-[var(--Border)] border-t-0 bg-[var(--White)] px-[25px] pt-[22px] pb-[30px] text-center">
                      <div className="sub-blog mb-[13px] flex flex-wrap items-center justify-center gap-6">
                        <div className="relative text-[15px] font-normal leading-7 text-[var(--Text)] after:absolute after:-right-3.5 after:top-1/2 after:h-1 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-[var(--Text)] last:after:hidden">
                          {post.tags?.[0]?.name ?? tc("blogFallbackTag")}
                        </div>
                        <div className="date text-[15px] font-normal leading-7 text-[var(--Text)]">
                          {post.created_at ?? tc("dash")}
                        </div>
                      </div>
                      <div className="name mb-[14px] min-h-[56px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                        <Link
                          href={blogPostPath(post.slug)}
                          className="line-clamp-2 text-[var(--Secondary)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.title}
                        </Link>
                      </div>
                      <Link
                        href={blogPostPath(post.slug)}
                        className="tf-button-no-bg mx-auto mt-auto inline-flex items-center gap-2.5 text-[15px] font-medium leading-[18px] text-[var(--Secondary)] transition-colors hover:text-[var(--Primary)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("readMore")}
                        <ChevronRight className="h-[18px] w-[18px]" strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                </div>
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
          </div>
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
