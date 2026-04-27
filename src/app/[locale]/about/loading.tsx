import AboutPageSkeleton from "@/components/about/AboutPageSkeleton";

/** Növbəti səhifəyə keçid zamanı App Router segment Suspense örtüyü (ilk RSC/client payload gələnə qədər). */
export default function AboutLoading() {
  return <AboutPageSkeleton />;
}
