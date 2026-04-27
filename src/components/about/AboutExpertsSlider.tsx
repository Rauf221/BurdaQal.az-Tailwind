"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { ExternalLink, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { resolveMediaUrl } from "@/lib/media-url";
import { getTeamsQuery } from "@/services/client/about";

function apiBase(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

function toExternalHref(raw: string | undefined): string {
  if (!raw || !String(raw).trim()) return "#";
  const t = String(raw).trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

const sliderCfg = {
  spaceBetween: 28,
  slidesPerView: 4,
  observer: true,
  observeParents: true,
  breakpoints: {
    0: { slidesPerView: 1 },
    600: { slidesPerView: 2 },
    1400: { slidesPerView: 4 },
  },
};

export default function AboutExpertsSlider() {
  const locale = useLocale();
  const { data, isPending, isError } = useQuery(getTeamsQuery(locale));

  const members = data?.data ?? [];

  return (
    <Swiper {...sliderCfg} className="!pb-2">
      {isPending ? (
        <SwiperSlide>
          <div className="experts-item flex min-h-[200px] items-center justify-center rounded-2xl border border-[var(--Border)] bg-[#fafafa]">
            <p className="mb-0 py-5 text-center text-[var(--Text)]">…</p>
          </div>
        </SwiperSlide>
      ) : null}
      {!isPending && !isError && members.length > 0
        ? members.map((member, i) => {
            const rawImg = member.image || member.thumb_image;
            const img = rawImg
              ? (resolveMediaUrl(apiBase(), rawImg) || rawImg)
              : null;
            const href = toExternalHref(member.link);
            return (
              <SwiperSlide key={`${member.name}-${i}`}>
                <div className="group experts-item">
                  <div className="image relative mb-[23px] overflow-hidden rounded-2xl">
                    {img ? (
                      <img
                        src={img}
                        alt={member.name || ""}
                        className="w-full transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="flex aspect-[4/3] w-full items-center justify-center bg-[#e8e8e8] text-[var(--Text)]/25"
                        aria-hidden
                      >
                        <User className="h-20 w-20" strokeWidth={1.25} />
                      </div>
                    )}
                    <ul className="pointer-events-none absolute left-1/2 top-1/2 m-0 list-none p-0 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:top-1/2 group-hover:opacity-100">
                      <li>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--Secondary)] shadow-md"
                          aria-label={member.name}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <h4 className="m-0 text-lg font-semibold text-[var(--Secondary)]">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-inherit no-underline hover:underline"
                    >
                      {member.name}
                    </a>
                  </h4>
                  <p className="mt-1 text-[15px] text-[var(--Text)]">
                    {member.profession}
                  </p>
                </div>
              </SwiperSlide>
            );
          })
        : null}
      {!isPending && isError ? (
        <SwiperSlide>
          <div className="experts-item flex min-h-[120px] items-center justify-center rounded-2xl border border-[var(--Border)]">
            <p className="mb-0 py-5 text-center text-sm text-[var(--Text)] opacity-80">
              Team could not be loaded.
            </p>
          </div>
        </SwiperSlide>
      ) : null}
      {!isPending && !isError && members.length === 0 ? (
        <SwiperSlide>
          <div className="experts-item flex min-h-[120px] items-center justify-center rounded-2xl border border-[var(--Border)]">
            <p className="mb-0 py-5 text-center text-sm text-[var(--Text)] opacity-80">
              No team members yet.
            </p>
          </div>
        </SwiperSlide>
      ) : null}
    </Swiper>
  );
}
