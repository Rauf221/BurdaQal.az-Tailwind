"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { blogPostPath } from "@/lib/blogRoutes";
import type { BlogListItem } from "@/types";

type BlogCardProps = {
  post: BlogListItem;
  imageSrc: string;
};

export function BlogCard({ post, imageSrc }: BlogCardProps) {
  const tc = useTranslations("common");

  return (
    <article
      className="flex flex-col gap-4"
      data-card="blog-card"
    >
      <Link
        href={blogPostPath(post.slug)}
        className="group relative block h-[318px] w-full shrink-0 overflow-hidden rounded-2xl bg-white"
      >
        <img
          src={imageSrc}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-col gap-3 px-2">
        <div className="flex flex-wrap items-center gap-2 text-[14px] font-normal leading-5 text-[#64717c]">
          <span className="whitespace-nowrap">
            {post.created_at ?? tc("dash")}
          </span>
          <span
            className="size-1 shrink-0 rounded-full bg-[#636366]"
            aria-hidden
          />
          <span className="whitespace-nowrap">
            {post.tags?.[0]?.name ?? tc("blogFallbackTag")}
          </span>
        </div>
        <h3 className="text-[20px] font-medium leading-7 tracking-tight text-[#1d212a]">
          <Link
            href={blogPostPath(post.slug)}
            className="line-clamp-2  hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--Primary)]"
          >
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
