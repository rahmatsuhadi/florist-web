import { Metadata } from "next";
import { Suspense } from "react";
import { OrderTable } from "@/components/features/admin/order/organisms/order/OrderTable";
import { OrderHeader } from "@/components/features/admin/order/organisms/order/OrderHeader";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export const metadata: Metadata = {
  title: "Pesanan",
};


export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const suspenseKey = JSON.stringify(resolvedParams);

  return (
    <div className="space-y-6">
      <OrderHeader />
      <Suspense key={suspenseKey} fallback={<LoadingSpinner text="Memuat Pesanan..." className="py-20" />}>
        <OrderTable searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
