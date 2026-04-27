import LayoutAdmin from "@/components/layout/admin/LayoutAdmin";
import DashboardMyProfileClient from "@/components/dashboard/DashboardMyProfileClient";

export default function DashboardMyProfilePage() {
  return (
    <LayoutAdmin breadcrumbTitle="My Profiles">
      <DashboardMyProfileClient />
    </LayoutAdmin>
  );
}
