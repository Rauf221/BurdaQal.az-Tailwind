"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { resolveMediaUrl } from "@/lib/media-url";
import { getAboutQuery } from "@/services/client/about";

const FALLBACK_TITLE = "Local expertise for luxury homes";
const FALLBACK_DESCRIPTION =
  "Pellentesque egestas elementum egestas faucibus sem. Velit nunc egestas ut morbi. Leo diam diam nibh eget fermentum massa pretium. Mi mauris nulla ac dictum ut mauris non.";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80";

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

export default function AboutUsSection() {
  const locale = useLocale();
  const { data, isPending } = useQuery(getAboutQuery(locale));
  const block = data?.data;

  const title = block?.title?.trim() || FALLBACK_TITLE;
  const description = block?.description?.trim() || FALLBACK_DESCRIPTION;
  const rawImg = block?.image || block?.thumb_image;
  const imgSrc = rawImg
    ? resolveMediaUrl(apiBase(), rawImg) || FALLBACK_IMAGE
    : FALLBACK_IMAGE;

  return (
    <section className="luxury-home style-5 bg-white pb-32 md:pb-[200px]">
      <div className="themesflat-container mx-auto max-w-[1428px] px-[14px]">
        <div className="flex flex-col items-stretch gap-10 md:flex-row md:justify-between md:gap-8 lg:gap-12">
          <div className="w-full md:w-1/2 md:max-w-[50%]">
            <div
              className={
                "image overflow-hidden rounded-2xl" +
                (isPending ? " opacity-50" : "")
              }
            >
              <img
                src={imgSrc}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex w-full flex-col justify-center md:max-w-[42%] md:flex-1">
            <div className="content">
              <h2 className="mb-[34px] text-[28px] font-semibold leading-tight text-[var(--Secondary)] md:text-[36px] md:leading-[44px]">
                {title}
              </h2>
              <div className="text-content text-base font-normal leading-6 text-[var(--Secondary)] md:text-[16px] md:leading-6">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
