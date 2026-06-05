import { Suspense } from "react";
import { DashboardOverview } from "@/components/features/admin/core/organisms/dashboard/DashboardOverview";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Memuat Dashboard..." className="h-[60vh]" />}>
      <DashboardOverview />
    </Suspense>
  );
}
