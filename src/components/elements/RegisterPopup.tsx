"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import {
  useRegisterMutation,
  useVerifyCodeMutation,
} from "@/services/client/auth/mutations";
import { getAxiosErrorMessage } from "@/services/client/auth/apiMessage";
import OtpSixDigitBlock from "@/components/elements/OtpSixDigitBlock";

const AUTH_SIDE_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80";

const inputCls =
  "w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 py-3 text-[15px] text-[var(--Secondary)] outline-none placeholder:text-[#999] focus:border-[var(--Primary)]";

const btnPrimaryCls =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--Primary)] px-4 py-3.5 text-[15px] font-medium text-[var(--White)] transition-opacity disabled:opacity-50";

export default function RegisterPopup({
  isRegister,
  handleRegister,
  handleLogin,
}: {
  isRegister: boolean;
  handleRegister: () => void;
  handleLogin: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("auth");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpResetKey, setOtpResetKey] = useState(0);
  const [formError, setFormError] = useState("");

  const registerMutation = useRegisterMutation(locale);
  const verifyMutation = useVerifyCodeMutation(locale);

  const closeModal = useCallback(() => {
    setStep("form");
    setFormError("");
    setName("");
    setEmail("");
    setMobile("");
    setPassword("");
    setPassword2("");
    setOtpCode("");
    setOtpResetKey(0);
    handleRegister();
  }, [handleRegister]);

  useEffect(() => {
    if (!isRegister) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isRegister, closeModal]);

  const onSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (password !== password2) {
      setFormError(t("passwordMismatch"));
      return;
    }
    registerMutation.mutate(
      { name, email, mobile, password, password_confirmation: password2 },
      {
        onSuccess: () => {
          setFormError("");
          setOtpCode("");
          setOtpResetKey((k) => k + 1);
          setStep("verify");
        },
        onError: (err) =>
          setFormError(getAxiosErrorMessage(err, t("registerFailed"))),
      },
    );
  };

  const onSubmitVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (otpCode.length !== 6 || !email.trim()) {
      setFormError(t("otpLength"));
      return;
    }
    verifyMutation.mutate(
      { email: email.trim(), code: otpCode },
      {
        onSuccess: () => closeModal(),
        onError: (err) =>
          setFormError(getAxiosErrorMessage(err, t("otpWrong"))),
      },
    );
  };

  const onResendRegisterOtp = () => {
    registerMutation.mutate(
      { name, email, mobile, password, password_confirmation: password2 },
      {
        onSuccess: () => {
          setFormError("");
          setOtpCode("");
          setOtpResetKey((k) => k + 1);
        },
        onError: (err) =>
          setFormError(getAxiosErrorMessage(err, t("resendFailed"))),
      },
    );
  };

  const busy = registerMutation.isPending || verifyMutation.isPending;

  if (!isRegister) return null;

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
        aria-labelledby="register-modal-title"
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
          {step === "form" && (
            <>
              <p className="mb-1 text-xs opacity-75">{t("step12")}</p>
              <h4
                id="register-modal-title"
                className="mb-6 text-xl font-semibold text-[var(--Secondary)]"
              >
                {t("registerTitle")}
              </h4>
              <form className="flex flex-col gap-4" onSubmit={onSubmitRegister}>
                {formError ? (
                  <p className="text-sm text-red-600">{formError}</p>
                ) : null}
                <fieldset className="m-0 border-0 p-0">
                  <input
                    type="text"
                    placeholder={t("name")}
                    name="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    required
                    className={inputCls}
                  />
                </fieldset>
                <fieldset className="m-0 border-0 p-0">
                  <input
                    type="email"
                    placeholder={t("email")}
                    name="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                    className={inputCls}
                  />
                </fieldset>
                <fieldset className="m-0 border-0 p-0">
                  <input
                    type="tel"
                    placeholder={t("mobile")}
                    name="mobile"
                    value={mobile}
                    onChange={(ev) => setMobile(ev.target.value)}
                    required
                    className={inputCls}
                  />
                </fieldset>
                <fieldset className="m-0 border-0 p-0">
                  <input
                    type="password"
                    placeholder={t("password")}
                    name="password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    required
                    className={inputCls}
                  />
                </fieldset>
                <fieldset className="m-0 border-0 p-0">
                  <input
                    type="password"
                    placeholder={t("retypePassword")}
                    name="password_confirmation"
                    value={password2}
                    onChange={(ev) => setPassword2(ev.target.value)}
                    required
                    className={inputCls}
                  />
                </fieldset>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-[var(--Text)]">
                  <input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 rounded" />
                  <span>{t("termsAgree")}</span>
                </label>
                <button className={btnPrimaryCls} type="submit" disabled={busy}>
                  {t("registerCta")}
                </button>
              </form>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-sm text-[var(--Text)]">
                <span>{t("haveAccount")}</span>
                <button
                  type="button"
                  className="border-0 bg-transparent p-0 font-medium text-[var(--Primary)] underline"
                  onClick={() => {
                    handleRegister();
                    handleLogin();
                  }}
                >
                  {t("logIn")}
                </button>
              </div>
            </>
          )}

          {step === "verify" && (
            <>
              <p className="mb-1 text-xs opacity-75">{t("step22")}</p>
              <h4 className="mb-2 text-xl font-semibold text-[var(--Secondary)]">
                {t("emailVerifyTitle")}
              </h4>
              <p className="mb-3 text-sm text-[var(--Text)]">{t("emailVerifyHint")}</p>
              {email ? (
                <p className="mb-4 rounded-lg bg-[var(--Border)] px-3 py-2.5 text-sm text-[var(--Secondary)]">
                  {t("codeSentTo")} <strong>{email}</strong>
                </p>
              ) : null}
              <form className="flex flex-col gap-4" onSubmit={onSubmitVerify}>
                <OtpSixDigitBlock
                  key={otpResetKey}
                  onCodeChange={setOtpCode}
                  onResend={onResendRegisterOtp}
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
                  disabled={busy || otpCode.length !== 6}
                >
                  {t("completeRegister")}
                </button>
                <button
                  type="button"
                  className="border-0 bg-transparent p-0 text-sm text-[var(--Secondary)] underline"
                  onClick={() => {
                    setStep("form");
                    setFormError("");
                    setOtpCode("");
                  }}
                >
                  {t("backToForm")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
