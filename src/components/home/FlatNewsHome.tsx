import { getTranslations } from "next-intl/server";
import SliderNewsHome from "@/components/home/SliderNewsHome";

/** Figma 2151:8706 — Faydalı Bloqlar: #f4f5f6 fon, başlıq + şəbəkə + «Daha çoxuna bax». */
export default async function FlatNewsHome() {
  const t = await getTranslations("flatNewsHome");

  return (
    <section className="tf-section flat-news bg-[#f4f5f6] py-[80px]">
      <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
        <div className="flex flex-col gap-12">
          <div className="mx-auto flex w-full max-w-[516px] flex-col gap-4 text-center">
            <h2 className="text-[36px] font-semibold leading-[44px] tracking-tight text-[#2f3235]">
              {t("title")}
            </h2>
            <p className="text-[16px] font-normal leading-6 text-[#797c80]">
              {t("subtitle")}
            </p>
          </div>
          <SliderNewsHome />
        </div>
      </div>
    </section>
  );
}
