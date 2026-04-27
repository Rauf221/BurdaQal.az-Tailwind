"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Bath, Bed, LayoutGrid, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { announcementsListQuery, publicStorageUrl } from "@/services/client/properties";
import { categoriesListQuery } from "@/services/dashboard/Add-New-Properties/queries";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

function cardImage(media: {
  cover_image?: string | null;
  gallery?: string[] | null;
} | null) {
  const first = media?.cover_image || media?.gallery?.[0];
  const url = first ? publicStorageUrl(first) : null;
  return url || PLACEHOLDER_IMG;
}

export default function WorkWithUsHome() {
  const locale = useLocale();
  const t = useTranslations("workWithUsHome");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const categoriesQ = useQuery(categoriesListQuery(locale));
  const categories = categoriesQ.data?.data ?? [];
  const q = useQuery(
    announcementsListQuery(locale, 1, {
      ...(selectedCategoryId ? { category_id: selectedCategoryId } : {}),
    })
  );
  const items = (q.data?.data ?? []).slice(0, 6);

  const tabActiveClass =
    "active border-[var(--Secondary)] bg-[var(--jh-cream)]";
  const tabIdleClass = "border-transparent";

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
                    <span className="inner text-base font-medium leading-[19px] text-[var(--Text)]">
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
                          <span className="inner text-base font-medium leading-[19px] text-[var(--Text)]">
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
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
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
                    const street = row.address?.street || "-";
                    const detailHref = `/elanlar/${row.slug}`;
                    return (
                      <div key={row.id}>
                        <div className="box-dream style-absolute type-no-bg-content relative mb-[30px] overflow-hidden rounded-2xl bg-[var(--White)] pt-0 transition-shadow duration-300 hover:shadow-[0px_6px_15px_0px_#404F680D]">
                          <div className="image relative m-0 h-[410px] overflow-hidden rounded-none">
                            <div className="list-tags absolute left-5 top-5 z-[2] flex gap-2.5">
                              <Link
                                href="/elanlar"
                                className="tags-item for-sell rounded-[120px] bg-[var(--Fourth)] px-[15px] py-2 text-[13px] font-medium leading-[15px] text-[var(--White)]"
                              >
                                {t("tagListing")}
                              </Link>
                            </div>
                            <div className="absolute inset-0 z-[5] bg-[linear-gradient(180deg,rgba(26,26,26,0)_0%,rgba(26,26,26,0.1)_61.39%,rgba(26,26,26,0.8)_100%)]" />
                            <img
                              className="relative z-[1] block min-h-[286px] w-full object-cover"
                              src={cardImage(row.media)}
                              alt={row.title || ""}
                            />
                          </div>
                          <div className="content absolute bottom-5 left-[22px] right-[22px] z-10 box-border w-auto rounded-lg bg-transparent px-[22px] py-4">
                            <div className="head mb-2.5">
                              <div className="title max-w-[270px] overflow-hidden text-ellipsis whitespace-nowrap text-[19px] font-medium leading-7 text-[var(--White)]">
                                <Link href={detailHref} className="text-[var(--White)]">
                                  {row.title}
                                </Link>
                              </div>
                            </div>
                            <div className="location mb-[15px] flex items-start gap-2.5">
                              <div className="icon text-[var(--White)]">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-base leading-6 text-[var(--White)]">
                                {street}
                              </p>
                            </div>
                            <div className="flex min-w-0 items-center justify-between gap-3.5">
                              <div className="icon-box flex min-w-0 flex-1 items-center gap-[31px]">
                                <div className="item relative flex items-center gap-2.5 text-[var(--White)] after:absolute after:-right-4 after:h-5 after:w-px after:bg-[var(--White)] after:opacity-30 last:after:hidden">
                                  <Bed className="h-5 w-5 shrink-0" />
                                  <p className="m-0 text-[15px] leading-7 text-[var(--White)]">
                                    {d ? d.bedroom : "-"}
                                  </p>
                                </div>
                                <div className="item relative flex items-center gap-2.5 text-[var(--White)] after:absolute after:-right-4 after:h-5 after:w-px after:bg-[var(--White)] after:opacity-30 last:after:hidden">
                                  <Bath className="h-5 w-5 shrink-0" />
                                  <p className="m-0 text-[15px] leading-7 text-[var(--White)]">
                                    {d ? d.bathroom : "-"}
                                  </p>
                                </div>
                                <div className="item flex items-center gap-2.5 text-[var(--White)]">
                                  <LayoutGrid className="h-5 w-5 shrink-0" />
                                  <p className="m-0 text-[15px] leading-7 text-[var(--White)]">
                                    {d ? d.room : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="price shrink-0 whitespace-nowrap text-right text-[19px] font-medium leading-7 text-[var(--White)]">
                                {row.price ? `${row.price} AZN` : "-"}
                              </div>
                            </div>
                          </div>
                        </div>
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
