import { ChevronLeft, ChevronRight } from "lucide-react";

type ElanlarCardNavArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
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
}: ElanlarCardNavArrowsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-3">
      <button
        type="button"
        className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white bg-white p-0 text-jh-secondary opacity-0 shadow-sm max-sm:hidden sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        aria-label={prevLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrev();
        }}
      >
        <ChevronLeft className="mx-auto h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </button>
      <button
        type="button"
        className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white bg-white p-0 text-jh-secondary opacity-0 shadow-sm max-sm:hidden sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        aria-label={nextLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
      >
        <ChevronRight className="mx-auto h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
