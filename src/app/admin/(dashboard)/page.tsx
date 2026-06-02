import { DashboardOverview } from "@/components/organisms/admin/dashboard/DashboardOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Fleuriste Bouquet",
  description: "Overview dashboard for Admin Workspace",
};

export default function AdminDashboardPage() {
  return <DashboardOverview />;
}
