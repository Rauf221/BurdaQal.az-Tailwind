import { notFound } from "next/navigation";
import DashboardAddPropertiesClient from "@/components/dashboard/DashboardAddPropertiesClient";

function parseAnnouncementId(value: string): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.trunc(n);
}

export default async function DashboardEditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcementId = parseAnnouncementId(id);
  if (announcementId == null) {
    notFound();
  }
  return (
    <DashboardAddPropertiesClient
      initialAnnouncementId={announcementId}
      breadcrumbTitle="Edit Property"
    />
  );
}
