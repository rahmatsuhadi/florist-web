import React from "react";
import { DashboardMetrics } from "@/services/admin/dashboardService";
import { formatIdr } from "@/utils/format";
import { ShoppingBag, Clock, Send, TrendingUp } from "lucide-react";

interface DashboardStatsCardsProps {
  metrics: DashboardMetrics;
}

export const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <ShoppingBag size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Menunggu Pembayaran</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{metrics.pendingPayment} Pesanan</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Sudah Dibayar / Diproses</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{metrics.processingOrders} Pesanan</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
          <Send size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Sedang Dikirim</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{metrics.shippingOrders} Pesanan</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-[#B88B8C]">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Selesai</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{formatIdr(metrics.totalRevenue)}</h3>
        </div>
      </div>
    </div>
  );
};
