"use client";

import { useReverseHoverLetterAnim } from "@/components/elements/reverse-hover/useReverseHoverLetterAnim";
import { Link } from "@/i18n/navigation";

type ReverseHoverLetterLinkProps = {
  href: string;
  /** Tərcümə və ya sabit mətn — hər simvol ayrıca animasiya olunur */
  children: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};


export default function ReverseHoverLetterLink({
  href,
  children,
  className = "",
  onClick,
}: ReverseHoverLetterLinkProps) {
  const { letters, innerRef, animIn, animOut } = useReverseHoverLetterAnim(children);

  return (
    <Link
      href={href}
      className={`jh-reverse-btn-link inline-flex max-w-full no-underline ${className}`.trim()}
      onMouseEnter={animIn}
      onMouseLeave={animOut}
      onClick={onClick}
    >
      <span
        ref={innerRef}
        className="jh-reverse-btn-inner relative inline-flex items-center justify-center overflow-hidden rounded-[120px] px-6 py-2.5 text-base font-medium leading-[1.19] outline-none"
      >
        <span className="jh-reverse-btn__word relative z-1 flex h-[1.3em] items-center justify-center overflow-hidden">
          {letters.map((ch, i) => (
            <span key={`${i}-${ch}`} className="jh-reverse-btn__letter inline-block">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
