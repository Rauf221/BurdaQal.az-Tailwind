"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";

function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export type OtpSixDigitBlockProps = {
  onCodeChange?: (code: string) => void;
  onResend?: () => void;
  error?: string;
  disabled?: boolean;
  onClearError?: () => void;
  resendLabel?: string;
  resendWaitLabel?: string;
  timerExpiredSuffix?: string;
};

/**
 * Altı rəqəmli OTP: yapışdırma, gözləmə, yenidən göndər.
 * Yenidən başlatmaq üçün valideyn `key` dəyişir.
 */
export default function OtpSixDigitBlock({
  onCodeChange,
  onResend,
  error,
  disabled,
  onClearError,
  resendLabel,
  resendWaitLabel,
  timerExpiredSuffix,
}: OtpSixDigitBlockProps) {
  const t = useTranslations("otpBlock");
  const resendLbl = resendLabel ?? t("resend");
  const resendWaitLbl = resendWaitLabel ?? t("resendWait");
  const timerSuffix = timerExpiredSuffix ?? t("timerSuffix");
  const [otp, setOtp] = useState(() => Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const canResend = timer === 0;

  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const emitCode = (next: string[]) => {
    onCodeChange?.(next.join(""));
  };

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    if (error) onClearError?.();
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    emitCode(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const digits = pasted.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 6) {
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      emitCode(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend || !onResend) return;
    onResend();
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            autoComplete="one-time-code"
            className="h-12 w-11 rounded border border-[var(--Border)] text-center text-xl font-semibold outline-none focus:border-[var(--Primary)] disabled:opacity-50"
          />
        ))}
      </div>
      <div className="mb-2 text-center">
        <p className="m-0 text-sm font-semibold">{formatTimer(timer)}</p>
      </div>
      <div
        className={`text-center text-sm ${error ? "mb-2" : "mb-0"}`}
      >
        {timerSuffix}{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={disabled}
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendLbl}
          </button>
        ) : (
          <span className="opacity-70">{resendWaitLbl}</span>
        )}
      </div>
      {error ? (
        <p className="mb-2 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
