import React from "react";
import { Transaction } from "@/services/admin/dashboardService";
import { formatIdr } from "@/utils/format";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  TableContainer,
  TableWrapper,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@/components/molecules/admin/table/Table";

import { getStatusStyle, isUrgentOrder } from "@/utils/orderUtils";

interface DashboardRecentTransactionsProps {
  transactions: Transaction[];
}

export const DashboardRecentTransactions: React.FC<DashboardRecentTransactionsProps> = ({ transactions }) => {
  const router = useRouter();

  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-brand/10 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
        <button onClick={() => router.push('/admin/orders')} className="text-xs font-bold text-brand hover:underline">Semua Transaksi →</button>
      </div>

      <TableContainer>
        <TableWrapper>
          <TableHeader>
            <TableHead>Pelanggan / WA</TableHead>
            <TableHead>Rangkaian Bunga</TableHead>
            <TableHead>Total Harga</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 4).map((trx, i) => {
              const isUrgent = isUrgentOrder(trx);
              return (
              <TableRow key={i} className={isUrgent ? "bg-red-50/40 relative" : ""}>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-semibold text-gray-900">{trx.name}</p>
                    {isUrgent && (
                      <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold tracking-wider animate-pulse uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{trx.phone}</p>
                </TableCell>
                <TableCell className="text-gray-600 font-medium">{trx.product}</TableCell>
                <TableCell className="font-semibold text-gray-900">{formatIdr(Number(trx.total))}</TableCell>
                <TableCell className="text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(trx.status)}`}>
                    {trx.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => router.push('/admin/orders')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 hover:bg-brand hover:text-white text-brand text-xs font-bold rounded-lg transition-all"
                  >
                    Detail <ChevronRight size={12} />
                  </button>
                </TableCell>
              </TableRow>
              );
            })}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Belum ada transaksi terbaru
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableWrapper>
      </TableContainer>
    </div>
  );
};
