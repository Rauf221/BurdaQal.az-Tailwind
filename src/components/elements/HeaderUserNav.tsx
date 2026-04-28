"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { routing } from "@/i18n/routing";
import { useLogoutMutation } from "@/services/client/auth/mutations";
import { getUserProfileQuery } from "@/services/client/auth/queries";
import { pickUserDisplay } from "@/services/client/auth/userDisplay";
import { parseUserProfilePayload, resolveUserMediaUrl } from "@/services/client/auth/profileParse";
import ReverseHoverHeaderLoginPill from "@/components/elements/ReverseHoverHeaderLoginPill";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export type HeaderUserNavProps = {
  handleLogin: () => void;
  inverse?: boolean;
  accountMenuTheme?: "dark" | "green";
  placement?: "header" | "mobile";
  onAfterNavigate?: () => void;
};

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M20 21C20 17.134 16.4183 14 12 14C7.58172 14 4 17.134 4 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function homeHref(locale: string): string {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

export default function HeaderUserNav({
  handleLogin,
  inverse = false,
  accountMenuTheme = "green",
  placement = "header",
  onAfterNavigate,
}: HeaderUserNavProps) {
  const locale = useLocale();
  const t = useTranslations("headerUser");
  const tc = useTranslations("common");
  const isAuthed = useAuthSession();
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const logoutMutation = useLogoutMutation(locale);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const { data: profilePayload, isPending } = useQuery({
    ...getUserProfileQuery(locale),
    enabled: isAuthed,
  });

  const display =
    isAuthed && isPending
      ? { title: "…" }
      : pickUserDisplay(profilePayload);

  const avatarUrl = (() => {
    if (avatarFailed) return null;
    const p = parseUserProfilePayload(profilePayload);
    return resolveUserMediaUrl(p.imageUrl);
  })();

  const initial =
    display.title && display.title !== "…" ? display.title.trim().slice(0, 1).toUpperCase() : "";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const go = () => {
    setOpen(false);
    onAfterNavigate?.();
  };

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setLogoutOpen(true);
  };

  const confirmLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setLogoutOpen(false);
        go();
        if (typeof window !== "undefined") {
          window.location.href = homeHref(locale);
        }
      },
    });
  };

  if (placement === "mobile") {
    return (
      <div className="header-user-mobile">
        {!isAuthed ? (
          <button
            type="button"
            className="header-user-mobile__login"
            onClick={() => {
              handleLogin();
              onAfterNavigate?.();
            }}
          >
            {t("loginRegister")}
          </button>
        ) : (
          <div>
            <p className="header-user-mobile__name">{display.title}</p>
            {display.subtitle ? (
              <p className="header-user-mobile__email">{display.subtitle}</p>
            ) : null}
            <ul>
              <li>
                <Link href="/dashboard" onClick={go}>
                  {t("dashboard")}
                </Link>
              </li>
              <li>
                <Link href="/dashboard-my-profile" onClick={go}>
                  {t("myProfile")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={logoutMutation.isPending}
                  className="disabled:opacity-60"
                >
                  {logoutMutation.isPending ? t("logoutPending") : t("logout")}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  const ring = inverse
    ? "border-white text-white"
    : "border-[#1A1A1A] text-[#1A1A1A]";

  const nameCls = inverse
    ? "text-white"
    : "text-[#1A1A1A]";

  const themePrimary =
    accountMenuTheme === "dark"
      ? "border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:border-[#111] hover:bg-[#111]"
      : "border border-[#8bd457] bg-[#8bd457] text-white hover:brightness-[0.96]";

  const themeOutline =
    accountMenuTheme === "dark"
      ? "border border-[#1A1A1A] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
      : "border border-[#8bd457] bg-white text-[#8bd457] hover:bg-[rgba(139,212,87,0.12)]";

  if (!isAuthed) {
    return (
      <ReverseHoverHeaderLoginPill
        label={t("loginCta")}
        onClick={handleLogin}
        inverse={inverse}
      />
    );
  }

  return (
    <div ref={wrapRef} className="header-user-nav-wrap relative z-40">
      <button
        type="button"
        className={
          "header-user-login header-user-login--btn box-border flex max-w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 bg-transparent shadow-none appearance-none " +
          (inverse ? "min-w-0" : "")
        }
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div
          className={
            "header-user flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-full border " +
            ring
          }
        >
          <div className="icon flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}  
                alt=""
                className="h-[33px] w-[33px] rounded-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : initial ? (
              <span className="text-[15px] font-semibold leading-none">{initial}</span>
            ) : (
              <UserIcon />
            )}
          </div>
        </div>
        <span
          className={
            "name max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium leading-[19px] min-[1200px]:max-w-[180px] " +
            nameCls
          }
        >
          {display.title}
        </span>
      </button>
      {open ? (
        <div
          className={
            "header-user-dropdown absolute right-0 top-[calc(100%+8px)] z-[10050] min-w-[260px] rounded-xl bg-white p-4 text-left text-[#1A1A1A] shadow-[0_8px_30px_rgba(0,0,0,0.12)] " +
            (accountMenuTheme === "dark"
              ? "header-user-dropdown--theme-dark"
              : "header-user-dropdown--theme-green")
          }
        >
          <p className="header-user-dropdown__title m-0 mb-1 text-[15px] font-semibold text-[#1A1A1A]">
            {display.title}
          </p>
          {display.subtitle ? (
            <p className="header-user-dropdown__email m-0 mb-3 text-[13px] text-[#666]">
              {display.subtitle}
            </p>
          ) : (
            <div className="mb-3" />
          )}
          <div className="header-user-dropdown__actions flex flex-col gap-2">
            <Link
              href="/dashboard-my-profile"
              className={
                "header-user-dropdown__action flex min-h-[41px] w-full items-center justify-center rounded-full px-3.5 text-center text-[15px] font-medium no-underline transition-colors " +
                themePrimary
              }
              onClick={go}
            >
              {t("myProfile")}
            </Link>
            <Link
              href="/dashboard"
              className={
                "header-user-dropdown__action flex min-h-[41px] w-full items-center justify-center rounded-full px-3.5 text-center text-[15px] font-medium no-underline transition-colors " +
                themePrimary
              }
              onClick={go}
            >
              {t("dashboard")}
            </Link>
            <button
              type="button"
              className={
                "header-user-dropdown__action header-user-dropdown__action--outline box-border flex min-h-[41px] w-full cursor-pointer items-center justify-center rounded-full px-3.5 text-center text-[15px] font-medium transition-colors disabled:opacity-60 " +
                themeOutline
              }
              onClick={onLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? t("logoutPending") : t("logout")}
            </button>
          </div>
        </div>
      ) : null}

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
