"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Upload, X } from "lucide-react";
import OtpSixDigitBlock from "@/components/elements/OtpSixDigitBlock";
import { useAuthSession } from "@/lib/auth/useAuthSession";
import { getAxiosErrorMessage } from "@/services/client/auth/apiMessage";
import {
  usePasswordChangeMutation,
  useSendEmailOtpMutation,
  useUpdateProfileMutation,
  useVerifyEmailOtpMutation,
} from "@/services/client/auth/mutations";
import {
  parseUserProfilePayload,
  resolveUserMediaUrl,
} from "@/services/client/auth/profileParse";
import { getUserProfileQuery } from "@/services/client/auth/queries";
import { FadeIn } from "@/components/motion";

const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80";

const wgBoxCls =
  "mb-20 rounded-3xl border border-[var(--Border)] bg-[var(--White)] py-[39px] pr-[39px] pl-11 last:mb-0";
const h4Cls = "-mt-2 mb-[33px] text-[22px] font-semibold leading-8 text-[var(--Secondary)]";
const fieldCls =
  "box-border w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-[19px] py-3 text-base text-[var(--Secondary)] outline-none focus:border-[var(--Fourth)]";
const labelCls = "mb-2.5 block text-[17px] font-semibold text-[var(--Secondary)]";
const btnPrimaryCls =
  "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[var(--Primary)] px-[26px] text-[15px] font-medium text-[var(--White)] transition-colors hover:bg-[#6fb042] disabled:cursor-not-allowed disabled:opacity-60";

