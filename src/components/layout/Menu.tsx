"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export type MenuProps = {
  variant?: "default" | "inverse" | "mobile";
};

export default function Menu({ variant = "default" }: MenuProps) {
  const pathname = usePathname() ?? "";
  const t = useTranslations("navigation");

  const checkCurrent = (path: string) => pathname === path;
  const checkParent = (paths: string[]) =>
    paths.some((p) => pathname.startsWith(p));

  if (variant === "mobile") {
    const linkClass =
      "relative block py-2.5 text-base font-semibold capitalize leading-[26px] text-[var(--Secondary)] no-underline";
    return (
      <ul className="navigation clearfix m-0 block w-full list-none p-0">
        <li className={checkCurrent("/") ? "current" : ""}>
          <Link href="/" className={linkClass}>
            {t("home")}
          </Link>
        </li>
        <li className={checkParent(["/elanlar"]) ? "current" : ""}>
          <Link href="/elanlar" className={linkClass}>
            {t("property")}
          </Link>
        </li>
        <li className={checkCurrent("/about") ? "current" : ""}>
          <Link href="/about" className={linkClass}>
            {t("aboutUs")}
          </Link>
        </li>
        <li className={checkParent(["/bloglar"]) ? "current" : ""}>
          <Link href="/bloglar" className={linkClass}>
            {t("blog")}
          </Link>
        </li>
        <li className={checkCurrent("/contact") ? "current" : ""}>
          <Link href="/contact" className={linkClass}>
            {t("contact")}
          </Link>
        </li>
      </ul>
    );
  }

  const lineColor =
    variant === "inverse" ? "after:bg-white" : "after:bg-[#1A1A1A]";
  const liClass = (active: boolean) =>
    [
      "group relative",
      "after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300 after:content-['']",
      lineColor,
      active ? "after:w-full" : "after:w-0 hover:after:w-full",
    ].join(" ");

  const linkClass =
    "item flex h-[50px] items-center px-2.5 text-base font-medium leading-[19px] max-[1200px]:h-[79px] max-[1200px]:leading-[79px] " +
    (variant === "inverse" ? "text-white" : "text-[#1A1A1A]");

  return (
    <ul className="navigation flex w-max min-w-0 items-center justify-center gap-10 max-[1200px]:gap-5">
      <li className={liClass(checkCurrent("/"))}>
        <Link href="/" className={linkClass}>
          {t("home")}
        </Link>
      </li>
      <li className={liClass(checkParent(["/elanlar"]))}>
        <Link href="/elanlar" className={linkClass}>
          {t("property")}
        </Link>
      </li>
      <li className={liClass(checkCurrent("/about"))}>
        <Link href="/about" className={linkClass}>
          {t("aboutUs")}
        </Link>
      </li>
      <li className={liClass(checkParent(["/bloglar"]))}>
        <Link href="/bloglar" className={linkClass}>
          {t("blog")}
        </Link>
      </li>
      <li className={liClass(checkCurrent("/contact"))}>
        <Link href="/contact" className={linkClass}>
          {t("contact")}
        </Link>
      </li>
    </ul>
  );
}
