"use client";

import React, { useState } from "react";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatIdr } from "@/utils/format";

import { OrderWithItems } from "@/services/admin/orderService";

export const OrderList = ({ initialOrders }: { initialOrders: OrderWithItems[] }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  const statuses = ["Semua Status", "Menunggu Pembayaran", "Sudah Dibayar", "Sedang Diproses", "Sedang Dikirim", "Selesai", "Dibatalkan"];

  const filteredTransactions = initialOrders.filter(trx => {
    const matchStatus = statusFilter === "Semua Status" || trx.status === statusFilter;
    const searchString = `${trx.id} ${trx.customerName} ${trx.customerPhone}`.toLowerCase();
    const matchSearch = searchString.includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran": return "bg-orange-100 text-orange-600";
      case "Sudah Dibayar": return "bg-blue-100 text-blue-600";
      case "Sedang Diproses": return "bg-purple-100 text-purple-600";
      case "Sedang Dikirim": return "bg-yellow-100 text-yellow-600";
      case "Selesai": return "bg-green-100 text-green-600";
      case "Dibatalkan": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const handleSelectTransaction = (trxId: number) => {
    router.push(`/admin/orders/${trxId}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Manajemen Pesanan</h1>
          <p className="text-gray-500 font-sans text-sm">Lihat rincian pesanan dari pelanggan, kelola status pesanan, dan buka riwayat percakapan WhatsApp.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi / nama / WA..."
            className="pl-10 pr-4 py-2.5 bg-white border border-[#4A5D4E]/20 rounded-xl outline-none focus:border-[#4A5D4E] focus:ring-1 focus:ring-[#4A5D4E] transition-all w-full sm:w-64 shadow-sm text-sm"
          />
        </div>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === status
                ? 'bg-[#4A5D4E] text-white shadow-sm'
                : 'bg-white border border-[#4A5D4E]/10 text-gray-500 hover:bg-[#4A5D4E]/5'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#4A5D4E]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F5F2EB]/30 text-gray-400 font-semibold uppercase text-xs">
                <th className="px-6 py-4 font-medium">ID Transaksi</th>
                <th className="px-6 py-4 font-medium">Pelanggan</th>
                <th className="px-6 py-4 font-medium">Rangkaian</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Total Harga</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <FileText size={40} className="mx-auto text-gray-200 mb-2" />
                    Belum ada data transaksi yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-[#4A5D4E]">{trx.id}</td>
                    <td className="px-6 py-4.5">
                      <p className="font-semibold text-gray-900">{trx.customerName}</p>
                      <p className="text-xs text-gray-400">{trx.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden shrink-0 flex items-center justify-center">
                          {trx.items.length > 0 && trx.items[0].productImage ? (
                            <img src={trx.items[0].productImage} alt={trx.items[0].productName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[#829E8D] font-playfair font-bold text-sm">
                              {trx.items.length > 0 ? trx.items[0].productName.charAt(0) : "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {trx.items.length > 0 ? trx.items[0].productName : "Produk tidak diketahui"}
                          </p>
                          {trx.items.length > 1 && (
                            <p className="text-xs text-gray-400">+{trx.items.length - 1} produk lainnya</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-gray-500 text-xs">
                      {new Date(trx.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4.5 font-bold text-gray-900">{formatIdr(Number(trx.totalAmount))}</td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(trx.status)}`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleSelectTransaction(trx.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A5D4E]/10 hover:bg-[#4A5D4E] hover:text-white text-[#4A5D4E] text-xs font-bold rounded-lg transition-all"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