function normalizeEmail(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

type ProfilePayload = {
  name: string;
  email: string;
  mobile: string;
  image: File | null;
};

export default function DashboardMyProfileClient() {
  const locale = useLocale();
  const t = useTranslations("dashboardMyProfile");
  const isAuthed = useAuthSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [savedEmailRaw, setSavedEmailRaw] = useState("");
  const [baselineEmailNorm, setBaselineEmailNorm] = useState("");
  const [serverImagePath, setServerImagePath] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [profileError, setProfileError] = useState("");
  const [profileOk, setProfileOk] = useState("");

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpHint, setOtpHint] = useState("");
  const [otpResendKey, setOtpResendKey] = useState(0);
  const [pendingProfile, setPendingProfile] = useState<ProfilePayload | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState("");

  const { data: profilePayload, isPending, isError, error, isFetched } = useQuery({
    ...getUserProfileQuery(locale),
    enabled: isAuthed,
  });

  useEffect(() => {
    if (!profilePayload) return;
    const p = parseUserProfilePayload(profilePayload);
    setName(p.name);
    const em = p.email || "";
    setEmail(em);
    setSavedEmailRaw(em);
    setBaselineEmailNorm(normalizeEmail(em));
    setMobile(p.mobile);
    setServerImagePath(p.imageUrl);
    setImageFile(null);
    setImagePreview(null);
  }, [profilePayload]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const sendEmailOtpMutation = useSendEmailOtpMutation(locale);
  const verifyEmailOtpMutation = useVerifyEmailOtpMutation(locale);
  const updateMutation = useUpdateProfileMutation(locale);
  const passwordMutation = usePasswordChangeMutation(locale);

  const resolvedServer = resolveUserMediaUrl(serverImagePath);
  const avatarSrc = imagePreview || resolvedServer || PLACEHOLDER_AVATAR;

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (f) {
      setImagePreview(URL.createObjectURL(f));
    } else {
      setImagePreview(null);
    }
  };

  const applyProfileSaveSuccess = (payload: { email: string }) => {
    setProfileOk(t("profileOk"));
    setSavedEmailRaw(payload.email.trim());
    setBaselineEmailNorm(normalizeEmail(payload.email));
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const runProfileUpdate = (payload: ProfilePayload) => {
    updateMutation.mutate(payload, {
      onSuccess: () => applyProfileSaveSuccess(payload),
      onError: (err) => {
        setProfileError(getAxiosErrorMessage(err, t("profileErr")));
      },
    });
  };

  const onSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileOk("");

    const payload: ProfilePayload = {
      name,
      email,
      mobile,
      image: imageFile,
    };

    if (normalizeEmail(email) === baselineEmailNorm) {
      runProfileUpdate(payload);
      return;
    }

    setPendingProfile(payload);
    setOtpError("");
    setOtpHint(t("otpHintSent"));
    setOtpCode("");
    setOtpResendKey((k) => k + 1);
    setOtpModalOpen(true);
    setProfileOk("");

    queueMicrotask(() => {
      sendEmailOtpMutation.mutate(
        { email: payload.email },
        {
          onSuccess: () => {
            setOtpHint(t("otpHintNew"));
          },
          onError: (err) => {
            setOtpError(getAxiosErrorMessage(err, t("otpSendErr")));
          },
        },
      );
    });
  };

  const closeOtpModal = () => {
    setOtpModalOpen(false);
    setOtpError("");
    setOtpHint("");
    setOtpCode("");
    setPendingProfile(null);
    setEmail(savedEmailRaw);
  };

  const onConfirmEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (!pendingProfile) return;
    if (otpCode.length !== 6) {
      setOtpError(t("otpLenErr"));
      return;
    }
    const toSave: ProfilePayload = {
      name: pendingProfile.name,
      email: pendingProfile.email.trim(),
      mobile: pendingProfile.mobile,
      image: pendingProfile.image,
    };
    verifyEmailOtpMutation.mutate(
      { code: otpCode },
      {
        onSuccess: () => {
          setOtpModalOpen(false);
          setOtpError("");
          setOtpHint("");
          setOtpCode("");
          setPendingProfile(null);
          queueMicrotask(() => {
            updateMutation.mutate(toSave, {
              onSuccess: () => {
                applyProfileSaveSuccess({ ...toSave, email: toSave.email });
                setProfileOk(t("otpProfileOk"));
                setEmail(toSave.email);
              },
              onError: (err) => {
                setProfileError(
                  getAxiosErrorMessage(err, t("otpProfilePartial")),
                );
              },
            });
          });
        },
        onError: (err) => {
          setOtpError(getAxiosErrorMessage(err, t("otpWrong")));
        },
      },
    );
  };

  const onResendEmailOtp = () => {
    if (!pendingProfile?.email) return;
    sendEmailOtpMutation.mutate(
      { email: pendingProfile.email },
      {
        onSuccess: () => {
          setOtpError("");
          setOtpHint(t("otpResentHint"));
          setOtpResendKey((k) => k + 1);
        },
        onError: (err) => {
          setOtpError(getAxiosErrorMessage(err, t("otpResendErr")));
        },
      },
    );
  };

  const onSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwOk("");
    if (newPassword !== newPassword2) {
      setPwError(t("pwMismatch"));
      return;
    }
    passwordMutation.mutate(
      {
        old_password: oldPassword,
        password: newPassword,
        password_confirmation: newPassword2,
      },
      {
        onSuccess: () => {
          setPwOk(t("pwOk"));
          setOldPassword("");
          setNewPassword("");
          setNewPassword2("");
        },
        onError: (err) => {
          setPwError(getAxiosErrorMessage(err, t("pwErr")));
        },
      },
    );
  };

  const busyProfile =
    updateMutation.isPending ||
    sendEmailOtpMutation.isPending ||
    verifyEmailOtpMutation.isPending;
  const busyPw = passwordMutation.isPending;
  const loadingProfile = isAuthed && isPending && !isFetched;

  if (!isAuthed) {
    return <p className="text-[15px] text-[var(--Text)]">{t("loginRequired")}</p>;
  }

  return (
    <>
      <FadeIn>
    <div>
      <div className={wgBoxCls}>
        <h4 className={h4Cls}>{t("sectionProfile")}</h4>
        <div className="flex flex-col gap-8">
          {loadingProfile ? (
            <p className="mb-4 text-sm text-[var(--Text)]">{t("loading")}</p>
          ) : null}
          {isError ? (
            <p className="mb-3 text-sm text-[#c0392b]">
              {getAxiosErrorMessage(error, t("fetchError"))}
            </p>
          ) : null}

          <div className="flex flex-wrap items-start gap-8 gap-y-6">
            <div className="relative h-[150px] w-[150px] shrink-0">
              <img
                src={avatarSrc}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
              <div
                className="pointer-events-none absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--Border)] bg-[var(--White)] shadow-sm"
                aria-hidden
              >
                <X className="h-4 w-4 text-[var(--Secondary)] opacity-40" strokeWidth={1.75} />
              </div>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="relative block cursor-pointer">
                <input
                  type="file"
                  name="image"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={onImageChange}
                  className="sr-only"
                />
                <span className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-xl border border-[var(--Primary)] bg-[var(--White)] px-[26px] text-[15px] font-medium text-black transition-colors hover:bg-[#D9B75A0D]">
                  {t("uploadImages")}
                  <Upload className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <p className="mt-2 text-sm leading-6 text-[var(--Text)]">{t("uploadHint")}</p>
              </label>
            </div>
          </div>

          <form className="flex flex-col gap-[30px]" onSubmit={onSubmitProfile}>
            {profileError ? (
              <p className="m-0 text-sm text-[#c0392b]">{profileError}</p>
            ) : null}
            {profileOk ? (
              <p className="m-0 text-sm text-[var(--Fourth)]">{profileOk}</p>
            ) : null}
            {normalizeEmail(email) !== baselineEmailNorm && baselineEmailNorm ? (
              <p className="m-0 text-[13px] text-[var(--Secondary)]">
                {t("emailChangeHint")}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="profile-name" className={labelCls}>
                  {t("name")}
                </label>
                <input
                  id="profile-name"
                  type="text"
                  placeholder={t("name")}
                  name="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  autoComplete="name"
                  required
                  className={fieldCls}
                />
              </fieldset>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="profile-email" className={labelCls}>
                  {t("email")}
                </label>
                <input
                  id="profile-email"
                  type="email"
                  placeholder={t("email")}
                  name="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  autoComplete="email"
                  required
                  className={fieldCls}
                />
              </fieldset>
            </div>
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="profile-mobile" className={labelCls}>
                  {t("phone")}
                </label>
                <input
                  id="profile-mobile"
                  type="tel"
                  placeholder={t("phone")}
                  name="mobile"
                  value={mobile}
                  onChange={(ev) => setMobile(ev.target.value)}
                  autoComplete="tel"
                  className={fieldCls}
                />
              </fieldset>
            </div>
            <div className="mt-2.5">
              <button
                type="submit"
                disabled={busyProfile || loadingProfile}
                className={btnPrimaryCls}
              >
                {t("saveProfile")}
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={wgBoxCls}>
        <h4 className={h4Cls}>{t("sectionPassword")}</h4>
        <form className="flex flex-col gap-[30px]" onSubmit={onSubmitPassword}>
          {pwError ? <p className="m-0 text-sm text-[#c0392b]">{pwError}</p> : null}
          {pwOk ? <p className="m-0 text-sm text-[var(--Fourth)]">{pwOk}</p> : null}
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <label htmlFor="pw-old" className={labelCls}>
              {t("oldPassword")}
            </label>
            <input
              id="pw-old"
              type="password"
              placeholder={t("oldPasswordPh")}
              name="old_password"
              value={oldPassword}
              onChange={(ev) => setOldPassword(ev.target.value)}
              autoComplete="current-password"
              required
              className={fieldCls}
            />
          </fieldset>
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <label htmlFor="pw-new" className={labelCls}>
                {t("newPassword")}
              </label>
              <input
                id="pw-new"
                type="password"
                placeholder={t("newPasswordPh")}
                name="password"
                value={newPassword}
                onChange={(ev) => setNewPassword(ev.target.value)}
                autoComplete="new-password"
                required
                className={fieldCls}
              />
            </fieldset>
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <label htmlFor="pw-new2" className={labelCls}>
                {t("repeat")}
              </label>
              <input
                id="pw-new2"
                type="password"
                placeholder={t("newPasswordRepeatPh")}
                name="password_confirmation"
                value={newPassword2}
                onChange={(ev) => setNewPassword2(ev.target.value)}
                autoComplete="new-password"
                required
                className={fieldCls}
              />
            </fieldset>
          </div>
          <div className="mt-2.5">
            <button type="submit" disabled={busyPw} className={btnPrimaryCls}>
              {t("changePassword")}
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
          </div>
        </form>
      </div>
    </div>
      </FadeIn>

      {otpModalOpen ? (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-otp-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={closeOtpModal}
            aria-label={t("close")}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--White)] shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full text-[var(--Secondary)] hover:bg-[#f5f5f5]"
              onClick={closeOtpModal}
              aria-label={t("close")}
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <div className="px-7 pb-6 pt-8">
              <h4 id="email-otp-title" className="mb-2 text-xl font-semibold text-[var(--Secondary)]">
                {t("otpTitle")}
              </h4>
              {otpHint ? (
                <p className="mb-3 text-sm text-[var(--Fourth)]">{otpHint}</p>
              ) : null}
              <p className="mb-4 text-sm text-[var(--Text)]">
                {t("otpBody", { email: pendingProfile?.email?.trim() ?? "" })}
              </p>
              <form onSubmit={onConfirmEmailOtp}>
                <OtpSixDigitBlock
                  key={otpResendKey}
                  onCodeChange={setOtpCode}
                  onResend={onResendEmailOtp}
                  error={otpError}
                  disabled={
                    verifyEmailOtpMutation.isPending ||
                    sendEmailOtpMutation.isPending ||
                    updateMutation.isPending
                  }
                  onClearError={() => setOtpError("")}
                />
                <div className="mt-4 w-full">
                  <button
                    type="submit"
                    className={`${btnPrimaryCls} w-full`}
                    disabled={
                      otpCode.length !== 6 ||
                      verifyEmailOtpMutation.isPending ||
                      sendEmailOtpMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
                    {t("otpConfirm")}
                    <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full cursor-pointer border-0 bg-transparent text-sm text-[var(--Secondary)] underline"
                  onClick={closeOtpModal}
                >
                  {t("cancel")}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
