"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShoppingBag,
  Clock,
  Send,
  TrendingUp,
  ChevronRight,
  Plus,
  Globe
} from "lucide-react";
import { formatIdr } from "@/utils/format";

import {
  getDashboardStats,
  getRecentTransactions,
  DashboardMetrics,
  Transaction
} from "@/services/admin/dashboardService";

export const DashboardOverview = () => {
  const router = useRouter();

  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, trxData] = await Promise.all([
          getDashboardStats(),
          getRecentTransactions()
        ]);
        setMetrics(statsData);
        setTransactions(trxData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran": return "bg-yellow-100 text-yellow-700";
      case "Sudah Dibayar": return "bg-blue-100 text-blue-700";
      case "Sedang Diproses": return "bg-indigo-100 text-indigo-700";
      case "Sedang Dikirim": return "bg-purple-100 text-purple-700";
      case "Selesai": return "bg-green-100 text-green-700";
      case "Dibatalkan": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="bg-brand p-8 rounded-3xl text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center">
          <Sparkles size={200} />
        </div>
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-rose-200">Kinerja Hari Ini</span>
          <h1 className="font-serif text-3xl font-bold leading-tight">Selamat Datang Kembali, Admin Magnolia!</h1>
          <p className="text-gray-200 text-sm">Semua sistem florist Anda aktif. Kelola pesanan baru dari WhatsApp, perbarui katalog bunga segar Anda, atau ubah banner intro langsung melalui panel kendali.</p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-serif text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
            <button onClick={() => router.push('/admin/orders')} className="text-xs font-bold text-brand hover:underline">Semua Transaksi →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-xs">
                  <th className="pb-3 font-medium">Pelanggan / WA</th>
                  <th className="pb-3 font-medium">Rangkaian Bunga</th>
                  <th className="pb-3 font-medium">Total Harga</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.slice(0, 4).map((trx, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5">
                      <p className="font-semibold text-gray-900">{trx.name}</p>
                      <p className="text-xs text-gray-400">{trx.phone}</p>
                    </td>
                    <td className="py-3.5 text-gray-600 font-medium">{trx.product}</td>
                    <td className="py-3.5 font-semibold text-gray-900">{formatIdr(Number(trx.total))}</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(trx.status)}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => router.push('/admin/orders')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 hover:bg-brand hover:text-white text-brand text-xs font-bold rounded-lg transition-all"
                      >
                        Detail <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <h3 className="font-serif text-lg font-semibold text-gray-900 border-b pb-3">Tindakan Cepat</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/products/new')}
              className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Tambah Produk Baru</h4>
                  <p className="text-xs text-gray-400">Desain rangkaian bunga segar baru</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { }}
              className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-[#B88B8C] group-hover:bg-[#B88B8C] group-hover:text-white transition-colors">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Edit Hero Banner</h4>
                  <p className="text-xs text-gray-400">Kelola visual utama beranda toko</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
