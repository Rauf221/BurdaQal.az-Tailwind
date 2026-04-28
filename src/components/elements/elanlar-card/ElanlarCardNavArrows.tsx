import { ChevronLeft, ChevronRight } from "lucide-react";

type ElanlarCardNavArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  /** Tək elan əsas qalereyası üçün bir az böyük düymələr (`ElanlarCard` dəyişməz). */
  large?: boolean;
};

/**
 * Figma 2116:7155 — 28px ağ dairə, hover zamanı görünür (`group` valideynə bağlı deyil — valideyn `ElanlarCard` ötürür).
 * Default-only frame (2116:7177) bu bloku render etmir.
 */
export function ElanlarCardNavArrows({
  onPrev,
  onNext,
  prevLabel = "Əvvəlki şəkil",
  nextLabel = "Növbəti şəkil",
  large = false,
}: ElanlarCardNavArrowsProps) {
  const btn =
    large
      ? "left-5 sm:h-11 sm:w-11 sm:shadow-md sm:hover:shadow-lg"
      : "left-4 sm:h-7 sm:w-7 sm:shadow-sm";
  const btnRight = large ? "right-5 sm:h-11 sm:w-11 sm:shadow-md sm:hover:shadow-lg" : "right-4 sm:h-7 sm:w-7 sm:shadow-sm";
  const iconClass = large ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div className="pointer-events-none absolute inset-0 z-3">
      <button
        type="button"
        className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 rounded-full border border-white bg-white p-0 text-jh-secondary opacity-0 max-sm:hidden sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 ${btn}`}
        aria-label={prevLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft className={`mx-auto ${iconClass}`} strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        className={`pointer-events-auto absolute top-1/2 -translate-y-1/2 rounded-full border border-white bg-white p-0 text-jh-secondary opacity-0 max-sm:hidden sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 ${btnRight}`}
        aria-label={nextLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight className={`mx-auto ${iconClass}`} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
