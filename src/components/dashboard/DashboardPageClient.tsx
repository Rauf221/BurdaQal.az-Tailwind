"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  FileText,
  Home,
  Inbox,
  MessageCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import LayoutAdmin from "@/components/layout/admin/LayoutAdmin";
import DashboardChartList from "@/components/dashboard/DashboardChartList";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { getUserProfileQuery } from "@/services/client/auth/queries";
import { pickUserDisplay } from "@/services/client/auth/userDisplay";

const STATS_CONFIG = [
  { value: "16", labelKey: "statPublished" as const, icon: Inbox },
  { value: "24", labelKey: "statPending" as const, icon: FileText },
  { value: "39", labelKey: "statFavorites" as const, icon: Home },
  { value: "48", labelKey: "statReviews" as const, icon: MessageCircle },
] as const;

const ACTIVITY_KEYS = [
  "activity1",
  "activity2",
  "activity3",
  "activity4",
  "activity5",
  "activity6",
] as const;

function StatCard({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: typeof Inbox;
}) {
  return (
    <div className="rounded-3xl border border-[var(--Border)] bg-[var(--White)] p-[39px]">
      <div className="group flex items-center justify-between py-[11px] pb-[14px]">
        <div className="text-start">
          <Link
            href="/#"
            className="title block text-[40px] font-semibold leading-[47px] text-[var(--Secondary)] no-underline hover:text-[var(--Fourth)]"
          >
            {value}
          </Link>
          <div className="text-content mt-1 text-[var(--Fourth)]">{label}</div>
        </div>
        <div
          className="relative flex h-[60px] w-[70px] shrink-0 items-center justify-end pb-2.5 pl-5 before:absolute before:bottom-0 before:left-0 before:h-[50px] before:w-[50px] before:rounded-full before:bg-[var(--Primary)] before:transition-all before:duration-300 group-hover:before:-bottom-2.5 group-hover:before:-left-3 group-hover:before:h-[100px] group-hover:before:w-[100px]"
          aria-hidden
        >
          <Icon
            className="relative z-[1] h-[50px] w-[50px] text-[var(--Fourth)]"
            strokeWidth={1.15}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * justhome `app/[locale]/dashboard/page.js` — stat kartları, Apex area chart, son aktivliklər.
 */
export default function DashboardPageClient() {
  const locale = useLocale();
  const t = useTranslations("dashboardHome");
  const tn = useTranslations("navigation");
  const tc = useTranslations("common");
  const isAuthed = useAuthSession();
  const { data: profilePayload, isPending } = useQuery({
    ...getUserProfileQuery(locale),
    enabled: isAuthed,
  });

  const display =
    isAuthed && isPending
      ? { title: tc("ellipsis") }
      : pickUserDisplay(isAuthed ? profilePayload : null);

  const breadcrumbTitle = isAuthed
    ? t("greeting", { name: display.title })
    : tn("dashboard");

  return (
    <LayoutAdmin breadcrumbTitle={breadcrumbTitle}>
      <div>
        <div className="mb-20 grid grid-cols-2 gap-5 min-[992px]:grid-cols-4">
          {STATS_CONFIG.map((s) => (
            <StatCard key={s.labelKey} value={s.value} label={t(s.labelKey)} icon={s.icon} />
          ))}
        </div>

        <div className="flex flex-col gap-5 min-[992px]:flex-row">
          <div className="min-[992px]:w-[66%] rounded-3xl border border-[var(--Border)] bg-[var(--White)] py-[39px] pr-[39px] pb-[39px] pl-11">
            <h4 className="-mt-2 mb-[33px] text-[22px] font-semibold leading-8 text-[var(--Secondary)]">
              {t("chartTitle")}
            </h4>
            <div className="area-chart -mx-1 min-h-[500px]">
              <DashboardChartList style={1} />
            </div>
          </div>

          <div className="min-w-0 flex-1 rounded-3xl border border-[var(--Border)] bg-[var(--White)] p-[39px]">
            <h4 className="-mt-2 mb-[33px] text-[22px] font-semibold leading-8 text-[var(--Secondary)]">
              {t("recentTitle")}
            </h4>
            <ul className="m-0 flex list-none flex-col gap-[30px] p-0">
              {ACTIVITY_KEYS.map((key) => (
                <li key={key} className="flex items-start gap-2.5">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-[#F9F9F9]" />
                  <p className="m-0 text-base leading-5 text-[var(--Text)]">{t(key)}</p>
                </li>
              ))}
              <li>
                <Link
                  href="/#"
                  className="inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--Primary)] bg-[var(--White)] px-[26px] text-[15px] font-medium leading-[18px] text-black no-underline transition-colors hover:bg-[#D9B75A0D]"
                >
                  {t("viewMore")}
                  <ArrowRight className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
