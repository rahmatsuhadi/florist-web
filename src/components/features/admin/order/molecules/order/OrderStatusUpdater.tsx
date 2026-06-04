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

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Ubah Status Transaksi
            {isPending && <Loader2 size={12} className="inline animate-spin ml-2 text-brand" />}
          </label>
          <div className="grid grid-cols-2 gap-2">
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
                  className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-all ${currentStatus === st
                    ? 'bg-brand text-white border-brand cursor-default'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {st}
                </button>
              ));
            })()}
          </div>
        </div>
      </div>

      <div className="border-t pt-4 space-y-2.5">
        {transaction.items.map(item => (
          <div key={`item-${item.id}`}>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span className="font-medium text-gray-700">{item.productName} (x{item.quantity})</span>
              <span>{formatIdr(Number(item.productPrice) * item.quantity)}</span>
            </div>

            {(item.variantDetails as VariantDetail[] | null)?.map((v, idx) => (
              <div key={idx} className="flex justify-between text-xs text-gray-400 pl-2">
                <span className="truncate max-w-[150px]">- {v.name}</span>
                <span>{v.priceType === "replace" ? "Ganti Harga" : `+${formatIdr(v.price)}`}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="border-t border-dashed pt-3 flex justify-between font-serif font-bold text-gray-900 text-base">
          <span>Total Tagihan</span>
          <span className="text-brand font-sans font-bold">{formatIdr(Number(transaction.totalAmount))}</span>
        </div>
      </div>
    </div>
  );
};
