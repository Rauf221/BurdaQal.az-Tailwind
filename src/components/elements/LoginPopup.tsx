"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X } from "lucide-react";
import { clearPasswordResetBearerToken } from "@/lib/api/client";
import {
  useForgotPasswordMutation,
  useForgotVerifyCodeMutation,
  useLoginMutation,
  usePasswordResetMutation,
} from "@/services/client/auth/mutations";
import { getAxiosErrorMessage } from "@/services/client/auth/apiMessage";
import OtpSixDigitBlock from "@/components/elements/OtpSixDigitBlock";

const AUTH_SIDE_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80";

const inputCls =
  "w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 py-3 text-[15px] text-[var(--Secondary)] outline-none placeholder:text-[#999] focus:border-[var(--Primary)]";

const btnPrimaryCls =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--Primary)] px-4 py-3.5 text-[15px] font-medium text-[var(--White)] transition-opacity disabled:opacity-50";

type View =
  | "login"
  | "forgot-request"
  | "forgot-verify"
  | "forgot-reset"
  | "reset-success";

export default function LoginPopup({
  isLogin,
  handleLogin,
  handleRegister,
}: {
  isLogin: boolean;
  handleLogin: () => void;
  isRegister: boolean;
  handleRegister: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("auth");
  const [view, setView] = useState<View>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [forgotOtpResetKey, setForgotOtpResetKey] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [formError, setFormError] = useState("");

  const loginMutation = useLoginMutation(locale);
  const forgotMutation = useForgotPasswordMutation(locale);
  const verifyForgotMutation = useForgotVerifyCodeMutation(locale);
  const resetMutation = usePasswordResetMutation(locale);

  const resetForgotState = useCallback(() => {
    clearPasswordResetBearerToken();
    setForgotEmail("");
    setForgotOtpCode("");
    setForgotOtpResetKey(0);
    setNewPassword("");
    setNewPassword2("");
    setFormError("");
  }, []);

  const closeModal = useCallback(() => {
    setView("login");
    resetForgotState();
    setFormError("");
    setEmail("");
    setPassword("");
    handleLogin();
  }, [handleLogin, resetForgotState]);

  useEffect(() => {
    if (!isLogin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isLogin, closeModal]);

  const onSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => closeModal(),
        onError: (err) =>
          setFormError(getAxiosErrorMessage(err, t("loginFailed"))),
      },
    );
  };

  const onSubmitForgotEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!forgotEmail.trim()) {
      setFormError(t("emailRequired"));
      return;
    }
    forgotMutation.mutate(forgotEmail.trim(), {
      onSuccess: () => {
        setForgotOtpResetKey((k) => k + 1);
        setView("forgot-verify");
      },
      onError: (err) =>
        setFormError(getAxiosErrorMessage(err, t("forgotSendFailed"))),
    });
  };

  const onSubmitForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (forgotOtpCode.length !== 6 || !forgotEmail.trim()) {
      setFormError(t("otpLength"));
      return;
    }
    verifyForgotMutation.mutate(
      { email: forgotEmail.trim(), code: forgotOtpCode },
      {
        onSuccess: () => setView("forgot-reset"),
        onError: (err) =>
          setFormError(getAxiosErrorMessage(err, t("otpWrong"))),
      },
    );
  };

  const onResendForgotOtp = () => {
    forgotMutation.mutate(forgotEmail.trim(), {
      onSuccess: () => {
        setFormError("");
        setForgotOtpCode("");
        setForgotOtpResetKey((k) => k + 1);
      },
      onError: (err) =>
        setFormError(getAxiosErrorMessage(err, t("resendFailed"))),
    });
  };

  const onSubmitForgotReset = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (newPassword !== newPassword2) {
      setFormError(t("passwordMismatch"));
      return;
    }
    resetMutation.mutate(
      {
        password: newPassword,
        password_confirmation: newPassword2,
        code: forgotOtpCode,
        email: forgotEmail.trim(),
      },
      {
        onSuccess: () => {
          const savedEmail = forgotEmail.trim();
          resetForgotState();
          setFormError("");
          setPassword("");
          if (savedEmail) setEmail(savedEmail);
          setView("reset-success");
        },
        onError: (err) =>
          setFormError(getAxiosErrorMessage(err, t("resetFailed"))),
      },
    );
  };

  const busy =
    loginMutation.isPending ||
    forgotMutation.isPending ||
    verifyForgotMutation.isPending ||
    resetMutation.isPending;

  if (!isLogin) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      role="presentation"
      onClick={closeModal}
    >
        <div
          className="relative z-[10001] flex w-full max-w-[920px] overflow-hidden rounded-2xl bg-[var(--White)] shadow-2xl max-md:max-h-[90vh] max-md:flex-col md:min-h-[480px] md:flex-row"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-[var(--Secondary)] hover:bg-black/10"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-32 w-full shrink-0 md:hidden">
            <img
              src={AUTH_SIDE_IMAGE}
              alt=""
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>

          <div className="relative hidden w-full shrink-0 md:flex md:w-[42%] md:flex-col">
            <img
              src={AUTH_SIDE_IMAGE}
              alt=""
              className="h-full min-h-[200px] w-full object-cover md:min-h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-[var(--White)]">
              <p className="text-lg font-medium leading-snug md:text-xl">
                {t("sideCaption")}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col overflow-y-auto p-6 md:p-10">
            {view === "login" && (
              <>
                <h4
                  id="login-modal-title"
                  className="mb-6 text-xl font-semibold text-[var(--Secondary)]"
                >
                  {t("loginTitle")}
                </h4>
                <form className="flex flex-col gap-4" onSubmit={onSubmitLogin}>
                  {formError ? (
                    <p className="text-sm text-red-600">{formError}</p>
                  ) : null}
                  <fieldset className="m-0 border-0 p-0">
                    <input
                      type="email"
                      placeholder={t("email")}
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      required
                      className={inputCls}
                    />
                  </fieldset>
                  <fieldset className="m-0 border-0 p-0">
                    <input
                      type="password"
                      placeholder={t("password")}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      required
                      className={inputCls}
                    />
                  </fieldset>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--Text)]">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                      <span>{t("rememberMe")}</span>
                    </label>
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 text-sm text-[var(--Primary)] underline"
                      onClick={() => {
                        setFormError("");
                        setView("forgot-request");
                      }}
                    >
                      {t("lostPassword")}
                    </button>
                  </div>
                  <div>
                    <button className={btnPrimaryCls} type="submit" disabled={busy}>
                      {t("loginCta")}
                    </button>
                  </div>
                </form>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-sm text-[var(--Text)]">
                  <span>{t("notMember")}</span>
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 font-medium text-[var(--Primary)] underline"
                    onClick={() => {
                      handleRegister();
                      handleLogin();
                    }}
                  >
                    {t("registerHere")}
                  </button>
                </div>
                <ul className="mt-6 flex list-none justify-center gap-3 p-0">
                  <li>
                    <Link
                      href="/"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--Border)] text-[var(--Secondary)] hover:bg-[#f9f9f9]"
                    >
                      G
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--Border)] text-[var(--Secondary)] hover:bg-[#f9f9f9]"
                    >
                      X
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--Border)] text-[var(--Secondary)] hover:bg-[#f9f9f9]"
                    >
                      f
                    </Link>
                  </li>
                </ul>
              </>
            )}

            {view === "forgot-request" && (
              <>
                <h4 className="mb-2 text-xl font-semibold text-[var(--Secondary)]">
                  {t("forgotTitle")}
                </h4>
                <p className="mb-4 text-sm text-[var(--Text)]">
                  {t("forgotHint")}
                </p>
                <form className="flex flex-col gap-4" onSubmit={onSubmitForgotEmail}>
                  {formError ? (
                    <p className="text-sm text-red-600">{formError}</p>
                  ) : null}
                  <fieldset className="m-0 border-0 p-0">
                    <input
                      type="email"
                      placeholder={t("email")}
                      value={forgotEmail}
                      onChange={(ev) => setForgotEmail(ev.target.value)}
                      required
                      className={inputCls}
                    />
                  </fieldset>
                  <button className={btnPrimaryCls} type="submit" disabled={busy}>
                    {t("sendCode")}
                  </button>
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-sm text-[var(--Secondary)] underline"
                    onClick={() => {
                      setView("login");
                      resetForgotState();
                    }}
                  >
                    {t("backToLogin")}
                  </button>
                </form>
              </>
            )}

            {view === "forgot-verify" && (
              <>
                <h4 className="mb-2 text-xl font-semibold text-[var(--Secondary)]">
                  {t("otpTitle")}
                </h4>
                <p className="mb-3 text-sm text-[var(--Text)]">{t("otpHint")}</p>
                {forgotEmail ? (
                  <p className="mb-3 rounded-lg bg-[var(--Border)] px-3 py-2.5 text-sm text-[var(--Secondary)]">
                    {t("codeSentTo")}{" "}
                    <strong>{forgotEmail}</strong>
                  </p>
                ) : null}
                <form className="flex flex-col gap-4" onSubmit={onSubmitForgotVerify}>
                  <OtpSixDigitBlock
                    key={forgotOtpResetKey}
                    onCodeChange={setForgotOtpCode}
                    onResend={onResendForgotOtp}
                    error={formError}
                    disabled={busy}
                    onClearError={() => setFormError("")}
                    resendLabel={t("resend")}
                    resendWaitLabel={t("resend")}
                    timerExpiredSuffix={t("codeNotReceived")}
                  />
                  <button
                    className={btnPrimaryCls}
                    type="submit"
                    disabled={busy || forgotOtpCode.length !== 6}
                  >
                    {t("verifyCta")}
                  </button>
                  <button
                    type="button"
                    className="border-0 bg-transparent p-0 text-sm text-[var(--Secondary)] underline"
                    onClick={() => setView("forgot-request")}
                  >
                    {t("back")}
                  </button>
                </form>
              </>
            )}

            {view === "reset-success" && (
              <>
                <h4 className="mb-3 text-xl font-semibold text-[var(--Secondary)]">
                  {t("successTitle")}
                </h4>
                <p className="mb-6 text-[15px] leading-relaxed text-[var(--Text)]">
                  {t("resetSuccessBody")}
                </p>
                <button
                  type="button"
                  className={btnPrimaryCls}
                  onClick={() => setView("login")}
                >
                  {t("goToLogin")}
                </button>
              </>
            )}

            {view === "forgot-reset" && (
              <>
                <h4 className="mb-4 text-xl font-semibold text-[var(--Secondary)]">
                  {t("newPasswordTitle")}
                </h4>
                <form className="flex flex-col gap-4" onSubmit={onSubmitForgotReset}>
                  {formError ? (
                    <p className="text-sm text-red-600">{formError}</p>
                  ) : null}
                  <fieldset className="m-0 border-0 p-0">
                    <input
                      type="password"
                      placeholder={t("newPassword")}
                      value={newPassword}
                      onChange={(ev) => setNewPassword(ev.target.value)}
                      required
                      className={inputCls}
                    />
                  </fieldset>
                  <fieldset className="m-0 border-0 p-0">
                    <input
                      type="password"
                      placeholder={t("confirmPassword")}
                      value={newPassword2}
                      onChange={(ev) => setNewPassword2(ev.target.value)}
                      required
                      className={inputCls}
                    />
                  </fieldset>
                  <button className={btnPrimaryCls} type="submit" disabled={busy}>
                    {t("updatePassword")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
    </div>
  );
}
