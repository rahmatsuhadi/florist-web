import React from "react";
import { FileCheck, CreditCard, Clock } from "lucide-react";
import { getPaymentStats } from "@/services/admin/paymentService";
import { PaymentStatCard } from "@/components/features/admin/order/molecules/payment/PaymentStatCard";
import { formatIdr } from "@/utils/format";

export const PaymentStats = async () => {
  const stats = await getPaymentStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <PaymentStatCard
        title="Total Mutasi Verifikasi"
        value={formatIdr(stats.totalVerifiedAmount)}
        icon={FileCheck}
        colorClass="emerald"
      />
      <PaymentStatCard
        title="Jumlah Pelunasan (Sukses)"
        value={`${stats.successCount} Invoice`}
        icon={CreditCard}
        colorClass="indigo"
      />
      <PaymentStatCard
        title="Total Percobaan Bayar"
        value={`${stats.totalAttempts} Upaya`}
        icon={Clock}
        colorClass="amber"
      />
    </div>
  );
};
