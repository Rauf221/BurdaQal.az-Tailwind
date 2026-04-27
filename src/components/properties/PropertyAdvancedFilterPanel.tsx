"use client";

import { useTranslations } from "next-intl";
import type { AttributeSection } from "@/services/dashboard/Add-New-Properties";

export type ExtraFiltersState = {
  min_bedrooms: string;
  min_bathrooms: string;
  min_area: string;
  max_area: string;
  min_price: string;
  max_price: string;
};

export const emptyExtraFilters = (): ExtraFiltersState => ({
  min_bedrooms: "",
  min_bathrooms: "",
  min_area: "",
  max_area: "",
  min_price: "",
  max_price: "",
});

export function parseExtraFiltersFromParams(
  p: URLSearchParams,
): ExtraFiltersState {
  return {
    min_bedrooms: String(p.get("min_bedrooms") ?? "").trim(),
    min_bathrooms: String(p.get("min_bathrooms") ?? "").trim(),
    min_area: String(p.get("min_area") ?? "").trim(),
    max_area: String(p.get("max_area") ?? "").trim(),
    min_price: String(p.get("min_price") ?? "").trim(),
    max_price: String(p.get("max_price") ?? "").trim(),
  };
}

export function parseAttributeIdsParam(
  raw: string | null | undefined,
): Record<string, boolean> {
  const s = String(raw ?? "").trim();
  const out: Record<string, boolean> = {};
  for (const id of s.split(",").map((x) => x.trim()).filter(Boolean)) {
    out[id] = true;
  }
  return out;
}

export function appendAdvancedFilterParams(
  p: URLSearchParams,
  extra: ExtraFiltersState,
  attributeSel: Record<string, boolean>,
) {
  if (extra.min_bedrooms) p.set("min_bedrooms", extra.min_bedrooms);
  if (extra.min_bathrooms) p.set("min_bathrooms", extra.min_bathrooms);
  if (extra.min_area.trim()) p.set("min_area", extra.min_area.trim());
  if (extra.max_area.trim()) p.set("max_area", extra.max_area.trim());
  if (extra.min_price) p.set("min_price", extra.min_price);
  if (extra.max_price) p.set("max_price", extra.max_price);
  const attrIds = Object.entries(attributeSel)
    .filter(([, on]) => on)
    .map(([id]) => id)
    .sort((a, b) => Number(a) - Number(b));
  if (attrIds.length) p.set("attribute_ids", attrIds.join(","));
}

export type PropertyAdvancedFilterPanelContentProps = {
  extraFilters: ExtraFiltersState;
  setExtraFilters: React.Dispatch<React.SetStateAction<ExtraFiltersState>>;
  attributeSel: Record<string, boolean>;
  setAttributeSel: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  attributeSections: AttributeSection[];
  attributesPending: boolean;
  attributesError: boolean;
  /** Checkbox / label id prefiksi (eyni səhifədə iki panel olarsa) */
  idPrefix?: string;
};

