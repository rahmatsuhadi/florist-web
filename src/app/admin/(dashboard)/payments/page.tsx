import { Metadata } from "next";
import { Suspense } from "react";
import { PaymentHeader } from "@/components/features/admin/order/organisms/payment/PaymentHeader";
import { PaymentStats } from "@/components/features/admin/order/organisms/payment/PaymentStats";
import { PaymentTable } from "@/components/features/admin/order/organisms/payment/PaymentTable";
import { LoadingSpinner } from "@/components/features/admin/core/atoms/LoadingSpinner";

export const metadata: Metadata = {
  title: "Riwayat Pembayaran | Admin",
  description: "Riwayat pelunasan kas dan mutasi transaksi",
};


export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const suspenseKey = JSON.stringify(resolvedParams);

  return (
    <div className="space-y-6">
      <PaymentHeader />
      <PaymentStats />
      <Suspense key={suspenseKey} fallback={<LoadingSpinner text="Memuat Riwayat..." className="py-20" />}>
        <PaymentTable searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
