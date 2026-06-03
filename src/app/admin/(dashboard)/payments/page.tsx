import { Metadata } from "next";
import { getPaymentHistory } from "@/services/admin/paymentService";
import { PaymentHistory } from "@/components/organisms/admin/payment/PaymentHistory";

export const metadata: Metadata = {
  title: "Riwayat Pembayaran | Admin",
  description: "Riwayat pelunasan kas dan mutasi transaksi",
};

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await getPaymentHistory();

  return (
    <div className="p-4 md:p-8">
      <PaymentHistory payments={payments} />
    </div>
  );
}
