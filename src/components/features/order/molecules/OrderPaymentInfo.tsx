"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderWithItems } from "@/services/admin/orderService";
import { PaymentDetails } from "@/types/midtrans";
import { generateNewPaymentToken } from "@/services/public/checkoutService";
import { useAppContext } from "@/store/AppContext";
import Script from "next/script";

declare global {
  interface Window {
    snap: any;
  }
}

export const OrderPaymentInfo = ({ order }: { order: OrderWithItems }) => {
  const router = useRouter();
  const { setToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const latestPayment = order.payments?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const paymentToken = latestPayment?.status === "pending" ? latestPayment.paymentToken : null;

  const handlePay = async () => {
    if (!window.snap) return;

    let activeToken = paymentToken;

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
      <div className="bg-white border border-[#E8D9D2] p-6 shadow-sm rounded-none sticky top-32">
        <h2 className="font-playfair text-xl text-[#2C302E] mb-6 border-b border-[#E8D9D2] pb-4">Informasi Pembayaran</h2>

        <div className="space-y-4 mb-6 font-sans">
          <div>
            <p className="text-xs text-gray-500 mb-1">Status Pembayaran</p>
            <div className="font-semibold text-[#2C302E]">
              {latestPayment?.status === "success" ? (
                <span className="text-green-600">Lunas / Berhasil</span>
              ) : latestPayment?.status === "pending" ? (
                <span className="text-yellow-600">Menunggu Pembayaran</span>
              ) : latestPayment?.status === "expire" ? (
                <span className="text-red-600">Kadaluarsa</span>
              ) : (
                <span className="text-gray-600">Belum ada pembayaran</span>
              )}
            </div>
          </div>

          {latestPayment && (
            <>
              <div>
                <p className="text-xs text-gray-500 mb-1">Metode Pembayaran</p>
                <p className="font-medium text-[#2C302E] capitalize">
                  {latestPayment.paymentMethod ? latestPayment.paymentMethod.replace(/_/g, ' ') : "-"}
                </p>
              </div>

              {(() => {
                const details = latestPayment.paymentDetails as PaymentDetails | null;
                if (!details) return null;
                return (
                  <>
                    <div className="bg-[#FAFAF7] border border-[#E8D9D2] p-3 rounded-sm space-y-2">
                      {details.bank && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Bank</span>
                          <span className="text-sm font-semibold text-[#2C302E] uppercase">{details.bank}</span>
                        </div>
                      )}
                      {details.va_number && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">No. Virtual Account</span>
                          <span className="text-sm font-semibold text-[#829E8D] tracking-wider">{details.va_number}</span>
                        </div>
                      )}
                      {details.biller_code && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Biller Code</span>
                          <span className="text-sm font-semibold text-[#2C302E]">{details.biller_code}</span>
                        </div>
                      )}
                      {details.bill_key && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Bill Key</span>
                          <span className="text-sm font-semibold text-[#829E8D] tracking-wider">{details.bill_key}</span>
                        </div>
                      )}
                      {details.payment_code && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Kode Pembayaran</span>
                          <span className="text-sm font-semibold text-[#829E8D] tracking-wider">{details.payment_code}</span>
                        </div>
                      )}
                      {details.store && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Toko / Retail</span>
                          <span className="text-sm font-semibold text-[#2C302E] capitalize">{details.store}</span>
                        </div>
                      )}
                      {details.issuer && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">E-Wallet</span>
                          <span className="text-sm font-semibold text-[#2C302E] capitalize">{details.issuer}</span>
                        </div>
                      )}
                    </div>

                    {details.paid_at && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Waktu Pembayaran Berhasil</p>
                        <p className="font-medium text-green-700">
                          {new Date(details.paid_at).toLocaleString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>

        {order.status === "Menunggu Pembayaran" && (
          <div className="pt-4 border-t border-[#E8D9D2]">
            <button
              onClick={handlePay}
              disabled={isLoading}
              className="w-full bg-[#2C302E] text-white px-5 py-3 rounded-none font-sans font-medium hover:bg-[#1A1C1B] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memuat..." : (paymentToken ? "Lanjutkan Pembayaran" : "Bayar Sekarang")}
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-3 leading-relaxed">
              Lakukan pembayaran segera agar pesanan Anda dapat diproses.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
