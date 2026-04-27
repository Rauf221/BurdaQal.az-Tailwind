import { getTranslations } from "next-intl/server";
import SliderNewsHome from "@/components/home/SliderNewsHome";

export default async function FlatNewsHome() {
  const t = await getTranslations("flatNewsHome");

  return (
    <section className="tf-section flat-news rounded-[24px] bg-[#F9F9F9] py-20 md:py-[200px]">
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
        <div className="row -mx-[14px]">
          <div className="col-12 px-[14px]">
            <div className="slider-news slider-auto">
              <SliderNewsHome />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
