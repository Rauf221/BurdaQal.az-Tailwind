"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import {
  appendAdvancedFilterParams,
  emptyExtraFilters,
  parseAttributeIdsParam,
  parseExtraFiltersFromParams,
  PropertyAdvancedFilterPanel,
} from "@/components/properties/PropertyAdvancedFilterPanel";
import {
  attributesListQuery,
  categoriesListQuery,
  groupAttributesByParent,
  regionsListQuery,
} from "@/services/dashboard/Add-New-Properties";

export default function ElanlarFilterForm() {
  const locale = useLocale();
  const t = useTranslations("listings");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriesQ = useQuery(categoriesListQuery(locale));
  const regionsQ = useQuery(regionsListQuery(locale));
  const attributesQ = useQuery(attributesListQuery(locale));

  const searchParamsKey = searchParams.toString();

  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParamsKey);
    return {
      search: String(params.get("search") ?? ""),
      region_id: String(params.get("region_id") ?? ""),
      category_id: String(params.get("category_id") ?? ""),
    };
  }, [searchParamsKey]);

  const [filters, setFilters] = useState(initialFilters);
  const [extraFilters, setExtraFilters] = useState(emptyExtraFilters);
  const [attributeSel, setAttributeSel] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilters((prev) => {
      if (
        prev.search === initialFilters.search &&
        prev.region_id === initialFilters.region_id &&
        prev.category_id === initialFilters.category_id
      ) {
        return prev;
      }
      return initialFilters;
    });
  }, [initialFilters]);

  useEffect(() => {
    const p = new URLSearchParams(searchParamsKey);
    setExtraFilters(parseExtraFiltersFromParams(p));
    setAttributeSel(parseAttributeIdsParam(p.get("attribute_ids")));
  }, [searchParamsKey]);

  useEffect(() => {
    if (!filterOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (filterButtonRef.current?.contains(t)) return;
      if (filterPanelRef.current?.contains(t)) return;
      setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [filterOpen]);

  const categories = categoriesQ.data?.data ?? [];
  const regions = regionsQ.data?.data ?? [];
  const attributeSections = useMemo(() => {
    const raw = attributesQ.data?.data;
    if (!raw?.length) return [];
    return groupAttributesByParent(raw);
  }, [attributesQ.data?.data]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const p = new URLSearchParams();
    const search = filters.search.trim();
    if (search) p.set("search", search);
    if (filters.category_id) p.set("category_id", filters.category_id);
    if (filters.region_id) p.set("region_id", filters.region_id);
    appendAdvancedFilterParams(p, extraFilters, attributeSel);
    const q = p.toString();
    router.push(`/elanlar${q ? `?${q}` : ""}`);
    setFilterOpen(false);
  };

  const selectCls =
    "nice-select w-full cursor-pointer appearance-none border-0 bg-transparent py-1 text-[15px] font-normal leading-7 text-[var(--Secondary)] outline-none";

  return (
    <div className="form-filter relative z-[5]">
      <form
        className="form-search-home5 relative flex flex-wrap items-center gap-6 overflow-visible rounded-2xl border border-[var(--Border)] bg-[#F9F9F9] px-5 py-[19px] pl-[30px] max-lg:flex-col max-lg:items-stretch max-lg:gap-6 lg:flex-nowrap xl:gap-10"
        onSubmit={onSubmit}
      >
        <div className="list flex min-w-0 flex-1 flex-wrap items-center gap-5 max-lg:w-full max-lg:flex-col max-lg:items-stretch lg:flex-nowrap xl:gap-[30px]">
          <div className="group-form form-search-content w-full min-w-0 lg:flex-1 lg:basis-[280px]">
            <div className="form-style-has-title relative">
              <div className="title mb-1 text-[13px] font-normal leading-[15px] text-[#969696]">
                {t("filterSearchLabel")}
              </div>
              <div className="relative">
                <fieldset className="name m-0 min-w-0 border-0 p-0">
                  <input
                    type="text"
                    placeholder={t("filterSearchPlaceholder")}
                    className="show-search style-default w-full border-0 bg-transparent py-2 text-[15px] font-normal leading-7 text-[var(--Secondary)] outline-none placeholder:text-[var(--Secondary)]"
                    name="search"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, search: e.target.value }))
                    }
                    tabIndex={2}
                  />
                </fieldset>
                <div className="style-absolute-right pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="style-icon-default text-[var(--Fourth)]">
                    <Search className="h-4 w-4" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="divider-1 hidden h-10 w-px shrink-0 self-center bg-[var(--Border)] lg:block"
            aria-hidden
          />
          <div className="group-form w-full shrink-0 lg:w-[170px] xl:w-[200px]">
            <div className="form-style-has-title relative">
              <div className="title mb-1 text-[13px] font-normal leading-[15px] text-[#969696]">
                {t("filterRegion")}
              </div>
              <select
                className={selectCls}
                tabIndex={0}
                name="region_id"
                value={filters.region_id}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, region_id: e.target.value }))
                }
              >
                <option value="">{t("filterAll")}</option>
                {regions.map((region) => (
                  <option key={region.id} value={String(region.id)}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            className="divider-1 hidden h-10 w-px shrink-0 self-center bg-[var(--Border)] lg:block"
            aria-hidden
          />
          <div className="group-form w-full shrink-0 lg:w-[170px] xl:w-[200px]">
            <div className="form-style-has-title relative">
              <div className="title mb-1 text-[13px] font-normal leading-[15px] text-[#969696]">
                {t("filterCategory")}
              </div>
              <select
                className={selectCls}
                tabIndex={0}
                name="category_id"
                value={filters.category_id}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category_id: e.target.value }))
                }
              >
                <option value="">{t("filterAll")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex w-full min-w-0 shrink-0 flex-row items-stretch gap-2.5 max-lg:max-w-full lg:w-auto">
          <div className="shrink-0">
            <button
              ref={filterButtonRef}
              type="button"
              className={`flex min-h-[52px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-4 py-3 text-[15px] font-medium leading-[18px] transition-colors lg:px-5 xl:px-[26px] ${filterOpen ? "border-[var(--Primary)] text-[var(--Primary)]" : "border-[var(--Border)] text-[var(--Secondary)] hover:border-[var(--Secondary)]/40"}`}
              onClick={() => setFilterOpen((v) => !v)}
            >
              <SlidersHorizontal className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              {t("filterButton")}
            </button>
          </div>
          <div className="group-form min-w-0 flex-1 lg:w-[140px] lg:flex-none">
            <div className="button-submit">
              <button
                type="submit"
                className="flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-xl bg-[var(--Primary)] px-5 py-[19px] text-[15px] font-medium leading-[17px] text-[var(--White)] transition-colors hover:bg-[#6fb042] lg:px-6 xl:px-[30px]"
              >
                {t("filterSubmit")}
              </button>
            </div>
          </div>
        </div>

        <PropertyAdvancedFilterPanel
          open={filterOpen}
          panelRef={filterPanelRef}
          idPrefix="elanlar"
          extraFilters={extraFilters}
          setExtraFilters={setExtraFilters}
          attributeSel={attributeSel}
          setAttributeSel={setAttributeSel}
          attributeSections={attributeSections}
          attributesPending={attributesQ.isPending}
          attributesError={attributesQ.isError}
        />
      </form>
    </div>
  );
}
