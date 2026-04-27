"use client";

import type { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import LayoutAdmin from "@/components/layout/admin/LayoutAdmin";
import TimeDigitsInput from "@/components/dashboard/TimeDigitsInput";
import {
  attributesListQuery,
  categoriesListQuery,
  groupAttributesByParent,
  regionsListQuery,
  useSaveAddressSectionMutation,
  useSaveAnnouncementCoreMutation,
  useSaveAttributeSectionMutation,
  useSaveDetailSectionMutation,
  useSaveMediaSectionMutation,
} from "@/services/dashboard/Add-New-Properties";
import { myAnnouncementShowQuery } from "@/services/dashboard/My-properties";
import { FadeIn } from "@/components/motion";

const MEDIA_RULES = {
  minWidth: 800,
  minHeight: 600,
  maxFileMb: 5,
};

const labelCls = "mb-2.5 block text-[17px] font-semibold text-[var(--Secondary)]";
const fieldCls =
  "box-border w-full rounded-xl border border-[var(--Border)] bg-[var(--White)] px-[19px] py-3 text-base text-[var(--Secondary)] outline-none focus:border-[var(--Fourth)]";
const wgBoxCls =
  "mb-20 rounded-3xl border border-[var(--Border)] bg-[var(--White)] py-[39px] pr-[39px] pl-11";
const h4Cls = "-mt-2 mb-[33px] text-[22px] font-semibold leading-8 text-[var(--Secondary)]";
const btnPrimaryCls =
  "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[var(--Primary)] px-[26px] text-[15px] font-medium text-[var(--White)] transition-colors hover:bg-[#6fb042] disabled:cursor-not-allowed disabled:opacity-60";

type GalleryPreviewItem =
  | {
      url: string;
      name: string;
      path: string;
      isLocalBlob: false;
    }
  | {
      url: string;
      name: string;
      fileSize: number;
      isLocalBlob: true;
    };

function getSubmitErrorMessage(err: unknown): string {
  if (err == null) return "Naməlum xəta";
  const ax = err as AxiosError<{
    message?: string;
    errors?: Record<string, string[] | string>;
  }>;
  const data = ax.response?.data;
  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message) return data.message;
    const errors = data.errors;
    if (errors && typeof errors === "object") {
      const flat = Object.values(errors).flat();
      const first = flat[0];
      if (typeof first === "string") return first;
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    }
  }
  if (err instanceof Error) return err.message;
  return "Sorğu uğursuz oldu.";
}

function absoluteStoragePreviewUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const raw = String(path).trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base =
    process.env.NEXT_PUBLIC_USER_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  try {
    const u = new URL(base);
    const p = raw.startsWith("/") ? raw : `/${raw}`;
    return `${u.origin}${p}`;
  } catch {
    return raw;
  }
}

export type DashboardAddPropertiesClientProps = {
  initialAnnouncementId?: number | null;
  breadcrumbTitle?: string;
};

