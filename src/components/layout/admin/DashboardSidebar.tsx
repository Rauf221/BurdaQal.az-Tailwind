"use client";

import { Home, LayoutGrid, LogOut, Plus, User } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useLogoutMutation } from "@/services/client/auth/mutations";

const linkClass =
  "flex h-[60px] items-center gap-2.5 pl-5 text-base font-normal leading-6 text-white no-underline transition-colors hover:text-white";

const itemClass =
  "rounded-xl transition-colors hover:bg-white/[0.08] [&.is-active]:bg-white/[0.08]";

/**
 * justhome `Sidebar.js` — Tailwind, lucide ikonlar.
 */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("dashboardSidebar");
  const logoutMutation = useLogoutMutation(locale);

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        window.location.href = locale === "az" ? "/" : `/${locale}`;
      },
    });
  };

  const nav = [
    { href: "/dashboard", labelKey: "dashboard" as const, icon: LayoutGrid },
    { href: "/dashboard-my-profile", labelKey: "myProfile" as const, icon: User },
    { href: "/dashboard-add-properties", labelKey: "addProperty" as const, icon: Plus },
    { href: "/dashboard-my-properties", labelKey: "myProperties" as const, icon: Home },
  ] as const;

  return (
    <div id="dashboard-sidebar-nav">
      <div
        className={[
          "z-50 rounded-[24px] bg-[var(--Fourth)]",
          "max-[767px]:sticky max-[767px]:top-[92px] max-[767px]:z-[45] max-[767px]:mb-5 max-[767px]:w-full max-[767px]:max-w-full max-[767px]:rounded-2xl max-[767px]:px-5 max-[767px]:py-4 max-[767px]:shadow-[0_2px_14px_rgba(0,0,0,0.08)]",
          "md:fixed md:bottom-5 md:left-5 md:top-[140px] md:mb-0 md:w-[360px] md:rounded-[24px] md:px-10 md:py-10 md:shadow-none",
          "min-[992px]:top-[141px] min-[992px]:w-[331px]",
        ].join(" ")}
      >
        <div
          className={[
            "menu-content h-full overflow-y-auto [&::-webkit-scrollbar]:w-0",
            "max-[767px]:max-h-[min(45vh,320px)] max-[767px]:h-auto",
          ].join(" ")}
        >
          <ul className="flex flex-col gap-2.5">
            {nav.map(({ href, labelKey, icon: Icon }) => {
              const active = pathname === href;
              return (
                <li key={href} className={`${itemClass} ${active ? "is-active" : ""}`.trim()}>
                  <Link href={href} className={linkClass}>
                    <Icon className="h-5 w-5 shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                    {t(labelKey)}
                  </Link>
                </li>
              );
            })}
            <li className={itemClass}>
              <button
                type="button"
                onClick={onLogout}
                disabled={logoutMutation.isPending}
                className={`${linkClass} w-full cursor-pointer border-0 bg-transparent text-left font-inherit disabled:cursor-wait disabled:opacity-65`}
              >
                <LogOut className="h-5 w-5 shrink-0 text-white" strokeWidth={1.75} aria-hidden />
                {logoutMutation.isPending ? t("logoutPending") : t("logout")}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
