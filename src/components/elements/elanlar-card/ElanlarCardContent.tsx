import { Bath, Bed, LayoutGrid, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

type ElanlarCardContentProps = {
  href: string;
  title: string;
  priceText: string;
  /** Figma: mətn qara; siyahı üçün `text-jh-third` verilə bilər */
  priceClassName?: string;
  address: string;
  beds: number | null;
  baths: number | null;
  rooms: number | null;
  emptyLabel: string;
};

/**
 * Figma 2116:7177 — alt blok: `pt-12px pb-10px px-8px`, başlıq 16 medium, qiymət 16 semibold, ünvan 14 @ #636366.
 */
export function ElanlarCardContent({
  href,
  title,
  priceText,
  priceClassName = "text-[16px] font-semibold leading-5 text-black",
  address,
  beds,
  baths,
  rooms,
  emptyLabel,
}: ElanlarCardContentProps) {
  return (
    <Link
      href={href}
      className="block w-full border-t-0  pt-3 pr-2 pb-2.5 pl-2 text-inherit no-underline"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-[16px] font-medium leading-6 text-black">
            {title}
          </p>
          <p
            className={`shrink-0 text-right whitespace-nowrap ${priceClassName}`.trim()}
          >
            {priceText}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <MapPin
            className="h-5 w-5 shrink-0 text-[#636366]"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="min-w-0 truncate text-[14px] font-normal leading-5 text-[#636366]">
            {address}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <div className="flex items-center gap-1.5 text-[#636366]">
            <Bed className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="text-[14px] font-normal leading-5">
              {beds == null ? emptyLabel : beds}
            </span>
          </div>
          <span className="h-4 w-px shrink-0 bg-[#aeaeb2]" aria-hidden />
          <div className="flex items-center gap-1.5 text-[#636366]">
            <Bath className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="text-[14px] font-normal leading-5">
              {baths == null ? emptyLabel : baths}
            </span>
          </div>
          <span className="h-4 w-px shrink-0 bg-[#aeaeb2]" aria-hidden />
          <div className="flex items-center gap-1.5 text-[#636366]">
            <LayoutGrid className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span className="text-[14px] font-normal leading-5">
              {rooms == null ? emptyLabel : rooms}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
