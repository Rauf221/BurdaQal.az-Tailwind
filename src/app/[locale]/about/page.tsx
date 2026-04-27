"use client";

import { useTranslations } from "next-intl";
import AboutExpertsSlider from "@/components/about/AboutExpertsSlider";
import AboutFaqSection from "@/components/about/AboutFaqSection";
import AboutUsSection from "@/components/about/AboutUsSection";
import AboutVisionMissionSection from "@/components/about/AboutVisionMissionSection";
import Layout from "@/components/layout/Layout";

export default function AboutPage() {
  const t = useTranslations("aboutPage");
  return (
    <Layout
      headerStyle={12}
      breadcrumbTitle="about"
      mainContentCls="px-[14px] sm:px-8 md:px-12 lg:px-20 default"
    >
      <div>
        <AboutVisionMissionSection />
        <AboutUsSection />
        <section className="flat-experts style-1 pb-24 md:pb-[190px]">
          <div className="themesflat-container mx-auto max-w-[1428px] px-[14px]">
            <div className="heading-section mx-auto mb-12 max-w-[720px] text-center md:mb-[46px]">
              <h2 className="-mt-2 mb-4 text-[28px] font-semibold leading-tight text-[var(--Secondary)] md:text-[36px] md:leading-[44px]">
                {t("teamTitle")}
              </h2>
              <div className="text-[17px] font-normal leading-5 text-[var(--Text)]">
                {t("teamSubtitle")}
              </div>
            </div>
            <div className="wrap-experts">
              <AboutExpertsSlider />
            </div>
          </div>
        </section>
        <AboutFaqSection />
      </div>
    </Layout>
  );
}
