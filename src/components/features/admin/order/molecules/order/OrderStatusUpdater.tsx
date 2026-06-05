"use client";

import React, { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { formatIdr } from "@/utils/format";
import { OrderWithItems, updateOrderStatus } from "@/services/admin/orderService";
import { VariantDetail } from "@/store/AppContext";
import { toast } from "sonner";

interface OrderStatusUpdaterProps {
  transaction: OrderWithItems;
  currentStatus: string;
  setOptimisticStatus: (newStatus: string) => void;
}

export const OrderStatusUpdater = ({ transaction, currentStatus, setOptimisticStatus }: OrderStatusUpdaterProps) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      try {
        await updateOrderStatus(transaction.id, newStatus);
        toast.success("Status pesanan berhasil diperbarui");
      } catch (error) {
        console.error(error);
        toast.error("Gagal memperbarui status");
        setOptimisticStatus(transaction.status); // Revert to initial status from db on error
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
      <div className="border-b pb-3">
        <h3 className="font-serif text-lg font-semibold text-gray-900">Kelola Status & Pembayaran</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
            Ubah Status Transaksi
            {isPending && <Loader2 size={14} className="inline animate-spin ml-2 text-brand" />}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(() => {
              // @ts-ignore
              const isPickup = transaction.deliveryMethod === "pickup";
              let available = [currentStatus];
              if (currentStatus === "Menunggu Pembayaran") available = ["Menunggu Pembayaran", "Sudah Dibayar", "Dibatalkan"];
              else if (currentStatus === "Sudah Dibayar") available = ["Sudah Dibayar", "Sedang Diproses", "Dibatalkan"];
              else if (currentStatus === "Sedang Diproses") available = ["Sedang Diproses", isPickup ? "Siap Diambil" : "Sedang Dikirim", "Dibatalkan"];
              else if (currentStatus === "Sedang Dikirim") available = ["Sedang Dikirim", "Selesai", "Dibatalkan"];
              else if (currentStatus === "Siap Diambil") available = ["Siap Diambil", "Selesai", "Dibatalkan"];
              else if (currentStatus === "Selesai") available = ["Selesai"];
              else if (currentStatus === "Dibatalkan") available = ["Dibatalkan"];

              return available.map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  disabled={isPending || currentStatus === st}
                  className={`py-2.5 px-3 rounded-xl border font-semibold text-sm transition-all ${currentStatus === st
                    ? 'bg-brand text-white border-brand cursor-default'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {st}
                </button>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
