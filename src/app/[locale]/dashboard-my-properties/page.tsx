import DashboardMyPropertiesClient from "@/components/dashboard/DashboardMyPropertiesClient";
import LayoutAdmin from "@/components/layout/admin/LayoutAdmin";

export default function DashboardMyPropertiesPage() {
  return (
    <LayoutAdmin breadcrumbTitle="My Properties">
      <DashboardMyPropertiesClient />
    </LayoutAdmin>
  );
}
