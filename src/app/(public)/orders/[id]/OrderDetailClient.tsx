"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Package, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrderWithItems } from "@/services/admin/orderService";
import { formatIdr } from "@/utils/format";
import { VariantDetail } from "@/store/AppContext";
import { generateNewPaymentToken } from "@/services/public/checkoutService";
import { useAppContext } from "@/store/AppContext";
import { useShopStore } from "@/store/shopStore";
import Script from "next/script";
import { PaymentDetails } from "@/types/midtrans";

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
    "Siap Diambil": { color: "bg-teal-100 text-teal-800 border-teal-200", text: "Siap Diambil" },
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
  const shopStore = useShopStore();

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "Pesanan Anda telah kami terima. Silakan selesaikan pembayaran agar pesanan dapat segera diproses.";
      case "Sudah Dibayar":
        return "Pembayaran telah terverifikasi. Pesanan Anda akan segera diproses oleh tim kami.";
      case "Sedang Diproses":
        return "Tim florist kami sedang merangkai pesanan Anda dengan penuh dedikasi.";
      case "Sedang Dikirim":
        return "Pesanan Anda sedang dalam perjalanan ke lokasi tujuan oleh kurir kami.";
      case "Siap Diambil":
        return "Pesanan sudah siap diambil ke toko fisik kami. Ditunggu kedatangannya ya!";
      case "Selesai":
        return "Pesanan telah selesai. Terima kasih telah berbelanja bersama kami!";
      case "Dibatalkan":
        return "Pesanan telah dibatalkan. Jika ada pertanyaan, hubungi kami via WhatsApp.";
      default:
        return "Menunggu konfirmasi lebih lanjut.";
    }
  };

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
        <div className="container mx-auto px-6 max-w-6xl">
          <button onClick={() => router.push("/track-order")} className="flex items-center gap-2 text-[#5A635E] hover:text-[#829E8D] mb-8 font-sans">
            <ChevronLeft size={20} /> Kembali ke Pelacakan
          </button>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Kolom Kiri: Detail Pesanan */}
            <div className="flex-1 w-full space-y-6">
              <div className="bg-white border border-[#E8D9D2] p-8 shadow-sm rounded-none">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E8D9D2] pb-6 mb-6">
                  <div>
                    <h1 className="font-playfair text-3xl text-[#2C302E] mb-2">Invoice {order.id}</h1>
                    <p className="font-sans text-[#5A635E]">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-3">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <div className="bg-[#FAFAF7] border border-[#E8D9D2] p-5 rounded-none mb-8">
                  <h4 className="font-playfair text-[#2C302E] font-bold flex items-center gap-2 mb-2 text-lg">
                    <Info size={18} className="text-[#829E8D]" /> Status Pesanan Saat Ini
                  </h4>
                  <p className="font-sans text-sm text-[#5A635E] leading-relaxed">
                    {getStatusDescription(order.status)}
                  </p>
                  {order.status === "Siap Diambil" && shopStore.latitude && shopStore.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${shopStore.latitude},${shopStore.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-[#829E8D] hover:text-[#5A635E] transition-colors font-sans text-sm font-semibold border border-[#829E8D]/30 bg-[#829E8D]/5 px-4 py-2 rounded-none"
                    >
                      <MapPin size={16} /> Buka Google Maps Toko
                    </a>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="font-playfair text-lg text-[#2C302E] mb-3 flex items-center gap-2">
                    {/* @ts-ignore */}
                    {order.deliveryMethod === "pickup" ? (
                      <><Package size={18} /> Metode Pengambilan</>
                    ) : (
                      <><MapPin size={18} /> Detail Pengiriman</>
                    )}
                  </h3>
                  <div className="bg-[#FAFAF7] p-4 rounded-none border border-[#E8D9D2] font-sans text-sm text-[#5A635E]">
                    <p className="font-semibold text-[#2C302E] text-base mb-1">{order.customerName}</p>
                    <p className="mb-2">{order.customerPhone}</p>

                    {/* @ts-ignore */}
                    {order.deliveryMethod === "pickup" ? (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-none text-amber-800">
                        <p className="font-medium">Ambil Sendiri (Pick Up)</p>
                        <p className="text-xs mt-1">Silakan ambil pesanan Anda di toko fisik kami ketika status sudah "Siap Diambil".</p>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{order.customerAddress}</p>
                    )}

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
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden rounded-none">
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
                            <p className="font-sans text-[11px] text-gray-500 italic mt-1.5 p-2 bg-gray-50/80 rounded-none border border-gray-100">
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

            {/* Kolom Kanan: Rincian Pembayaran */}
            <div className="w-full lg:w-96 shrink-0">
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
                                  <span className="text-sm font-semibold text-brand tracking-wider">{details.va_number}</span>
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
                                  <span className="text-sm font-semibold text-brand tracking-wider">{details.bill_key}</span>
                                </div>
                              )}
                              {details.payment_code && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">Kode Pembayaran</span>
                                  <span className="text-sm font-semibold text-brand tracking-wider">{details.payment_code}</span>
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

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Terakhir Diperbarui</p>
                        <p className="font-medium text-[#2C302E]">
                          {new Date(latestPayment.updatedAt).toLocaleString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      </div>
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
            </div>

          </div>
        </div>
      </motion.div>
    </>
  );
};
