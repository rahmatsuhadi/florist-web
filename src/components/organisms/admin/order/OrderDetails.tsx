"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronLeft, Sparkles, MapPin, MessageCircle, Check, Send, FileText, Smartphone, Loader2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatIdr } from "@/utils/format";
import { OrderWithItems, updateOrderStatus } from "@/services/admin/orderService";
import { VariantDetail } from "@/store/AppContext";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/molecules/LocationPicker"), { ssr: false });

export const OrderDetails = ({ initialOrder }: { initialOrder: OrderWithItems }) => {
  const router = useRouter();
  const transaction = initialOrder;

  const [status, setStatus] = useState(transaction.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const cleanPhone = transaction.customerPhone.replace(/[^0-9]/g, "");

  const getWAMessage = () => {
    const baseGreeting = `Halo ${transaction.customerName}, terima kasih telah mempercayakan momen spesial Anda kepada Magnolia Florist. ✨\n\n`;
    if (status === "Menunggu Pembayaran") {
      return encodeURIComponent(
        `${baseGreeting}Kami ingin mengonfirmasi pesanan rangkaian *${transaction.items.length > 0 ? transaction.items[0].productName : "bunga"}* Anda dengan kode transaksi *${transaction.id}* sebesar *${formatIdr(Number(transaction.totalAmount))}*.\n\nMohon lakukan transfer ke rekening bank kami dan kirimkan bukti transfer ke chat ini agar kami dapat memproses pesanan Anda. Terima kasih!`
      );
    } else if (status === "Sudah Dibayar") {
      return encodeURIComponent(
        `${baseGreeting}Kami telah menerima pembayaran Anda untuk pesanan *${transaction.id}* berisikan *${transaction.items.length > 0 ? transaction.items[0].productName : "bunga"}*.\n\nTerima kasih atas konfirmasinya. Pembayaran Anda telah terverifikasi dengan sukses!`
      );
    } else if (status === "Sedang Diproses") {
      return encodeURIComponent(
        `${baseGreeting}Kabar baik! Saat ini pesanan Anda *${transaction.id}* sedang dirangkai oleh tim Florist kami dengan dedikasi penuh. Kami akan segera menginfokan kembali saat pesanan siap diantar.`
      );
    } else if (status === "Sedang Dikirim") {
      return encodeURIComponent(
        `${baseGreeting}Pesanan mawar/bunga indah Anda *${transaction.id}* saat ini sudah diserahkan ke kurir dan sedang dalam perjalanan menuju alamat tujuan.\n\nSemoga bunga sampai dengan aman dan segar bugar!`
      );
    } else if (status === "Siap Diambil") {
      return encodeURIComponent(
        `${baseGreeting}Kabar baik! Pesanan Anda *${transaction.id}* sudah selesai dirangkai dan siap untuk diambil di toko kami. Ditunggu kedatangannya ya! 🌸`
      );
    } else if (status === "Selesai") {
      return encodeURIComponent(
        `${baseGreeting}Pesanan Anda *${transaction.id}* berisikan *${transaction.items.length > 0 ? transaction.items[0].productName : "bunga"}* telah berhasil dikirimkan ke alamat tujuan dengan selamat. 🌸\n\nSemoga rangkaian kami dapat memperindah momen istimewa Anda hari ini. Jika berkenan, silakan bagikan kepuasan Anda bersama kami di Instagram!`
      );
    } else {
      return encodeURIComponent(
        `${baseGreeting}Kami ingin menginformasikan bahwa transaksi *${transaction.id}* saat ini berstatus dibatalkan.`
      );
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      setStatus(newStatus);
      await updateOrderStatus(transaction.id, newStatus);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status");
      setStatus(transaction.status); // revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-brand/10 shadow-sm sticky top-0 z-30 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/orders")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-semibold text-gray-900">
                Rincian Transaksi
              </h1>
              <span className="text-sm font-mono text-gray-400">
                ({transaction.id})
              </span>
            </div>
            <p className="text-gray-500">
              Detail pesanan, alamat pengiriman, dan penanganan status.
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/orders")}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition text-sm self-start"
        >
          Kembali ke Daftar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-semibold text-gray-900">Detail Produk & Kustomisasi</h3>
              <span className="text-xs text-gray-400 font-medium">
                Dipesan {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </span>
            </div>

            <div className="space-y-4">
              {transaction.items.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 items-start bg-[#FDFBF7]/60 p-4 rounded-2xl border border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles size={24} className="text-brand" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] bg-brand/15 text-brand px-2 py-0.5 rounded-full font-bold uppercase">{item.productCategory || "Umum"}</span>
                    <h4 className="font-serif font-bold text-lg text-gray-950 mt-1">{item.productName} <span className="text-sm font-medium text-gray-500">(x{item.quantity})</span></h4>

                    {item.variantDetails && (item.variantDetails as VariantDetail[]).length > 0 ? (
                      <div className="pt-2 space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Opsi Variasi:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.variantDetails as VariantDetail[]).map((v, i) => (
                            <span key={i} className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg font-medium shadow-sm flex items-center gap-1">
                              <Check size={12} className="text-brand" /> {v.groupName || "Variasi"}: {v.name} {v.price > 0 && `(+${formatIdr(v.price)})`}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Tidak ada opsi variasi tambahan.</p>
                    )}

                    {item.notes && (
                      <div className="pt-2">
                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Catatan Khusus:</p>
                        <p className="text-xs text-gray-600 bg-amber-50 p-2.5 rounded-lg border border-amber-100 italic leading-relaxed">
                          "{item.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-light text-brand rounded-lg mt-0.5"><MapPin size={16} /></div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">
                    {/* @ts-ignore - db schema updated */}
                    {transaction.deliveryMethod === "pickup" ? "Metode Pengambilan" : "Alamat Pengiriman"}
                  </h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed font-sans">
                    {/* @ts-ignore */}
                    {transaction.deliveryMethod === "pickup" ? "Pelanggan akan mengambil pesanan sendiri di toko (Pick Up)." : transaction.customerAddress}
                  </p>
                  
                  {/* @ts-ignore */}
                  {transaction.deliveryMethod !== "pickup" && transaction.customerLatitude && transaction.customerLongitude && (
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setShowMap(!showMap)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold rounded-lg transition-all"
                        >
                          <MapPin size={12} /> {showMap ? "Tutup Peta" : "Lihat Peta Tersemat"}
                        </button>
                        <a
                          // @ts-ignore
                          href={`https://www.google.com/maps?q=${transaction.customerLatitude},${transaction.customerLongitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand text-[11px] font-bold rounded-lg transition-all"
                        >
                          <MapPin size={12} /> Buka di Google Maps
                        </a>
                      </div>

                      {showMap && (
                        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden relative z-0">
                          <LocationPicker 
                            position={{ 
                              // @ts-ignore
                              lat: Number(transaction.customerLatitude), 
                              // @ts-ignore
                              lng: Number(transaction.customerLongitude) 
                            }} 
                            readOnly={true} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Jadwal Pengiriman/Pengambilan */}
              {/* @ts-ignore */}
              {(transaction.scheduledDate || transaction.scheduledTime) && (
                <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5"><Calendar size={16} /></div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">
                      {/* @ts-ignore */}
                      {transaction.deliveryMethod === "pickup" ? "Jadwal Pengambilan" : "Jadwal Pengiriman"}
                    </h5>
                    <p className="text-xs text-gray-600 mt-1 font-sans">
                      <span className="font-semibold text-gray-800">Tanggal:</span> {/* @ts-ignore */} {transaction.scheduledDate || "-"}<br/>
                      <span className="font-semibold text-gray-800">Jam:</span> {/* @ts-ignore */} {transaction.scheduledTime || "-"}
                    </p>
                  </div>
                </div>
              )}

              {/* <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg mt-0.5"><FileText size={16} /></div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-sm">Catatan Ucapan Kartu</h5>
                  <p className="text-xs text-gray-600 mt-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100 leading-relaxed italic">
                    "{transaction.customerNotes || "Tidak ada catatan ucapan."}"
                  </p>
                </div>
              </div> */}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
            <div className="border-b pb-3">
              <h3 className="font-serif text-lg font-semibold text-gray-900">Alur Tanggapan WhatsApp</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-gray-900">Kirim Update Status via WhatsApp</h4>
                <p className="text-xs text-gray-400">Kirim teks konfirmasi transaksi otomatis dari sistem ke chat pembeli secara langsung.</p>
              </div>
              <a
                href={`https://wa.me/${cleanPhone}?text=${getWAMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
              >
                <Send size={14} /> Hubungi Pembeli
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
            <div className="border-b pb-3">
              <h3 className="font-serif text-lg font-semibold text-gray-900">Kelola Status & Pembayaran</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Ubah Status Transaksi
                  {isUpdating && <Loader2 size={12} className="inline animate-spin ml-2 text-brand" />}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    // @ts-ignore
                    const isPickup = transaction.deliveryMethod === "pickup";
                    let available = [status];
                    if (status === "Menunggu Pembayaran") available = ["Menunggu Pembayaran", "Sudah Dibayar", "Dibatalkan"];
                    else if (status === "Sudah Dibayar") available = ["Sudah Dibayar", "Sedang Diproses", "Dibatalkan"];
                    else if (status === "Sedang Diproses") available = ["Sedang Diproses", isPickup ? "Siap Diambil" : "Sedang Dikirim", "Dibatalkan"];
                    else if (status === "Sedang Dikirim") available = ["Sedang Dikirim", "Selesai", "Dibatalkan"];
                    else if (status === "Siap Diambil") available = ["Siap Diambil", "Selesai", "Dibatalkan"];
                    else if (status === "Selesai") available = ["Selesai"];
                    else if (status === "Dibatalkan") available = ["Dibatalkan"];

                    return available.map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        disabled={isUpdating || status === st}
                        className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-all ${status === st
                          ? 'bg-brand text-white border-brand cursor-default'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
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

          <div className="bg-brand-light/40 p-5 rounded-2xl border border-brand/10 space-y-3">
            <h4 className="font-semibold text-xs text-brand uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone size={14} /> Identitas Pelanggan
            </h4>
            <div className="text-xs space-y-1.5 text-gray-600 font-sans">
              <p><strong>Nama:</strong> {transaction.customerName}</p>
              <p><strong>Kontak WA:</strong> {transaction.customerPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