export function PropertyAdvancedFilterPanelContent({
  extraFilters,
  setExtraFilters,
  attributeSel,
  setAttributeSel,
  attributeSections,
  attributesPending,
  attributesError,
  idPrefix = "",
}: PropertyAdvancedFilterPanelContentProps) {
  const t = useTranslations("propertyAdvancedFilter");
  const pid = (s: string) => (idPrefix ? `${idPrefix}-${s}` : s);

  return (
    <>
      <div>
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <select
            className="h-14 w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 text-[16px] font-medium text-[var(--Secondary)] outline-none"
            value={extraFilters.min_bedrooms}
            onChange={(e) =>
              setExtraFilters((prev) => ({
                ...prev,
                min_bedrooms: e.target.value,
              }))
            }
          >
            <option value="">{t("minBedrooms")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
          <select
            className="h-14 w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 text-[16px] font-medium text-[var(--Secondary)] outline-none"
            value={extraFilters.min_bathrooms}
            onChange={(e) =>
              setExtraFilters((prev) => ({
                ...prev,
                min_bathrooms: e.target.value,
              }))
            }
          >
            <option value="">{t("minBathrooms")}</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <input
            type="text"
            inputMode="decimal"
            placeholder={t("minAreaPlaceholder")}
            className="h-14 rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 text-[16px] text-[var(--Secondary)] outline-none placeholder:text-[#8b8b8b]"
            value={extraFilters.min_area}
            onChange={(e) =>
              setExtraFilters((prev) => ({ ...prev, min_area: e.target.value }))
            }
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder={t("maxAreaPlaceholder")}
            className="h-14 rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 text-[16px] text-[var(--Secondary)] outline-none placeholder:text-[#8b8b8b]"
            value={extraFilters.max_area}
            onChange={(e) =>
              setExtraFilters((prev) => ({ ...prev, max_area: e.target.value }))
            }
          />
          <select
            className="h-14 rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 text-[16px] font-medium text-[var(--Secondary)] outline-none"
            value={extraFilters.min_price}
            onChange={(e) =>
              setExtraFilters((prev) => ({
                ...prev,
                min_price: e.target.value,
              }))
            }
          >
            <option value="">{t("minPrice")}</option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1 000</option>
            <option value="5000">5 000</option>
            <option value="50000">50 000</option>
            <option value="100000">100 000</option>
          </select>
          <select
            className="h-14 rounded-xl border border-[var(--Border)] bg-[var(--White)] px-4 text-[16px] font-medium text-[var(--Secondary)] outline-none"
            value={extraFilters.max_price}
            onChange={(e) =>
              setExtraFilters((prev) => ({
                ...prev,
                max_price: e.target.value,
              }))
            }
          >
            <option value="">{t("maxPrice")}</option>
            <option value="1000">1 000</option>
            <option value="5000">5 000</option>
            <option value="10000">10 000</option>
            <option value="50000">50 000</option>
            <option value="100000">100 000</option>
            <option value="500000">500 000</option>
            <option value="1000000">1 000 000</option>
          </select>
        </div>
      </div>
      <div>
        <div className="title mb-6 text-base font-semibold leading-snug text-[var(--Secondary)]">
          {t("amenitiesTitle")}
        </div>
        {attributesError ? (
          <p className="m-0 text-sm text-[#c0392b]">
            {t("amenitiesError")}
          </p>
        ) : attributesPending ? (
          <p className="m-0 text-[15px] text-[var(--Text)]">{t("loading")}</p>
        ) : attributeSections.length === 0 ? (
          <p className="m-0 text-[15px] text-[var(--Text)]">{t("noAmenities")}</p>
        ) : (
          <div className="flex flex-col gap-8">
            {attributeSections.map((section) => (
              <div key={section.parent.id}>
                <p className="mb-4 text-[15px] font-semibold text-[var(--Secondary)] md:text-[16px]">
                  {section.parent.name}
                </p>
                <ul className="m-0 grid w-full grid-cols-1 gap-x-6 gap-y-5 p-0 sm:grid-cols-2 md:grid-cols-3 md:gap-y-6">
                  {section.children.map((item) => {
                    const idKey = String(item.id);
                    return (
                      <li
                        key={item.id}
                        className="flex min-h-[24px] list-none items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          id={pid(`attr-${item.id}`)}
                          checked={!!attributeSel[idKey]}
                          onChange={() =>
                            setAttributeSel((prev) => ({
                              ...prev,
                              [idKey]: !prev[idKey],
                            }))
                          }
                          className="h-5 w-5 shrink-0 rounded border-[var(--Border)] accent-[var(--Secondary)]"
                        />
                        <label
                          htmlFor={pid(`attr-${item.id}`)}
                          className="cursor-pointer text-[15px] leading-snug text-[var(--Text)] md:text-[16px]"
                        >
                          {item.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

type PropertyAdvancedFilterPanelProps = PropertyAdvancedFilterPanelContentProps & {
  open: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  /** Əlavə siniflər (məs. elanlar səhifəsi üçün) */
  panelClassName?: string;
};

export function PropertyAdvancedFilterPanel({
  open,
  panelRef,
  panelClassName = "",
  ...contentProps
}: PropertyAdvancedFilterPanelProps) {
  return (
    <div
      ref={panelRef}
      className={`slider-home7-open-filter open-filter absolute left-0 right-0 top-full z-[100] mt-2 flex max-h-[min(85vh,920px)] w-full flex-col gap-8 overflow-y-auto rounded-2xl border border-[var(--Secondary)] bg-[var(--White)] p-8 shadow-[0px_6px_15px_0px_#404F680D] transition-all md:gap-10 md:p-10 ${open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"} ${panelClassName}`}
    >
      <PropertyAdvancedFilterPanelContent {...contentProps} />
    </div>
  );
}
