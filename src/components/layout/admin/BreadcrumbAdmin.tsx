"use client";

import { useTranslations } from "next-intl";

export type BreadcrumbAdminProps = {
  breadcrumbTitle: string;
};

/** justhome `BreadcrumbAdmin.js` */
export default function BreadcrumbAdmin({ breadcrumbTitle }: BreadcrumbAdminProps) {
  const t = useTranslations("dashboardAdmin");
  return (
    <>
      <h3 className="mb-[5px] mt-2 text-[28px] font-semibold leading-tight text-[var(--Secondary)] md:text-[32px]">
        {breadcrumbTitle}
      </h3>
      <div className="text-content mb-6 text-base font-normal leading-6 text-[var(--Text)]">
        {t("welcome")}
      </div>
    </>
  );
}
