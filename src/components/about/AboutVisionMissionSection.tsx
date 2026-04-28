"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getAboutAttributesQuery } from "@/services/client/about";

const FALLBACK_ITEMS = [
  {
    title: "Vision",
    description:
      "Adipiscing et vel tempor elementum dignissim urna. Eu sem sed enim habitant libero ultricies sagittis. Malesuada viverra netus diam vehicula nulla. Neque mattis lacus sed tristique. Luctus ipsum lobortis sed odio ut ultricies adipiscing nisi nulla. Turpis aliquam feugiat tortor rutrum diam molestie vel pharetra.",
  },
  {
    title: "Mission",
    description:
      "sit arcu odio aenean vitae eu egestas. Gravida commodo non sem diam faucibus justo dolor. Consectetur nunc scelerisque ut enim tristique sed. At leo urna eu quam cursus dolor. In bibendum sit scelerisque mattis cum.",
  },
];

export default function AboutVisionMissionSection() {
  const locale = useLocale();
  const { data, isPending } = useQuery(getAboutAttributesQuery(locale));
  const items =
    data?.data && data.data.length > 0
      ? data.data.map((row) => ({
          title: row.title?.trim() || "",
          description: row.description?.trim() || "",
        }))
      : FALLBACK_ITEMS;

  return (
    <section
      className={
        "vision-mission pt-[120px] pb-24 md:pt-[191px] md:pb-[178px]" +
        (isPending ? " opacity-75" : "")
      }
    >
      <div className="themesflat-container mx-auto max-w-[1428px] px-[14px]">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-x-[120px] lg:gap-x-[200px]">
          {items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="w-full max-w-[600px]">
              <h2 className="mb-[22px] text-[28px] font-semibold leading-tight text-[var(--Secondary)] md:text-[36px] md:leading-[44px]">
                {item.title}
              </h2>
              <p className="text-base font-normal leading-6 text-[var(--Text)] md:text-[16px] md:leading-6">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
