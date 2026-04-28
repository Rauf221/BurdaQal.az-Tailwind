"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ImageOff, MapPin, Pencil, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getAxiosErrorMessage } from "@/services/client/auth/apiMessage";
import {
  myAnnouncementsListQuery,
  useDeleteAnnouncementMutation,
  type MyAnnouncementItem,
} from "@/services/dashboard/My-properties";
import { FadeIn } from "@/components/motion";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const wgBoxCls =
  "mb-20 rounded-3xl border border-[var(--Border)] bg-[var(--White)] py-10 pl-6 pr-6 last:mb-0 md:pl-11 md:pr-[39px]";

const btnPrimaryCls =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--Primary)] text-[var(--White)] transition-colors hover:bg-[#6fb042] disabled:cursor-not-allowed disabled:opacity-50";

const btnDefaultCls =
  "inline-flex h-11 items-center justify-center rounded-xl border border-[var(--Border)] bg-[var(--White)] px-5 text-[15px] font-medium text-[var(--Secondary)] transition-colors hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-60";

function absoluteStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const raw = String(path).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base =
    process.env.NEXT_PUBLIC_USER_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  try {
    const u = new URL(base);
    const p = raw.startsWith("/") ? raw : `/${raw}`;
    return `${u.origin}${p}`;
  } catch {
    return raw;
  }
}

function DashboardPropertyThumb({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className="flex h-full min-h-[128.57px] w-full items-center justify-center self-stretch bg-[#f0f0f0] text-[var(--Text)]/30"
        aria-hidden
      >
        <ImageOff className="h-8 w-8" strokeWidth={1.25} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="block h-full w-full min-h-[128.57px] object-cover object-center"
      onError={() => setFailed(true)}
    />
  );
}

type DeleteTarget = {
  id: number;
  title: string;
  goPrevPageIfLast: boolean;
};

