"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { BLOG_LIST, blogPostPath } from "@/lib/blogRoutes";
import { Link } from "@/i18n/navigation";
import { getBlogRelatedQuery, getBlogShowQuery } from "@/services/client/blogs";
import BlogSingleSkeleton from "@/components/blog/BlogSingleSkeleton";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";

const apiBodyCls =
  "blog-api-body text-[17px] font-normal leading-7 text-[var(--Text)] [&_a]:text-[var(--Third)] hover:[&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--Secondary)] [&_blockquote]:bg-[#F9F9F9] [&_blockquote]:py-4 [&_blockquote]:pl-6 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-[var(--Secondary)] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--Secondary)] [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

export default function BlogSingle({ slug }: { slug: string }) {
  const locale = useLocale();
  const { data: showRes, isPending: loadingShow, isError: errShow } = useQuery(
    getBlogShowQuery(slug, locale),
  );
  const { data: relatedRes } = useQuery(getBlogRelatedQuery(slug, locale));

  const post = showRes?.data;
  const related = (relatedRes?.data ?? []).filter((p) => p.slug !== slug);

  if (loadingShow && !post) {
    return (
      <Layout headerStyle={12} mainContentCls="p-5">
        <BlogSingleSkeleton />
      </Layout>
    );
  }

  if (errShow || !post) {
    return (
      <Layout headerStyle={12} mainContentCls="p-5">
        <div className="themesflat-container mx-auto max-w-[1428px] px-[14px] py-5">
          <h2 className="text-2xl font-semibold text-[var(--Secondary)]">Blog tapılmadı</h2>
          <p className="mt-2 text-[var(--Text)]">
            <Link href={BLOG_LIST} className="text-[var(--Third)] hover:underline">
              Blog siyahısına qayıt
            </Link>
          </p>
        </div>
      </Layout>
    );
  }

  const descriptionIsHtml = /<[a-z][\s\S]*>/i.test(post.description);

  return (
    <Layout headerStyle={12} mainContentCls="p-5">
      <div className="blog-single-wrap">
        <FadeIn>
          <div className="image-head mx-auto mb-10 w-full px-5 max-[991px]:px-0">
            <img
              src={post.image || post.thumb_image}
              alt={post.title}
              className="mx-auto block max-h-[700px] w-full rounded-3xl object-cover object-center max-[991px]:rounded-none"
            />
          </div>
        </FadeIn>
        <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
          <div className="mx-auto max-w-[920px]">
            <FadeIn delay={0.06} className="blog-single-inner mb-[200px] flex flex-col gap-[51px]">
              <ul className="breadcrumbs style-1 mb-5 flex flex-wrap items-center justify-start gap-[5px]">
                <li>
                  <Link href="/" className="text-[15px] leading-7 text-[var(--Text)] hover:underline">
                    Home
                  </Link>
                </li>
                <li className="text-[15px] leading-7 text-[var(--Text)]">/</li>
                <li>
                  <Link
                    href={BLOG_LIST}
                    className="text-[15px] leading-7 text-[var(--Text)] hover:underline"
                  >
                    Blog
                  </Link>
                </li>
                <li className="text-[15px] leading-7 text-[var(--Text)]">/</li>
                <li className="text-[15px] leading-7 text-[var(--Text)]">{post.title}</li>
              </ul>
              <div>
                <h2 className="mb-3 text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
                  {post.title}
                </h2>
                <div className="sub-blog style-color flex flex-wrap items-center justify-start gap-6 text-[15px] leading-7 text-[var(--Fourth)]">
                  <div aria-hidden className="min-h-[1em]">
                    &nbsp;
                  </div>
                </div>
              </div>
              <div className="mt-[13px]">
                {descriptionIsHtml ? (
                  <div
                    className={apiBodyCls}
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-[17px] leading-7 text-[var(--Text)]">
                    {post.description}
                  </p>
                )}
              </div>
              {post.tags && post.tags.length > 0 ? (
                <div className="bottom mt-5">
                  <ul className="tags flex flex-wrap gap-2.5">
                    {post.tags.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`${BLOG_LIST}?tag=${encodeURIComponent(t.slug)}`}
                          className="flex h-[41px] items-center justify-center rounded-lg bg-[#F9F9F9] px-5 text-[15px] font-normal leading-7 text-[var(--Secondary)] hover:bg-[#ececec]"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </FadeIn>
          </div>
        </div>
        {related.length > 0 ? (
          <FadeIn className="wg-related-posts rounded-3xl bg-[#F9F9F9] px-[14px] pb-[171px] pt-[191px]">
            <div className="themesflat-container mx-auto w-full max-w-[1428px]">
              <div className="heading-section mb-9 text-center min-[992px]:mb-[46px]">
                <h2 className="-mt-2 mb-4 text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
                  Related Posts
                </h2>
                <div className="text text-[17px] font-normal leading-5 text-[var(--Text)]">
                  Oxşar yazılar
                </div>
              </div>
              <FadeInStagger className="grid grid-cols-1 gap-[29px] md:grid-cols-2 xl:grid-cols-4">
                {related.slice(0, 4).map((item) => (
                  <FadeInStaggerItem key={item.slug} className="min-w-0">
                    <div className="wg-blog flex h-full flex-col overflow-hidden rounded-2xl transition-shadow hover:shadow-[0px_6px_15px_0px_#404F680D]">
                      <div className="image h-[200px] shrink-0 overflow-hidden">
                        <img
                          src={item.thumb_image || item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="content flex flex-1 flex-col rounded-b-2xl border border-[var(--Border)] border-t-0 bg-[var(--White)] px-[25px] pt-[22px] pb-[30px] text-center">
                        <div className="sub-blog mb-[13px] flex flex-wrap items-center justify-center gap-6">
                          <div className="relative text-[15px] font-normal leading-7 text-[var(--Text)] after:absolute after:-right-3.5 after:top-1/2 after:h-1 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-[var(--Text)] last:after:hidden">
                            {item.tags?.[0]?.name ?? "Blog"}
                          </div>
                          <div className="text-[15px] font-normal leading-7 text-[var(--Text)]">
                            &nbsp;
                          </div>
                        </div>
                        <div className="name mb-[14px] min-h-[56px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                          <Link
                            href={blogPostPath(item.slug)}
                            className="line-clamp-2 text-[var(--Secondary)] hover:underline"
                          >
                            {item.title}
                          </Link>
                        </div>
                        <Link
                          href={blogPostPath(item.slug)}
                          className="tf-button-no-bg mx-auto mt-auto inline-flex items-center gap-2.5 text-[15px] font-medium leading-[18px] text-[var(--Secondary)] transition-colors hover:text-[var(--Primary)]"
                        >
                          Read More
                          <ChevronRight className="h-[18px] w-[18px]" strokeWidth={2} />
                        </Link>
                      </div>
                    </div>
                  </FadeInStaggerItem>
                ))}
              </FadeInStagger>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </Layout>
  );
}
