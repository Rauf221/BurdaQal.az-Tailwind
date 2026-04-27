"use client";

import { useTranslations } from "next-intl";
import styles from "./BlogListSkeleton.module.css";

const FILTER_PILL_WIDTHS = [72, 96, 84, 110, 78];

export function BlogFilterSkeletonRow() {
  return (
    <div className={styles.filterRow} aria-hidden>
      {FILTER_PILL_WIDTHS.map((w, i) => (
        <div
          key={i}
          className={`${styles.shimmer} ${styles.filterPill}`}
          style={{ width: w }}
        />
      ))}
    </div>
  );
}

export function BlogFilterSkeleton() {
  return (
    <div className="widget-tabs style-1">
      <div className="themesflat-container mx-auto mb-[30px] w-full max-w-[1428px] px-[14px]">
        <BlogFilterSkeletonRow />
      </div>
    </div>
  );
}

export function BlogGridSkeleton({
  count = 8,
  withScreenReaderHint = true,
}: {
  count?: number;
  withScreenReaderHint?: boolean;
}) {
  const t = useTranslations("blogSkeleton");
  return (
    <>
      {withScreenReaderHint ? (
        <span className={styles.visuallyHidden}>{t("loading")}</span>
      ) : null}
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.shimmer} ${styles.cardImage}`} aria-hidden />
          <div className={styles.cardBody}>
            <div className={styles.metaRow} aria-hidden>
              <div className={`${styles.shimmer} ${styles.metaLine}`} />
              <div
                className={`${styles.shimmer} ${styles.metaLine} ${styles.metaLineWide}`}
              />
            </div>
            <div className={`${styles.shimmer} ${styles.titleLine}`} aria-hidden />
            <div
              className={`${styles.shimmer} ${styles.titleLine} ${styles.titleLineShort}`}
              aria-hidden
            />
            <div className={`${styles.shimmer} ${styles.ctaLine}`} aria-hidden />
          </div>
        </div>
      ))}
    </>
  );
}

export function BlogListPageSkeleton() {
  return (
    <>
      <div className="flat-title relative z-20 pt-[90px] pb-[94px]">
        <div className="themesflat-container full mx-auto w-full max-w-[1920px] px-[14px]">
          <div className="text-center">
            <div className={`${styles.shimmer} ${styles.titleBlock} mx-auto`} aria-hidden />
            <div className={`${styles.breadcrumbRow} justify-center`} aria-hidden>
              <div className={`${styles.shimmer} ${styles.crumb}`} />
              <div className={`${styles.shimmer} ${styles.crumb}`} style={{ width: 36 }} />
              <div className={`${styles.shimmer} ${styles.crumb}`} style={{ width: 44 }} />
            </div>
          </div>
        </div>
      </div>
      <div className="blog-list-api-wrap px-5">
        <BlogFilterSkeleton />
        <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
          <div className="grid grid-cols-1 gap-[29px] md:grid-cols-2 xl:grid-cols-3">
            <BlogGridSkeleton />
          </div>
        </div>
      </div>
    </>
  );
}
