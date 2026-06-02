"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderWithItems } from "@/services/admin/orderService";
import { formatIdr } from "@/utils/format";
import { VariantDetail } from "@/store/AppContext";
import { generateNewPaymentToken } from "@/services/public/checkoutService";
import { useAppContext } from "@/store/AppContext";
import Script from "next/script";

declare global {
  interface Window {
    snap: any;
  }
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { color: string; text: string }> = {
    "Menunggu Pembayaran": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Menunggu Pembayaran" },
    "Sudah Dibayar": { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Sudah Dibayar" },
    "Sedang Diproses": { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Sedang Diproses" },
    "Sedang Dikirim": { color: "bg-purple-100 text-purple-800 border-purple-200", text: "Sedang Dikirim" },
    "Selesai": { color: "bg-green-100 text-green-800 border-green-200", text: "Selesai" },
    "Dibatalkan": { color: "bg-red-100 text-red-800 border-red-200", text: "Dibatalkan" },
  };
  const conf = configs[status] || configs["Menunggu Pembayaran"];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${conf.color} font-sans`}>
      {conf.text}
    </span>
  );
};

export const OrderDetailClient = ({ initialOrder }: { initialOrder: OrderWithItems }) => {
  const router = useRouter();
  const order = initialOrder;
  const { setToast } = useAppContext();

  const [isLoading, setIsLoading] = React.useState(false);

  // Midtrans Payment Logic
  const latestPayment = order.payments?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const paymentToken = latestPayment?.status === "pending" ? latestPayment.paymentToken : null;

  const handlePay = async () => {
    if (!window.snap) return;

    let activeToken = paymentToken;

    // Jika tidak ada token pending, buat token dan row payment yang baru di database
    if (!activeToken) {
      setIsLoading(true);
      try {
        const res = await generateNewPaymentToken(order.id);
        if (res.success && res.paymentToken) {
          activeToken = res.paymentToken;
        } else {
          setToast({ message: "Gagal membuat sesi pembayaran baru." });
          setIsLoading(false);
          return;
        }
      } catch (e) {
        setToast({ message: "Terjadi kesalahan saat membuat pembayaran." });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    window.snap.pay(activeToken, {
      onSuccess: function () {
        setToast({ message: "Pembayaran berhasil!" });
        router.refresh();
      },
      onPending: function () {
        setToast({ message: "Menunggu pembayaran Anda!" });
        router.refresh();
      },
      onError: function () {
        setToast({ message: "Pembayaran gagal. Silakan coba lagi." });
        router.refresh();
      },
      onClose: function () {
        console.log("Customer closed the popup without finishing the payment");
      }
    });
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""}
        strategy="lazyOnload"
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <button onClick={() => router.push("/track-order")} className="flex items-center gap-2 text-[#5A635E] hover:text-[#829E8D] mb-8 font-sans">
            <ChevronLeft size={20} /> Kembali ke Pelacakan
          </button>

          <div className="bg-white border border-[#E8D9D2] p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8D9D2] pb-6 mb-6">
              <div>
                <h1 className="font-playfair text-3xl text-[#2C302E] mb-2">Invoice LF-{order.id}</h1>
                <p className="font-sans text-[#5A635E]">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-3">
                <OrderStatusBadge status={order.status} />

                {order.status === "Menunggu Pembayaran" && (
                  <button
                    onClick={handlePay}
                    disabled={isLoading}
                    className="bg-[#4A5D4E] text-white px-5 py-2 rounded-lg font-sans font-medium hover:bg-[#3A4A3E] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Memuat..." : (paymentToken ? "Lanjutkan Pembayaran" : "Bayar Sekarang")}
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-playfair text-lg text-[#2C302E] mb-3 flex items-center gap-2"><MapPin size={18} /> Detail Pengiriman</h3>
              <div className="bg-[#FAFAF7] p-4 rounded-sm font-sans text-sm text-[#5A635E]">
                <p className="font-semibold text-[#2C302E] text-base mb-1">{order.customerName}</p>
                <p className="mb-2">{order.customerPhone}</p>
                <p className="leading-relaxed">{order.customerAddress}</p>
                {order.customerNotes && (
                  <div className="mt-4 pt-4 border-t border-[#E8D9D2]">
                    <p className="font-semibold text-[#2C302E] mb-1">Catatan Tambahan:</p>
                    <p className="italic">"{order.customerNotes}"</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-playfair text-lg text-[#2C302E] mb-4 flex items-center gap-2"><Package size={18} /> Daftar Produk</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-[#E8D9D2] pb-4 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.productImage ? (
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#829E8D] font-playfair font-bold text-xl">{item.productName.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-playfair text-[#2C302E]">{item.productName}</h4>
                      {(item.variantDetails as VariantDetail[] | null)?.length ? (
                        <p className="font-sans text-xs text-[#829E8D] mt-1">
                          {(item.variantDetails as VariantDetail[]).map(v => v.name).join(", ")}
                        </p>
                      ) : null}
                      {item.notes && (
                        <p className="font-sans text-[11px] text-gray-500 italic mt-1.5 p-2 bg-gray-50/80 rounded border border-gray-100">
                          Catatan: {item.notes}
                        </p>
                      )}
                      <p className="font-sans text-sm text-[#5A635E] mt-1.5">{item.quantity} x {formatIdr(Number(item.productPrice))}</p>
                    </div>
                    <div className="font-sans font-medium text-[#2C302E]">{formatIdr(Number(item.productPrice) * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8D9D2] pt-4 mt-4 flex justify-between items-center text-xl font-playfair text-[#2C302E]">
                <span>Total Pesanan</span>
                <span className="text-[#829E8D]">{formatIdr(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
