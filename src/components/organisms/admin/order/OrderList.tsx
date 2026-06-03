"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatIdr } from "@/utils/format";
import { 
  TableContainer, TableWrapper, TableHeader, TableHead, 
  TableBody, TableRow, TableCell, TablePagination 
} from "@/components/molecules/admin/table/Table";

import { OrderWithItems } from "@/services/admin/orderService";

export const OrderList = ({ initialOrders }: { initialOrders: OrderWithItems[] }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const statuses = ["Semua Status", "Menunggu Pembayaran", "Sudah Dibayar", "Sedang Diproses", "Sedang Dikirim", "Selesai", "Dibatalkan"];

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredTransactions = initialOrders.filter(trx => {
    const matchStatus = statusFilter === "Semua Status" || trx.status === statusFilter;
    const searchString = `${trx.id} ${trx.customerName} ${trx.customerPhone}`.toLowerCase();
    const matchSearch = searchString.includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran": return "bg-orange-50 border border-orange-200 text-orange-700";
      case "Sudah Dibayar": return "bg-blue-50 border border-blue-200 text-blue-700";
      case "Sedang Diproses": return "bg-purple-50 border border-purple-200 text-purple-700";
      case "Sedang Dikirim": return "bg-yellow-50 border border-yellow-200 text-yellow-700";
      case "Selesai": return "bg-emerald-50 border border-emerald-200 text-emerald-700";
      case "Dibatalkan": return "bg-red-50 border border-red-200 text-red-700";
      default: return "bg-gray-50 border border-gray-200 text-gray-700";
    }
  };

  const handleSelectTransaction = (trxId: string) => {
    router.push(`/admin/orders/${trxId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
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

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${statusFilter === status
              ? 'bg-brand text-white shadow-sm'
              : 'bg-white border border-brand/20 text-gray-600 hover:bg-brand/5'
              }`}
          >
            {status}
          </button>
        ))}
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
              currentTransactions.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="font-bold text-brand">{trx.id}</TableCell>
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
              ))
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
  );
};
