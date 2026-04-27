"use client";

import { useReverseHoverLetterAnim } from "@/components/elements/reverse-hover/useReverseHoverLetterAnim";

type ReverseHoverHeaderLoginPillProps = {
  label: string;
  onClick: () => void;
  /** Tünd hero: ağ sərhəd/mətn; ağ header: tünd sərhəd/mətn */
  inverse?: boolean;
};

/**
 * Elan CTA ilə eyni hərf hover animasiyası; tünd fonda (inverse) və ya ağ fonda ağ vərəq + qara mətn.
 */
export default function ReverseHoverHeaderLoginPill({
  label,
  onClick,
  inverse = false,
}: ReverseHoverHeaderLoginPillProps) {
  const { letters, innerRef, animIn, animOut } = useReverseHoverLetterAnim(label);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={animIn}
      onMouseLeave={animOut}
      className={
        "jh-reverse-ghost-pill inline-flex max-w-full cursor-pointer appearance-none border-0 bg-transparent p-0 outline-none " +
        (inverse ? "jh-reverse-ghost-pill--inverse" : "jh-reverse-ghost-pill--light")
      }
    >
      <span
        ref={innerRef}
        className={
          "relative inline-flex h-[41px] min-h-[41px] items-center justify-center overflow-hidden rounded-[120px] border px-6 text-base font-medium leading-[1.19] outline-none transition-[background,box-shadow,border-color] duration-[280ms] " +
          (inverse
            ? "border-white bg-transparent hover:border-[var(--White)] hover:bg-[var(--White)]"
            : "border-[#1A1A1A] bg-transparent hover:border-[var(--Secondary)] hover:bg-[var(--White)] ")
        }
      >
        <span className="jh-reverse-btn__word relative z-[1] flex h-[1.3em] items-center justify-center overflow-hidden ">
          {letters.map((ch, i) => (
            <span key={`${i}-${ch}`} className="jh-reverse-btn__letter inline-block ">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
