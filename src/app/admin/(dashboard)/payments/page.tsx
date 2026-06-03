import { Metadata } from "next";
import { PaymentHistory } from "@/components/organisms/admin/payment/PaymentHistory";

export const metadata: Metadata = {
  title: "Riwayat Pembayaran | Admin",
  description: "Riwayat pelunasan kas dan mutasi transaksi",
};

export const dynamic = "force-dynamic";

export default function AdminPaymentsPage() {
  return (
    <PaymentHistory />
  );
}
