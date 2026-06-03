"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatIdr } from "@/utils/format";
import {
  TableContainer, TableWrapper, TableHeader, TableHead,
  TableBody, TableRow, TableCell, TablePagination
} from "@/components/molecules/admin/table/Table";
import { LoadingSpinner } from "@/components/atoms/admin/LoadingSpinner";

import { OrderWithItems, getOrders } from "@/services/admin/orderService";
import { getStatusStyle, isUrgentOrder } from "@/utils/orderUtils";

export const OrderList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [scheduleFilter, setScheduleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statuses = ["Semua Status", "Menunggu Pembayaran", "Sudah Dibayar", "Sedang Diproses", "Sedang Dikirim", "Siap Diambil", "Selesai", "Dibatalkan"];

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, scheduleFilter]);

  const filteredTransactions = orders.filter(trx => {
    const matchStatus = statusFilter === "Semua Status" || trx.status === statusFilter;
    const searchString = `${trx.id} ${trx.customerName} ${trx.customerPhone}`.toLowerCase();
    const matchSearch = searchString.includes(searchQuery.toLowerCase());
    
    let matchSchedule = true;
    if (scheduleFilter !== "all") {
      if (scheduleFilter === "urgent") {
        matchSchedule = isUrgentOrder(trx);
      } else if (scheduleFilter === "today") {
        if (!trx.scheduledDate) {
          matchSchedule = false;
        } else {
          const scheduled = new Date(trx.scheduledDate);
          const today = new Date();
          matchSchedule = scheduled.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        }
      } else if (scheduleFilter === "tomorrow") {
        if (!trx.scheduledDate) {
          matchSchedule = false;
        } else {
          const scheduled = new Date(trx.scheduledDate);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchSchedule = scheduled.setHours(0,0,0,0) === tomorrow.setHours(0,0,0,0);
        }
      } else if (scheduleFilter === "pickup") {
        // @ts-ignore
        matchSchedule = trx.deliveryMethod === "pickup";
      } else if (scheduleFilter === "delivery") {
        // @ts-ignore
        matchSchedule = trx.deliveryMethod !== "pickup";
      }
    }

    return matchStatus && matchSearch && matchSchedule;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const handleSelectTransaction = (trxId: string) => {
    router.push(`/admin/orders/${trxId}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Manajemen Pesanan</h1>
          <p className="text-gray-500">Lihat rincian pesanan dari pelanggan, kelola status pesanan, dan buka riwayat percakapan WhatsApp.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi / nama / WA..."
            className="pl-10 pr-4 py-2.5 bg-white border border-brand/20 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all w-full sm:w-64 shadow-sm"
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner text="Memuat Pesanan..." className="py-20" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-2">
              <div className="w-full sm:w-auto flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Pesanan</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-48 bg-white border border-brand/20 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm cursor-pointer"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="w-full sm:w-auto flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jadwal & Prioritas</label>
                <select
                  value={scheduleFilter}
                  onChange={(e) => setScheduleFilter(e.target.value)}
                  className="w-full sm:w-56 bg-white border border-brand/20 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm cursor-pointer"
                >
                  <option value="all">Semua Waktu / Metode</option>
                  <option value="urgent">Mendesak (Urgent)</option>
                  <option value="today">Jadwal Hari Ini</option>
                  <option value="tomorrow">Jadwal Besok</option>
                  <option value="pickup">Ambil Sendiri (Pick Up)</option>
                  <option value="delivery">Kirim via Kurir</option>
                </select>
              </div>
            </div>

            <TableContainer>
              <TableWrapper>
                <TableHeader>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Rangkaian</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Total Harga</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableHeader>
                <TableBody>
                  {currentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                        <FileText size={40} className="mx-auto text-gray-200 mb-2" />
                        Belum ada data transaksi yang cocok dengan pencarian Anda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentTransactions.map((trx) => {
                      const isUrgent = isUrgentOrder(trx);
                      return (
                        <TableRow key={trx.id} className={isUrgent ? "bg-red-50/40 relative" : ""}>
                          <TableCell className="font-bold text-brand">
                            <div className="flex flex-col items-start gap-1">
                              {trx.id}
                              {isUrgent && (
                                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider animate-pulse uppercase">
                                  Urgent
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-semibold text-gray-900">{trx.customerName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400">{trx.customerPhone}</span>
                              {/* @ts-ignore - DB schema added deliveryMethod */}
                              {trx.deliveryMethod === "pickup" ? (
                                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide">PICK UP</span>
                              ) : (
                                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide">KIRIM</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {trx.items.length > 0 ? trx.items[0].productName : "Produk tidak diketahui"}
                                </p>
                                {trx.items.length > 1 && (
                                  <p className="text-xs text-gray-400">+{trx.items.length - 1} produk lainnya</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 text-xs">
                            {new Date(trx.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </TableCell>
                          <TableCell className="font-bold text-gray-900">{formatIdr(Number(trx.totalAmount))}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusStyle(trx.status)}`}>
                              {trx.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => handleSelectTransaction(trx.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand hover:text-white text-brand text-xs font-bold rounded-lg transition-all"
                            >
                              Detail
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </TableWrapper>

              {/* Pagination Controls */}
              {filteredTransactions.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredTransactions.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(limit) => {
                    setItemsPerPage(limit);
                    setCurrentPage(1);
                  }}
                  itemName="pesanan"
                />
              )}
            </TableContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
