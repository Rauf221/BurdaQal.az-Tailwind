"use client";

import { useEffect } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export type ConfirmModalProps = Readonly<{
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  confirmDestructive?: boolean;
  confirmPending?: boolean;
  onConfirm: () => void | Promise<void>;
}>;

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  cancelLabel,
  confirmLabel,
  confirmDestructive = true,
  confirmPending = false,
  onConfirm,
}: ConfirmModalProps) {
  useBodyScrollLock({ locked: open });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 md:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#ebf0f7] bg-white px-6 pb-6 pt-5 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.12)]"
      >
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-full border border-[#ebf0f7] bg-[#fafdff] text-[#32393f] transition-opacity hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 px-2 pb-2 pt-2">
          {icon ? (
            <div className="flex size-[72px] items-center justify-center rounded-full bg-[#fff1f0]">
              {icon}
            </div>
          ) : null}

          <p className="text-center text-[18px] font-medium leading-6 text-[#14171a]">
            {title}
          </p>
          {description ? (
            <p className="-mt-3 text-center text-sm leading-6 text-[#6b6e71]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-2xl bg-[#eaf1fa] px-4 py-3 text-base font-medium leading-6 text-[#14171a] transition-colors hover:bg-[#dfe9f6] disabled:opacity-60"
            disabled={confirmPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={confirmPending}
            onClick={() => void onConfirm()}
            className={[
              "cursor-pointer rounded-2xl px-4 py-3 text-base font-medium leading-6 text-white transition-colors disabled:opacity-60",
              confirmDestructive ? "bg-[#ff3b30] hover:bg-[#e8342a]" : "bg-[#8bd457] hover:brightness-[0.96]",
            ].join(" ")}
          >
            {confirmPending ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

