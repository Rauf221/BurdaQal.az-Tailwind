"use client";

import { Home, LayoutGrid, LogOut, Plus, User } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useLogoutMutation } from "@/services/client/auth/mutations";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

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
  const tc = useTranslations("common");
  const logoutMutation = useLogoutMutation(locale);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setLogoutOpen(true);
  };

  const confirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setLogoutOpen(false);
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

      <ConfirmModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title={"Hesabdan çıxmaq istədiyinizə əminsiniz?"}
        cancelLabel={tc("cancel")}
        confirmLabel={t("logout")}
        confirmPending={logoutMutation.isPending}
        onConfirm={confirmLogout}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden
          >
            <path
              d="M18.6667 10.6663V7.99967C18.6667 7.29243 18.3857 6.61415 17.8856 6.11406C17.3855 5.61396 16.7072 5.33301 16 5.33301H6.66667C5.95942 5.33301 5.28115 5.61396 4.78105 6.11406C4.28095 6.61415 4 7.29243 4 7.99967V23.9997C4 24.7069 4.28095 25.3852 4.78105 25.8853C5.28115 26.3854 5.95942 26.6663 6.66667 26.6663H16C16.7072 26.6663 17.3855 26.3854 17.8856 25.8853C18.3857 25.3852 18.6667 24.7069 18.6667 23.9997V21.333M9.33333 15.9997H28M28 15.9997L24 11.9997M28 15.9997L24 19.9997"
              stroke="#FF3B30"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}
