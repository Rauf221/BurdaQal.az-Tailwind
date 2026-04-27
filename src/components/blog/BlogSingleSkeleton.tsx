"use client";

import { useTranslations } from "next-intl";
import { BlogGridSkeleton } from "@/components/blog/BlogListSkeleton";
import listStyles from "@/components/blog/BlogListSkeleton.module.css";
import styles from "@/components/blog/BlogSingleSkeleton.module.css";

export default function BlogSingleSkeleton() {
  const t = useTranslations("blogSkeleton");
  return (
    <div className="blog-single-wrap" aria-busy="true">
      <span className={listStyles.visuallyHidden}>{t("loading")}</span>
      <div className="image-head mx-auto mb-10 w-full px-5">
        <div className={`${listStyles.shimmer} ${styles.hero}`} aria-hidden />
      </div>
      <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
        <div className="mx-auto max-w-[920px]">
          <div className="blog-single-inner mb-[200px] flex flex-col gap-[51px]">
            <div className={styles.breadcrumbSkel} aria-hidden>
              <div className={`${listStyles.shimmer} ${styles.crumb}`} />
              <div className={`${listStyles.shimmer} ${styles.crumb}`} style={{ width: 28 }} />
              <div className={`${listStyles.shimmer} ${styles.crumb}`} style={{ width: 40 }} />
              <div className={`${listStyles.shimmer} ${styles.crumb}`} style={{ width: 120 }} />
            </div>
            <div aria-hidden>
              <div className={`${listStyles.shimmer} ${styles.titleLineLg}`} />
              <div className={`${listStyles.shimmer} ${styles.titleLineMd}`} />
              <div className={styles.subRow}>
                <div className={`${listStyles.shimmer} ${styles.subPill}`} />
                <div
                  className={`${listStyles.shimmer} ${styles.subPill}`}
                  style={{ width: 64 }}
                />
              </div>
            </div>
            <div className={styles.bodyBlock} aria-hidden>
              <div className={`${listStyles.shimmer} ${styles.bodyLine}`} />
              <div className={`${listStyles.shimmer} ${styles.bodyLine} ${styles.bodyLine90}`} />
              <div className={`${listStyles.shimmer} ${styles.bodyLine} ${styles.bodyLine80}`} />
              <div className={`${listStyles.shimmer} ${styles.bodyLine}`} />
              <div className={`${listStyles.shimmer} ${styles.bodyLine} ${styles.bodyLine60}`} />
            </div>
            <div className={styles.tagsRow} aria-hidden>
              <div className={`${listStyles.shimmer} ${styles.tagPill}`} />
              <div className={`${listStyles.shimmer} ${styles.tagPill}`} style={{ width: 88 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="wg-related-posts rounded-3xl bg-[#F9F9F9] px-[14px] pb-[171px] pt-[191px]">
        <div className="themesflat-container mx-auto w-full max-w-[1428px]">
          <div className={`heading-section mb-9 text-center min-[992px]:mb-[46px] ${styles.relatedHeading}`}>
            <div className={`${listStyles.shimmer} ${styles.headingLine}`} aria-hidden />
            <div className={`${listStyles.shimmer} ${styles.subheadingLine}`} aria-hidden />
          </div>
          <div className="grid grid-cols-1 gap-[29px] md:grid-cols-2 xl:grid-cols-4">
            <BlogGridSkeleton count={4} withScreenReaderHint={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