export default function DashboardMyPropertiesClient() {
  const locale = useLocale();
  const t = useTranslations("dashboardMyProperties");
  const tc = useTranslations("common");
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useBodyScrollLock({ locked: Boolean(deleteTarget) });

  const q = useQuery(myAnnouncementsListQuery(locale, page));
  const deleteM = useDeleteAnnouncementMutation(locale);

  async function confirmDelete() {
    if (!deleteTarget?.id) return;
    setDeleteError(null);
    try {
      await deleteM.mutateAsync({
        announcementId: deleteTarget.id,
        confirmed: true,
      });
      const goPrev = deleteTarget.goPrevPageIfLast;
      setDeleteTarget(null);
      if (goPrev) setPage((p) => Math.max(1, p - 1));
    } catch (err) {
      setDeleteError(getAxiosErrorMessage(err, tc("requestFailed")));
    }
  }

  function announcementStatusLabel(status: MyAnnouncementItem["status"]) {
    if (status === 1) return { label: t("statusPublished"), active: true as const };
    if (status === 0) return { label: t("statusPending"), active: false as const };
    return { label: tc("dash"), active: false as const };
  }

  function openDeleteModal(e: React.MouseEvent, payload: DeleteTarget) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget(payload);
  }

  const items = q.data?.data ?? [];
  const meta = q.data?.meta;
  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;
  const total = meta?.total ?? 0;

  return (
    <FadeIn>
    <div className={wgBoxCls}>
      {q.isError ? (
        <p className="mb-4 text-[#c0392b]">
          {t("loadError")}
        </p>
      ) : null}
      {deleteError ? (
        <p role="alert" className="mb-4 text-[#c0392b]">
          {deleteError}
        </p>
      ) : null}

      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0">
        <div className="min-w-[1420px]">
          <div className="mb-0 flex gap-[53px] rounded-2xl bg-[#F9F9F9] px-[53px] py-[31px]">
            <div className="w-[500px] shrink-0 text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
              {t("colListing")}
            </div>
            <div className="w-[150px] shrink-0 text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
              {t("colCheckInOut")}
            </div>
            <div className="w-[150px] shrink-0 text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
              {t("colStatus")}
            </div>
            <div className="w-[150px] shrink-0 text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
              {t("colCapacity")}
            </div>
            <div className="w-[150px] shrink-0 text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
              {t("colActions")}
            </div>
          </div>

          {q.isPending ? (
            <p className="py-6 text-[var(--Text)]">{t("loading")}</p>
          ) : items.length === 0 ? (
            <p className="py-6 text-[var(--Secondary)]">{t("empty")}</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {items.map((row) => {
                const imgSrc = absoluteStorageUrl(row.media?.cover_image);
                const street = row.address?.street;
                const d = row.detail;
                const st = announcementStatusLabel(row.status);
                const isOnlyRowOnPage = items.length === 1;
                const goPrevAfterDelete = isOnlyRowOnPage && page > 1;

                return (
                  <li key={row.id} className="border-b border-[var(--Border)] last:border-b-0">
                    <div className="flex items-center gap-[53px] px-[54px] py-10">
                      <div className="w-[500px] shrink-0">
                        <div className="flex items-stretch gap-5">
                          <div className="h-auto min-h-[128.57px] w-[150px] shrink-0 overflow-hidden self-stretch rounded-xl">
                            <DashboardPropertyThumb src={imgSrc} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 mt-[15px] text-[19px] font-medium leading-7 text-[var(--Third)]">
                              {row.price ? `${row.price} AZN` : tc("dash")}
                            </div>
                            <div className="mb-[11px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                              {row.title}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <MapPin
                                className="h-5 w-5 shrink-0 text-[var(--Text)]"
                                strokeWidth={1.75}
                                aria-hidden
                              />
                              <p className="m-0 text-base font-normal leading-6 text-[var(--Secondary)]">
                                {street || tc("dash")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[150px] shrink-0 text-base text-[var(--Secondary)]">
                        <p className="m-0">
                          {row.check_in || tc("dash")} / {row.check_out || tc("dash")}
                        </p>
                      </div>
                      <div className="w-[150px] shrink-0">
                        <div
                          className="w-max rounded-[120px] px-[15px] text-[13px] font-normal leading-[29px] text-[var(--White)]"
                          style={
                            st.active
                              ? { backgroundColor: "var(--Third)" }
                              : { backgroundColor: "#9e9e9e", color: "#fff" }
                          }
                        >
                          {st.label}
                        </div>
                      </div>
                      <div className="w-[150px] shrink-0 text-base text-[var(--Secondary)]">
                        {d ? (
                          <p className="m-0 leading-snug">
                            {t("capacityLine", {
                              room: d.room,
                              bed: d.bedroom,
                              bath: d.bathroom,
                            })}
                            <br />
                            <small className="text-[var(--Text)]">
                              {t("maxGuests", { guest: d.guest })}
                            </small>
                          </p>
                        ) : (
                          <p className="m-0">{tc("dash")}</p>
                        )}
                      </div>
                      <div className="w-[150px] shrink-0">
                        <ul className="m-0 flex list-none items-center gap-2 p-0">
                          <li title={t("editTitle")}>
                            <Link
                              href={`/dashboard-edit-property/${row.id}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--Secondary)] transition-colors hover:bg-black/[0.06]"
                              aria-label={t("editAria")}
                            >
                              <Pencil className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                            </Link>
                          </li>
                          <li title={t("deleteTitle")}>
                            <button
                              type="button"
                              disabled={deleteM.isPending && deleteTarget?.id === row.id}
                              onClick={(e) =>
                                openDeleteModal(e, {
                                  id: row.id,
                                  title: row.title,
                                  goPrevPageIfLast: goPrevAfterDelete,
                                })
                              }
                              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-[var(--Secondary)] transition-colors hover:bg-black/[0.06] disabled:cursor-wait disabled:opacity-65"
                              aria-label={t("deleteAria")}
                            >
                              <Trash2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {!q.isPending && total > 0 && lastPage > 1 ? (
        <ul className="m-0 mt-10 flex list-none flex-wrap items-center justify-center gap-2 p-0">
          <li>
            <button
              type="button"
              className={btnPrimaryCls}
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label={tc("prevPage")}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </li>
          <li>
            <span className="px-3 text-sm text-[var(--Secondary)]">
              {tc("pageOfTotal", { current: currentPage, last: lastPage, total })}
            </span>
          </li>
          <li>
            <button
              type="button"
              className={btnPrimaryCls}
              disabled={currentPage >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              aria-label={tc("nextPage")}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </li>
        </ul>
      ) : null}

      {deleteTarget ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-announcement-modal-title"
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-900/45 p-4"
        >
          <div className="w-full max-w-[520px] rounded-2xl bg-[var(--White)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            <h4 id="delete-announcement-modal-title" className="mb-2.5 text-lg font-semibold text-[var(--Secondary)]">
              {t("deleteConfirmTitle")}
            </h4>
            <p className="mb-5 text-[#4b5563]">
              {t("deleteConfirmBody", { title: deleteTarget.title })}
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                className={btnDefaultCls}
                onClick={() => setDeleteTarget(null)}
                disabled={deleteM.isPending}
              >
                {t("deleteCancel")}
              </button>
              <button
                type="button"
                className={`${btnPrimaryCls} h-11 min-w-[120px] px-[26px]`}
                onClick={() => void confirmDelete()}
                disabled={deleteM.isPending}
              >
                {deleteM.isPending ? t("deletePending") : t("deleteSubmit")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    </FadeIn>
  );
}
