/** Haqqımızda səhifəsi: API-lər 200 gələnə qədər əsas blok üçün */
export default function AboutPageSkeleton() {
  return (
    <div className="px-[14px] sm:px-8 md:px-12 lg:px-20" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-[1428px]">
        <div className="mb-8 h-[200px] animate-pulse rounded-2xl bg-[#e8e8e8] md:mb-12 md:h-[280px]" />
        <div className="mb-6 flex flex-col gap-4 md:mb-10 md:flex-row md:gap-8">
          <div className="h-6 w-2/3 animate-pulse rounded bg-[#e8e8e8] md:max-w-[45%]" />
        </div>
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-[#ececec]" />
        <div className="mb-3 h-4 w-full animate-pulse rounded bg-[#ececec]" />
        <div className="mb-16 h-4 w-3/4 animate-pulse rounded bg-[#ececec] md:mb-32" />
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-[#e8e8e8]" />
          <div className="h-40 animate-pulse rounded-2xl bg-[#e8e8e8]" />
        </div>
        <div className="space-y-3">
          <div className="h-14 animate-pulse rounded-xl bg-[#f2f2f2]" />
          <div className="h-14 animate-pulse rounded-xl bg-[#f2f2f2]" />
          <div className="h-14 animate-pulse rounded-xl bg-[#f2f2f2]" />
        </div>
      </div>
    </div>
  );
}
