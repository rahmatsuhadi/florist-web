import React from "react";
import { FileText } from "lucide-react";
import Link from "next/link";
import { formatIdr } from "@/utils/format";
import {
  TableContainer, TableWrapper, TableHeader, TableHead,
  TableBody, TableRow, TableCell
} from "@/components/features/admin/core/molecules/table/Table";
import { getOrders } from "@/services/admin/orderService";
import { getStatusStyle, isUrgentOrder } from "@/utils/orderUtils";
import { TablePagination } from "@/components/features/admin/core/molecules/table/TablePagination";

interface OrderTableProps {
  searchParams: {
    q?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    limit?: string;
  };
}

export const OrderTable = async ({ searchParams }: OrderTableProps) => {
  const query = searchParams.q?.toLowerCase() || "";
  const statusFilter = searchParams.status || "Semua Status";
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";

  const page = parseInt(searchParams.page || "1", 10);
  const limit = parseInt(searchParams.limit || "10", 10);

  // Fetch filtered and paginated orders directly from the database via ORM
  const { data: currentTransactions, total: totalItems } = await getOrders({
    q: query,
    status: statusFilter,
    startDate,
    endDate,
    page,
    limit
  });

  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, Math.max(1, totalPages)));

  return (
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
                      {/* @ts-ignore */}
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
                    <Link
                      href={`/admin/orders/${trx.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand hover:text-white text-brand text-xs font-bold rounded-lg transition-all"
                    >
                      Detail
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </TableWrapper>

      {totalItems > 0 && (
        <TablePagination
          totalPages={totalPages}
          totalItems={totalItems}
          itemName="pesanan"
        />
      )}
    </TableContainer>
  );
};
