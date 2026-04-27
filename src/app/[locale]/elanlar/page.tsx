import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ElanlarFilterForm from "@/components/elanlar/ElanlarFilterForm";
import ElanlarListings from "@/components/elanlar/ElanlarListings";
import Layout from "@/components/layout/Layout";
import { FadeIn } from "@/components/motion";

function FilterFallback() {
  return (
    <div
      className="min-h-[120px] rounded-2xl border border-[var(--Border)] bg-[#F9F9F9]"
      aria-hidden
    />
  );
}

export default async function ElanlarPage() {
  const t = await getTranslations("elanlarPage");
  const tn = await getTranslations("navigation");

  return (
    <Layout headerStyle={12} mainContentCls="px-5">
      <div>
        <FadeIn>
          <div className="flat-title page-property-grid-2 pt-10 pb-[42px]">
            <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
              <div className="text-start">
                <h2 className="text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
                  {t("title")}
                </h2>
                <ul className="mb-11 mt-0 flex flex-wrap items-center justify-start gap-[5px]">
                  <li>
                    <Link
                      href="/"
                      className="text-base font-normal leading-6 text-[var(--Text)] hover:underline"
                    >
                      {tn("home")}
                    </Link>
                  </li>
                  <li className="text-base font-normal leading-6 text-[var(--Text)]">/</li>
                  <li className="text-base font-normal leading-6 text-[var(--Text)]">
                    {t("breadcrumbCurrent")}
                  </li>
                </ul>
                <Suspense fallback={<FilterFallback />}>
                  <ElanlarFilterForm />
                </Suspense>
              </div>
            </div>
          </div>
        </FadeIn>
        <Suspense
          fallback={
            <div className="themesflat-container mx-auto max-w-[1428px] px-[14px] py-8 text-[var(--Text)]">
              {t("loading")}
            </div>
          }
        >
          <ElanlarListings />
        </Suspense>
      </div>
    </Layout>
  );
}
