"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import ElanlarCard from "@/components/elements/ElanlarCard";
import { announcementCardImages } from "@/components/elanlar/announcementCardImages";
import { announcementsListQuery } from "@/services/client/properties";
import { categoriesListQuery } from "@/services/dashboard/Add-New-Properties/queries";

/** Bu bölmədə göstəriləcək maksimum elan kartı sayı */
export const WORK_WITH_US_HOME_MAX_CARDS = 6;

export default function WorkWithUsHome() {
  const locale = useLocale();
  const t = useTranslations("workWithUsHome");
  const tListings = useTranslations("listings");
  const tc = useTranslations("common");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categoriesQ = useQuery(categoriesListQuery(locale));
  const categories = categoriesQ.data?.data ?? [];
  const q = useQuery(
    announcementsListQuery(locale, 1, {
      ...(selectedCategoryId ? { category_id: selectedCategoryId } : {}),
    })
  );
  const items = (q.data?.data ?? []).slice(0, WORK_WITH_US_HOME_MAX_CARDS);

  const tabActiveClass =
    "active border-transparent bg-black text-white";
  const tabIdleClass =
    "border-transparent bg-transparent text-[var(--Text)]";

  return (
    <section className="tf-section work-with-us style-3 pb-[200px] pt-[163px] md:pt-[202px]">
      <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
        <div className="row -mx-[14px]">
          <div className="col-12 px-[14px]">
            <div className="heading-section mb-[46px] text-center">
              <h2 className="-mt-2 mb-4 text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
                {t("title")}
              </h2>
              <div className="text text-[17px] font-normal leading-5 text-[var(--Text)]">
                {t("subtitle")}
              </div>
            </div>
          </div>
        </div>

        <div className="widget-tabs style-1">
          <div className="row -mx-[14px]">
            <div className="col-12 px-[14px]">
              <ul className="widget-menu-tab mb-[50px] flex flex-wrap justify-center gap-x-4 gap-y-3">
                <li className="list-none">
                  <button
                    type="button"
                    className={`item-title cursor-pointer rounded-[41px] border px-2 py-1.5 transition-colors ${selectedCategoryId === null ? tabActiveClass : tabIdleClass}`}
                    onClick={() => setSelectedCategoryId(null)}
                  >
                    <span className="inner text-base font-medium leading-[19px] text-inherit">
                      {t("all")}
                    </span>
                  </button>
                </li>
                {categoriesQ.isPending ? (
                  <li className="list-none px-2 py-1.5 text-base text-[var(--Text)]">
                    {t("categoriesLoading")}
                  </li>
                ) : categoriesQ.isError ? (
                  <li className="list-none px-2 py-1.5 text-base text-[var(--Text)]">
                    {t("categoriesError")}
                  </li>
                ) : (
                  categories.map((cat) => {
                    const idStr = String(cat.id);
                    const active = selectedCategoryId === idStr;
                    return (
                      <li key={cat.id} className="list-none">
                        <button
                          type="button"
                          className={`item-title cursor-pointer rounded-[41px] border px-2 py-1.5 transition-colors ${active ? tabActiveClass : tabIdleClass}`}
                          onClick={() => setSelectedCategoryId(idStr)}
                        >
                          <span className="inner text-base font-medium leading-[19px] text-inherit">
                            {cat.name}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>

          <div className="widget-content-tab">
            <div className="widget-content-inner active">
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4">
                {q.isError ? (
                  <div className="py-2">
                    <p className="text-[var(--Text)]">{t("listingsError")}</p>
                  </div>
                ) : q.isPending ? (
                  <div className="py-2">
                    <p className="text-[var(--Text)]">{t("loading")}</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-2">
                    <p className="text-[var(--Text)]">{t("empty")}</p>
                  </div>
                ) : (
                  items.map((row) => {
                    const d = row.detail;
                    const street = row.address?.street;
                    const detailHref = `/elanlar/${row.slug}`;
                    return (
                      <div key={row.id} className="min-w-0 flex justify-center">
                        <ElanlarCard
                          href={detailHref}
                          title={row.title ?? ""}
                          imageAlt={row.title ?? ""}
                          priceLine={
                            row.price
                              ? tListings("priceAzn", { price: row.price })
                              : tc("dash")
                          }
                          address={street || tc("dash")}
                          beds={d?.bedroom ?? null}
                          baths={d?.bathroom ?? null}
                          rooms={d?.room ?? null}
                          emptyLabel={tc("dash")}
                          images={announcementCardImages(row.media)}
                          className="w-full max-w-full"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row -mx-[14px]">
          <div className="col-12 px-[14px] text-center">
            <Link
              href="/elanlar"
              className="tf-button-primary border-radius-corner mx-auto mt-4 inline-flex items-center justify-center gap-2.5 rounded-[999px] bg-[var(--Primary)] px-[26px] py-[18px] text-[15px] font-medium leading-[18px] text-[var(--White)] transition-[background] hover:bg-[#6fb042]"
            >
              {t("seeAll")}
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