export default function DashboardAddPropertiesClient({
  initialAnnouncementId = null,
  breadcrumbTitle = "Add New Property",
}: DashboardAddPropertiesClientProps) {
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [announcementId, setAnnouncementId] = useState<number | null>(initialAnnouncementId);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [attributesDidStore, setAttributesDidStore] = useState(false);

  const coverBlobRef = useRef<string | null>(null);
  const galleryBlobsRef = useRef<string[]>([]);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<GalleryPreviewItem[]>([]);
  const [initialGalleryPaths, setInitialGalleryPaths] = useState<string[]>([]);
  const [deletedGalleryPaths, setDeletedGalleryPaths] = useState<string[]>([]);
  const galleryPreviewsRef = useRef<GalleryPreviewItem[]>([]);
  const initialGalleryPathsRef = useRef<string[]>([]);
  const deletedGalleryPathsRef = useRef<string[]>([]);
  const hydratedEditIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (coverBlobRef.current) {
        URL.revokeObjectURL(coverBlobRef.current);
        coverBlobRef.current = null;
      }
      galleryBlobsRef.current.forEach((u) => URL.revokeObjectURL(u));
      galleryBlobsRef.current = [];
    };
  }, []);

  function handleCoverPreviewChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (coverBlobRef.current) {
      URL.revokeObjectURL(coverBlobRef.current);
      coverBlobRef.current = null;
    }
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      coverBlobRef.current = url;
      setCoverPreviewUrl(url);
      setSelectedCoverFile(file);
    } else {
      setCoverPreviewUrl(null);
      setSelectedCoverFile(null);
    }
  }

  function handleGalleryPreviewChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files || [])].filter((f) => f.type.startsWith("image/"));
    setSelectedGalleryFiles((prev) => [...prev, ...files]);
    const next: GalleryPreviewItem[] = files.map((f) => {
      const url = URL.createObjectURL(f);
      galleryBlobsRef.current.push(url);
      return { url, name: f.name, fileSize: f.size, isLocalBlob: true };
    });
    setGalleryPreviews((prev) => {
      const merged = [...prev, ...next];
      galleryPreviewsRef.current = merged;
      return merged;
    });
  }

  function handleRemoveCoverPreview() {
    if (coverBlobRef.current) {
      URL.revokeObjectURL(coverBlobRef.current);
      coverBlobRef.current = null;
    }
    setCoverPreviewUrl(null);
    setSelectedCoverFile(null);
    const input = document.getElementById("property-cover-image") as HTMLInputElement | null;
    if (input) input.value = "";
  }

  function handleRemoveGalleryPreview(idx: number) {
    setGalleryPreviews((prev) => {
      const item = prev[idx];
      if (item?.isLocalBlob && item?.url) {
        setSelectedGalleryFiles((old) =>
          old.filter((f) => !(f.name === item.name && item.fileSize === f.size)),
        );
        URL.revokeObjectURL(item.url);
        galleryBlobsRef.current = galleryBlobsRef.current.filter((u) => u !== item.url);
      }
      if (!item.isLocalBlob && item.path) {
        setDeletedGalleryPaths((old) => {
          const nextDeleted = old.includes(item.path) ? old : [...old, item.path];
          deletedGalleryPathsRef.current = nextDeleted;
          return nextDeleted;
        });
      }
      const nextPreviews = prev.filter((_, i) => i !== idx);
      galleryPreviewsRef.current = nextPreviews;
      return nextPreviews;
    });
  }

  const coreM = useSaveAnnouncementCoreMutation(locale);
  const addrM = useSaveAddressSectionMutation(locale);
  const detailM = useSaveDetailSectionMutation(locale);
  const mediaM = useSaveMediaSectionMutation(locale);
  const attrM = useSaveAttributeSectionMutation(locale);

  const catQ = useQuery(categoriesListQuery(locale));
  const regQ = useQuery(regionsListQuery(locale));
  const attrQ = useQuery(attributesListQuery(locale));

  const editId = Number.isFinite(initialAnnouncementId) ? Number(initialAnnouncementId) : 0;
  const editShowQ = useQuery({
    ...myAnnouncementShowQuery(editId, locale),
  });

  useEffect(() => {
    if (initialAnnouncementId == null) return;
    const editData = editShowQ.data?.data;
    if (!editData || !formRef.current) return;
    if (hydratedEditIdRef.current === editData.id) return;

    const form = formRef.current;
    const setField = (name: string, value: unknown) => {
      const node = form.elements.namedItem(name);
      if (!node) return;
      const v = value == null ? "" : String(value);
      if (node instanceof RadioNodeList) {
        const first = node[0];
        if (first && "value" in first) (first as HTMLInputElement).value = v;
        return;
      }
      if ("value" in node) (node as HTMLInputElement).value = v;
    };

    setField("title", editData.title);
    setField("description", editData.description);
    setField("category_id", editData.category?.id ?? editData.category_id);
    setField("price", editData.price);
    setField("check_in", editData.check_in);
    setField("check_out", editData.check_out);

    setField("region_id", editData.address?.region_id);
    setField("street_address", editData.address?.street);
    setField("map", editData.address?.map);
    setField("landmark", editData.address?.landmark);

    setField("room_count", editData.detail?.room);
    setField("bed_count", editData.detail?.bedroom);
    setField("bathroom_count", editData.detail?.bathroom);
    setField("max_guests", editData.detail?.guest);
    setField("video_youtube_url", editData.media?.link);

    const coverFromApi = absoluteStoragePreviewUrl(editData.media?.cover_image);
    setCoverPreviewUrl(coverFromApi);
    setSelectedCoverFile(null);
    const galleryFromApi = (editData.media?.gallery ?? [])
      .map((entry, i) => {
        let rawPath = "";
        if (typeof entry === "string") rawPath = entry;
        else if (entry != null && typeof entry === "object") {
          const o = entry as Record<string, unknown>;
          const p = o.path ?? o.image ?? o.url;
          rawPath = p != null ? String(p) : "";
        }
        const url = absoluteStoragePreviewUrl(rawPath);
        if (!url) return null;
        const tail = String(rawPath).split("/").pop() || `gallery-${i + 1}`;
        return { url, name: tail, path: String(rawPath), isLocalBlob: false as const };
      })
      .filter(Boolean) as GalleryPreviewItem[];
    setGalleryPreviews(galleryFromApi);
    galleryPreviewsRef.current = galleryFromApi;
    const initialPaths = galleryFromApi
      .filter((item): item is Extract<GalleryPreviewItem, { isLocalBlob: false }> => !item.isLocalBlob)
      .map((item) => item.path)
      .filter(Boolean);
    setInitialGalleryPaths(initialPaths);
    initialGalleryPathsRef.current = initialPaths;
    setSelectedGalleryFiles([]);
    setDeletedGalleryPaths([]);
    deletedGalleryPathsRef.current = [];

    for (const input of form.querySelectorAll<HTMLInputElement>('input[name="attribute_id[]"]')) {
      input.checked = false;
    }
    for (const attr of editData.attributes ?? []) {
      const escaped = String(attr.id).replace(/"/g, '\\"');
      const input = form.querySelector<HTMLInputElement>(
        `input[name="attribute_id[]"][value="${escaped}"]`,
      );
      if (input) input.checked = true;
    }

    setAnnouncementId(editData.id ?? null);
    setAddressId(editData.address?.id ?? null);
    setDetailId(editData.detail?.id ?? null);
    setMediaId(editData.media?.id ?? null);
    setAttributesDidStore((editData.attributes?.length ?? 0) > 0);
    hydratedEditIdRef.current = editData.id;
  }, [initialAnnouncementId, editShowQ.data]);

  useEffect(() => {
    if (initialAnnouncementId == null) return;
    const editData = editShowQ.data?.data;
    if (!editData || !formRef.current) return;

    function setSelectIfOptionExists(name: string, rawValue: unknown) {
      if (rawValue == null || rawValue === "") return;
      const formEl = formRef.current;
      if (!formEl) return;
      const node = formEl.elements.namedItem(name);
      if (!node || !("options" in node)) return;
      const sel = node as HTMLSelectElement;
      const v = String(rawValue);
      if (![...sel.options].some((o) => o.value === v)) return;
      if (sel.value !== v) sel.value = v;
    }

    const categoryVal = editData.category?.id ?? editData.category_id;
    setSelectIfOptionExists("category_id", categoryVal);
    setSelectIfOptionExists("region_id", editData.address?.region_id);
  }, [initialAnnouncementId, editShowQ.data, catQ.data, regQ.data]);

  function handleSaveCore() {
    setSubmitError(null);
    setSubmitSuccess(null);
    const form = formRef.current;
    if (!form) return;

    const raw = new FormData(form);
    const title = String(raw.get("title") ?? "").trim();
    const description = String(raw.get("description") ?? "").trim();
    const categoryId = String(raw.get("category_id") ?? "").trim();
    const price = String(raw.get("price") ?? "").trim();

    if (!title) {
      setSubmitError("Elan başlığını yazın.");
      return;
    }
    if (!description) {
      setSubmitError("Təsviri yazın.");
      return;
    }
    if (!categoryId) {
      setSubmitError("Kateqoriya seçin.");
      return;
    }
    if (!price) {
      setSubmitError("Qiymət daxil edin.");
      return;
    }

    coreM.mutate(
      { source: raw, announcementId },
      {
        onSuccess: ({ id, created }) => {
          setAnnouncementId(id);
          setSubmitSuccess(
            created
              ? `Əsas məlumatlar saxlanıldı. Elan ID: ${id}. Digər bölmələri doldura bilərsiniz.`
              : "Əsas məlumatlar serverdə yeniləndi.",
          );
        },
        onError: (err) => setSubmitError(getSubmitErrorMessage(err)),
      },
    );
  }

  function requireAnnouncementId(): boolean {
    if (announcementId == null) {
      setSubmitError('Əvvəl «Əsas məlumatlar» bölməsindən elanı saxlayın.');
      return false;
    }
    return true;
  }

  function handleSaveLocation() {
    setSubmitError(null);
    setSubmitSuccess(null);
    if (!requireAnnouncementId()) return;
    const form = formRef.current;
    if (!form) return;
    const raw = new FormData(form);
    const regionId = String(raw.get("region_id") ?? "").trim();
    const street = String(raw.get("street_address") ?? "").trim();
    if (!regionId) {
      setSubmitError("Şəhər (rayon) seçin.");
      return;
    }
    if (!street) {
      setSubmitError("Tam ünvanı yazın.");
      return;
    }

    addrM.mutate(
      { source: raw, announcementId: announcementId!, addressId },
      {
        onSuccess: (data) => {
          if (data?.addressId != null) setAddressId(data.addressId);
          setSubmitSuccess("Ünvan saxlanıldı (announcement-address).");
        },
        onError: (err) => setSubmitError(getSubmitErrorMessage(err)),
      },
    );
  }

  function handleSaveCapacity() {
    setSubmitError(null);
    setSubmitSuccess(null);
    if (!requireAnnouncementId()) return;
    const form = formRef.current;
    if (!form) return;
    const raw = new FormData(form);
    const room = String(raw.get("room_count") ?? "").trim();
    const bed = String(raw.get("bed_count") ?? "").trim();
    const bath = String(raw.get("bathroom_count") ?? "").trim();
    const guest = String(raw.get("max_guests") ?? "").trim();
    if (!room || !bed || !bath || !guest) {
      setSubmitError("Otaq, yataq, hamam və qonaq saylarını doldurun.");
      return;
    }

    detailM.mutate(
      { source: raw, announcementId: announcementId!, detailId },
      {
        onSuccess: (data) => {
          if (data?.detailId != null) setDetailId(data.detailId);
          setSubmitSuccess("Tutum məlumatları saxlanıldı (announcement-detail).");
        },
        onError: (err) => setSubmitError(getSubmitErrorMessage(err)),
      },
    );
  }

  function handleSaveMedia() {
    setSubmitError(null);
    setSubmitSuccess(null);
    if (!requireAnnouncementId()) return;
    const form = formRef.current;
    if (!form) return;
    const raw = new FormData(form);
    if (selectedCoverFile instanceof File && selectedCoverFile.size > 0) {
      raw.set("cover_image", selectedCoverFile);
    }
    raw.delete("gallery_images[]");
    for (const file of selectedGalleryFiles) {
      raw.append("gallery_images[]", file);
    }
    const keptServerPaths = galleryPreviewsRef.current
      .filter((item) => !item.isLocalBlob && "path" in item && item.path)
      .map((item) => String((item as Extract<GalleryPreviewItem, { isLocalBlob: false }>).path));
    const deletedByDiff = initialGalleryPathsRef.current.filter((p) => !keptServerPaths.includes(p));
    const deletedUnion = [...new Set([...deletedGalleryPathsRef.current, ...deletedByDiff])];
    for (const path of deletedUnion) {
      raw.append("deleted_images[]", path);
    }

    const cover = raw.get("cover_image");
    const galleryFiles = [...raw.getAll("gallery_images[]")].filter(
      (f): f is File => f instanceof File && f.size > 0,
    );
    const totalGalleryCount = galleryPreviews.length;
    const hasVideo = String(raw.get("video_youtube_url") ?? "").trim() !== "";

    if (mediaId == null) {
      const onlyVideo =
        hasVideo &&
        galleryFiles.length === 0 &&
        (!(cover instanceof File) || cover.size === 0);
      if (!onlyVideo) {
        if (!(cover instanceof File) || cover.size === 0) {
          setSubmitError("Cover şəkil yükləyin (və ya yalnız YouTube linki ilə davam edin).");
          return;
        }
        if (galleryFiles.length < 5) {
          setSubmitError("Ən azı 5 qalereya şəkli seçin.");
          return;
        }
      }
    } else if (totalGalleryCount < 5 && !hasVideo) {
      setSubmitError("Edit zamanı qalereyada minimum 5 şəkil qalmalıdır.");
      return;
    }

    mediaM.mutate(
      { source: raw, announcementId: announcementId!, mediaId },
      {
        onSuccess: (data) => {
          if (data?.mediaId != null) setMediaId(data.mediaId);
          setDeletedGalleryPaths([]);
          deletedGalleryPathsRef.current = [];
          setSelectedCoverFile(null);
          setSelectedGalleryFiles([]);
          const galleryInput = document.getElementById("property-gallery-images") as HTMLInputElement | null;
          if (galleryInput) galleryInput.value = "";
          setSubmitSuccess("Media saxlanıldı (announcement-media).");
        },
        onError: (err) => setSubmitError(getSubmitErrorMessage(err)),
      },
    );
  }

  function handleSaveAmenities() {
    setSubmitError(null);
    setSubmitSuccess(null);
    if (!requireAnnouncementId()) return;
    const form = formRef.current;
    if (!form) return;
    const raw = new FormData(form);

    attrM.mutate(
      { source: raw, announcementId: announcementId!, didStoreOnce: attributesDidStore },
      {
        onSuccess: () => {
          setAttributesDidStore(true);
          setSubmitSuccess("İmkanlar saxlanıldı (announcement-attribute).");
        },
        onError: (err) => setSubmitError(getSubmitErrorMessage(err)),
      },
    );
  }

  const attributeSections = useMemo(() => {
    const raw = attrQ.data?.data;
    if (!raw?.length) return [];
    return groupAttributesByParent(raw);
  }, [attrQ.data]);

  const categories = catQ.data?.data ?? [];
  const regions = regQ.data?.data ?? [];

  const uploadLabelCls =
    "relative flex h-[167px] w-[190px] max-w-full shrink-0 cursor-pointer flex-col items-center justify-center gap-3.5 rounded-2xl border border-dashed border-[var(--Fourth)] bg-[var(--jh-cream)] transition-colors hover:bg-[#fff0eb]";

  return (
    <LayoutAdmin breadcrumbTitle={breadcrumbTitle}>
      <FadeIn>
      <form
        ref={formRef}
        className="flex flex-col gap-[30px]"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          {initialAnnouncementId != null && editShowQ.isPending ? (
            <p className="mb-4 rounded-lg bg-[#fff8e1] px-3.5 py-2.5 text-sm text-[#8a6d3b]">
              Elan məlumatları yüklənir…
            </p>
          ) : null}
          {initialAnnouncementId != null && editShowQ.isError ? (
            <p className="mb-4 rounded-lg bg-[#fdecea] px-3.5 py-2.5 text-sm text-[#c0392b]">
              Edit məlumatları yüklənmədi. Səhifəni yeniləyib yenidən cəhd edin.
            </p>
          ) : null}
          {announcementId != null ? (
            <p className="mb-4 rounded-lg bg-[#e8f4fc] px-3.5 py-2.5 text-sm text-[#1565a0]">
              Aktiv layihə — elan ID: <strong>{announcementId}</strong>. Əsas məlumatları dəyişib
              saxladıqda elan yeniləmə sorğusu göndərilir.
            </p>
          ) : null}
          {submitError ? (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-[#fdecea] px-4 py-3 text-sm text-[#c0392b]"
            >
              {submitError}
            </p>
          ) : null}
          {submitSuccess ? (
            <p className="mb-4 rounded-lg bg-[#e8f5e9] px-4 py-3 text-sm text-[#1e6b2f]">
              {submitSuccess}
            </p>
          ) : null}

          <div className={wgBoxCls}>
            <h4 className={h4Cls}>
              Əsas məlumatlar{" "}
              <span className="text-[15px] font-normal opacity-85">(Core Info)</span>
            </h4>
            <div className="flex flex-col gap-[30px]">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="property-title" className={labelCls}>
                  Elan başlığı (maks. 100 simvol) *
                </label>
                <input
                  id="property-title"
                  type="text"
                  name="title"
                  maxLength={100}
                  placeholder="Elan başlığı *"
                  tabIndex={2}
                  aria-required
                  required
                  className={fieldCls}
                />
              </fieldset>
              <div>
                <label htmlFor="property-category" className={labelCls}>
                  Kateqoriya *
                </label>
                {catQ.isError ? (
                  <p className="text-sm text-[#c0392b]">
                    Kateqoriyalar yüklənmədi. Səhifəni yeniləyin.
                  </p>
                ) : null}
                <select
                  id="property-category"
                  name="category_id"
                  tabIndex={0}
                  disabled={catQ.isPending || catQ.isError}
                  required={!catQ.isPending && !catQ.isError && categories.length > 0}
                  defaultValue=""
                  className={`${fieldCls} cursor-pointer appearance-none bg-[length:12px] bg-[right_19px_center] bg-no-repeat pr-12`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231a1a1a' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="" disabled>
                    {catQ.isPending ? "Yüklənir…" : "Kateqoriya seçin"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="property-description" className={labelCls}>
                  Təsvir *
                </label>
                <textarea
                  id="property-description"
                  name="description"
                  rows={5}
                  placeholder="Elanın təsviri *"
                  tabIndex={2}
                  aria-required
                  required
                  className={`${fieldCls} min-h-[120px] resize-y`}
                />
              </fieldset>
              <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-check-in" className={labelCls}>
                    Check-in
                  </label>
                  <TimeDigitsInput id="property-check-in" name="check_in" placeholder="14:00" tabIndex={2} />
                </fieldset>
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-check-out" className={labelCls}>
                    Check-out
                  </label>
                  <TimeDigitsInput id="property-check-out" name="check_out" placeholder="11:00" tabIndex={2} />
                </fieldset>
              </div>
              <div>
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-price" className={labelCls}>
                    Qiymət (AZN) *
                  </label>
                  <input
                    id="property-price"
                    type="text"
                    name="price"
                    inputMode="decimal"
                    placeholder="Məs. 120"
                    tabIndex={2}
                    aria-required
                    required
                    className={fieldCls}
                  />
                </fieldset>
              </div>
              <div className="mt-2.5">
                <button
                  type="button"
                  disabled={coreM.isPending}
                  onClick={handleSaveCore}
                  className={btnPrimaryCls}
                >
                  {coreM.isPending
                    ? "Göndərilir…"
                    : announcementId == null
                      ? "Əsas məlumatları saxla (yeni elan)"
                      : "Əsas məlumatları yenilə"}
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>

          <div className={wgBoxCls}>
            <h4 className={h4Cls}>
              Ünvan və lokasiya{" "}
              <span className="text-[15px] font-normal opacity-85">(Location)</span>
            </h4>
            <div className="flex flex-col gap-[30px]">
              <div>
                <label htmlFor="property-city-region" className={labelCls}>
                  Şəhər (rayon) *
                </label>
                {regQ.isError ? (
                  <p className="text-sm text-[#c0392b]">Regionlar yüklənmədi. Səhifəni yeniləyin.</p>
                ) : null}
                <select
                  id="property-city-region"
                  name="region_id"
                  tabIndex={0}
                  disabled={regQ.isPending || regQ.isError}
                  defaultValue=""
                  className={`${fieldCls} cursor-pointer appearance-none bg-[length:12px] bg-[right_19px_center] bg-no-repeat pr-12`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231a1a1a' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="" disabled>
                    {regQ.isPending ? "Yüklənir…" : "Şəhər və ya rayon seçin"}
                  </option>
                  {regions.map((r) => (
                    <option key={r.id} value={String(r.id)}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="property-street-address" className={labelCls}>
                  Tam ünvan (küçə, bina) *
                </label>
                <textarea
                  id="property-street-address"
                  name="street_address"
                  rows={3}
                  placeholder="Küçə, bina, mənzil *"
                  tabIndex={2}
                  aria-required
                  className={`${fieldCls} min-h-[80px] resize-y`}
                />
              </fieldset>
              <div>
                <p className="mb-3 text-[15px] font-semibold text-[var(--Secondary)]">
                  Iframe Linki(Google Maps)
                </p>
                <input
                  id="property-iframe-link"
                  type="text"
                  name="map"
                  placeholder="https://www.google.com/maps/embed?pb=... və ya https://www.google.com/maps/embed?pb=..."
                  tabIndex={2}
                  className={fieldCls}
                />
              </div>
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="property-landmark" className={labelCls}>
                  Landmark (yaxın obyektlər)
                </label>
                <textarea
                  id="property-landmark"
                  name="landmark"
                  rows={3}
                  placeholder="Məs. metro, park, ticarət mərkəzi"
                  tabIndex={2}
                  className={`${fieldCls} min-h-[80px] resize-y`}
                />
              </fieldset>
              <div className="mt-2.5">
                <button
                  type="button"
                  disabled={addrM.isPending}
                  onClick={handleSaveLocation}
                  className={btnPrimaryCls}
                >
                  {addrM.isPending ? "Göndərilir…" : "Saxla və ön baxış"}
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>

          <div className={wgBoxCls}>
            <h4 className={h4Cls}>
              Media <span className="text-[15px] font-normal opacity-85">(Şəkillər və video)</span>
            </h4>
            <div className="flex flex-col gap-[30px]">
              <div className="rounded-lg bg-[#f5f5f5] px-4 py-3.5 text-sm leading-relaxed text-[var(--Secondary)]">
                <p className="mb-2 font-semibold">Qaydalar</p>
                <ul className="m-0 list-disc pl-5">
                  <li>
                    Minimum ölçü (en × hündürlük): {MEDIA_RULES.minWidth}×{MEDIA_RULES.minHeight} px
                  </li>
                  <li>Hər fayl üçün maksimum ölçü: {MEDIA_RULES.maxFileMb} MB</li>
                  <li>Format: JPG, PNG, WebP</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 border-b border-[var(--Border)] pb-[29px]">
                <div className="text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                  Cover şəkil (1 ədəd – məcburi) *
                </div>
                <div className="flex flex-row flex-wrap items-start gap-4">
                  <div className="shrink-0">
                    <label className={uploadLabelCls} htmlFor="property-cover-image">
                      <input
                        id="property-cover-image"
                        type="file"
                        name="cover_image"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverPreviewChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <ImagePlus className="h-7 w-7 text-[var(--Secondary)]" strokeWidth={1.25} />
                      <div className="text-center text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
                        Cover yüklə
                      </div>
                    </label>
                  </div>
                  {coverPreviewUrl ? (
                    <div className="group relative h-[167px] w-[190px] max-w-full shrink-0 overflow-hidden rounded-2xl border border-[#ddd] bg-white shadow-sm">
                      <img src={coverPreviewUrl} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          aria-label="Cover şəklini sil"
                          onClick={handleRemoveCoverPreview}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--White)] text-[var(--Fourth)] shadow-md"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-[var(--Border)] pb-[29px]">
                <div className="text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                  Gallery (ən azı 5 şəkil) *
                </div>
                <div className="flex flex-row flex-wrap items-start gap-3">
                  <div className="min-w-[200px] max-w-full flex-[0_1_auto]">
                    <label className={`${uploadLabelCls} min-h-[167px] w-full min-w-0`} htmlFor="property-gallery-images">
                      <input
                        id="property-gallery-images"
                        type="file"
                        name="gallery_images[]"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleGalleryPreviewChange}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <ImagePlus className="h-7 w-7 text-[var(--Secondary)]" strokeWidth={1.25} />
                      <div className="px-2 text-center text-[15px] font-medium leading-[18px] text-[var(--Secondary)]">
                        Şəkilləri seçin (Ctrl ilə çoxlu)
                      </div>
                    </label>
                  </div>
                  {galleryPreviews.length > 0 ? (
                    <div className="flex min-w-0 flex-1 flex-wrap content-start items-start gap-2.5">
                      {galleryPreviews.map((item, idx) => (
                        <div
                          key={`${item.name}-${idx}`}
                          title={item.name}
                          className="group relative h-[166px] w-full max-w-[290px] shrink-0 overflow-hidden rounded-lg border border-[#ddd] bg-white shadow-sm sm:w-[290px]"
                        >
                          <img src={item.url} alt="" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              aria-label="Şəkli sil"
                              onClick={() => handleRemoveGalleryPreview(idx)}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--White)] text-[var(--Fourth)] shadow-md"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="m-0 mt-2.5 text-sm leading-7 text-[var(--Secondary)]">
                  Ən azı 5 şəkil seçilməlidir; təsdiq server tərəfində də yoxlanılacaq.
                </p>
              </div>

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <label htmlFor="property-video-youtube" className={labelCls}>
                  Video (YouTube, opsional)
                </label>
                <input
                  id="property-video-youtube"
                  type="url"
                  name="video_youtube_url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder="https://www.youtube.com/watch?v=… və ya youtu.be/…"
                  tabIndex={2}
                  className={fieldCls}
                />
              </fieldset>

              <div>
                <button
                  type="button"
                  disabled={mediaM.isPending}
                  onClick={handleSaveMedia}
                  className={btnPrimaryCls}
                >
                  {mediaM.isPending ? "Göndərilir…" : "Saxla və ön baxış"}
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>

          <div className={wgBoxCls}>
            <h4 className={h4Cls}>İmkanlar (Amenities)</h4>
            {attrQ.isError ? (
              <p className="text-sm text-[#c0392b]">İmkanlar yüklənmədi.</p>
            ) : null}
            <div className="flex flex-col gap-[30px]">
              {attrQ.isPending ? (
                <p className="m-0 text-[var(--Text)]">Yüklənir…</p>
              ) : (
                attributeSections.map((section) => (
                  <div key={section.parent.id}>
                    <p className="mb-3 text-[17px] font-semibold text-[var(--Secondary)]">
                      {section.parent.name}
                    </p>
                    <ul className="m-0 grid w-full grid-cols-1 gap-x-5 gap-y-[30px] p-0 sm:grid-cols-2 lg:grid-cols-3">
                      {section.children.map((item) => (
                        <li key={item.id} className="list-none">
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              name="attribute_id[]"
                              value={String(item.id)}
                              className="h-4 w-4 shrink-0 rounded border-[var(--Border)] text-[var(--Primary)] focus:ring-[var(--Primary)]"
                            />
                            <span className="text-base text-[var(--Secondary)]">{item.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
              <div>
                <button
                  type="button"
                  disabled={attrM.isPending}
                  onClick={handleSaveAmenities}
                  className={btnPrimaryCls}
                >
                  {attrM.isPending ? "Göndərilir…" : "Saxla və ön baxış"}
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>

          <div className={wgBoxCls}>
            <h4 className={h4Cls}>
              Otaq və tutum <span className="text-[15px] font-normal opacity-85">(Capacity)</span>
            </h4>
            <div className="flex flex-col gap-[30px]">
              <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-room-count" className={labelCls}>
                    Otaq sayı *
                  </label>
                  <input
                    id="property-room-count"
                    type="number"
                    name="room_count"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    placeholder="0"
                    tabIndex={2}
                    aria-required
                    className={fieldCls}
                  />
                </fieldset>
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-bed-count" className={labelCls}>
                    Yataq sayı *
                  </label>
                  <input
                    id="property-bed-count"
                    type="number"
                    name="bed_count"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    placeholder="0"
                    tabIndex={2}
                    aria-required
                    className={fieldCls}
                  />
                </fieldset>
              </div>
              <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2">
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-bathroom-count" className={labelCls}>
                    Hamam sayı *
                  </label>
                  <input
                    id="property-bathroom-count"
                    type="number"
                    name="bathroom_count"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    placeholder="0"
                    tabIndex={2}
                    aria-required
                    className={fieldCls}
                  />
                </fieldset>
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <label htmlFor="property-max-guests" className={labelCls}>
                    Maksimum qonaq sayı *
                  </label>
                  <input
                    id="property-max-guests"
                    type="number"
                    name="max_guests"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    placeholder="0"
                    tabIndex={2}
                    aria-required
                    className={fieldCls}
                  />
                </fieldset>
              </div>
              <div>
                <button
                  type="button"
                  disabled={detailM.isPending}
                  onClick={handleSaveCapacity}
                  className={btnPrimaryCls}
                >
                  {detailM.isPending ? "Göndərilir…" : "Saxla və ön baxış"}
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      </FadeIn>
    </LayoutAdmin>
  );
}
