"use client";

import React, { useOptimistic } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderWithItems } from "@/services/admin/orderService";
import { isUrgentOrder } from "@/utils/orderUtils";

import { OrderCustomerInfo } from "../../molecules/order/OrderCustomerInfo";
import { OrderShippingInfo } from "../../molecules/order/OrderShippingInfo";
import { OrderProductList } from "../../molecules/order/OrderProductList";
import { OrderWhatsAppPanel } from "../../molecules/order/OrderWhatsAppPanel";
import { OrderStatusUpdater } from "../../molecules/order/OrderStatusUpdater";

export const OrderDetails = ({ initialOrder, storeName }: { initialOrder: OrderWithItems, storeName: string }) => {
  const router = useRouter();
  const transaction = initialOrder;

  // Optimistic UI for status
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    transaction.status,
    (state, newStatus: string) => newStatus
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-20"
    >
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/orders")}
            type="button"
            className="p-2.5 bg-white border border-brand/20 hover:bg-brand/5 rounded-xl transition-all text-gray-600 shadow-sm"
            title="Kembali"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-serif text-3xl font-semibold text-gray-900">
                Rincian Transaksi
              </h1>
              <span className="text-sm font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md self-end mb-1 border border-gray-200">
                {transaction.id}
              </span>
            </div>
            <p className="text-gray-500">
              Detail pesanan, alamat pengiriman, dan penanganan status.
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center self-start sm:self-auto">
          <button
            onClick={() => router.push("/admin/orders")}
            className="px-5 py-2.5 bg-white border border-brand/20 text-gray-600 rounded-xl font-medium hover:bg-brand/5 transition shadow-sm"
            type="button"
          >
            Kembali ke Daftar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Warning */}
          {isUrgentOrder({ ...transaction, status: optimisticStatus }) && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <AlertCircle className="shrink-0 mt-0.5 text-red-600" size={20} />
              <div>
                <h3 className="font-bold text-red-900 mb-1.5 flex items-center gap-2">
                  Pesanan Mendesak (URGENT)
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </h3>
                <p className="text-sm leading-relaxed text-red-700/90">
                  Pesanan ini membutuhkan perhatian segera. Status saat ini adalah <span className="font-semibold bg-red-100 px-1.5 py-0.5 rounded text-red-800">"{optimisticStatus}"</span> 
                  dan jadwal {transaction.deliveryMethod === 'pickup' ? 'pengambilan' : 'pengiriman'} telah ditetapkan pada:
                  <br/>
                  <span className="font-semibold inline-block mt-2 bg-red-100/50 px-2 py-1 rounded border border-red-200/50">
                    {/* @ts-ignore */}
                    {new Date(transaction.scheduledDate!).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} Pukul {transaction.scheduledTime}
                  </span>
                  <br/>
                  <span className="block mt-2">Ini berarti tenggat waktu adalah <strong>hari ini atau telah lewat</strong>. Mohon segera proses dan perbarui status pesanan ini.</span>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <OrderCustomerInfo transaction={transaction} />
            <OrderShippingInfo transaction={transaction} />
          </div>

          <OrderProductList transaction={transaction} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <OrderStatusUpdater 
            transaction={transaction} 
            currentStatus={optimisticStatus} 
            setOptimisticStatus={setOptimisticStatus} 
          />
          <OrderWhatsAppPanel transaction={transaction} status={optimisticStatus} storeName={storeName} />
        </div>
      </div>
    </motion.div>
  );
};
