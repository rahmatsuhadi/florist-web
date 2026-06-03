"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { getOrdersByPhone } from "@/services/public/checkoutService";
import { OrderWithItems } from "@/services/admin/orderService";
import { formatIdr } from "@/utils/format";

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

export const TrackOrderClient = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [searchResults, setSearchResults] = useState<OrderWithItems[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSearching(true);
    try {
      const results = await getOrdersByPhone(phone.trim());
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl text-[#2C302E] mb-4">Lacak Pesanan</h2>
          <p className="font-sans text-[#5A635E] max-w-2xl mx-auto">
            Masukkan nomor WhatsApp yang Anda gunakan saat checkout untuk melihat status pesanan Anda.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 bg-white p-3 sm:p-2 rounded-sm shadow-sm border border-[#E8D9D2]">
          <input 
            type="tel" 
            placeholder="Contoh: 08123456789" 
            className="flex-1 px-3 sm:px-4 py-2 font-sans focus:outline-none bg-transparent w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button type="submit" disabled={isSearching} className="w-full sm:w-auto gap-2 px-8 py-3 sm:py-2 bg-[#829E8D] text-white flex items-center justify-center">
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Cari</>}
          </Button>
        </form>

        {searchResults && (
          <div className="space-y-6">
            <h3 className="font-playfair text-xl text-[#2C302E] mb-4">Hasil Pencarian ({searchResults.length})</h3>
            {searchResults.length === 0 ? (
              <div className="bg-white p-8 text-center border border-[#E8D9D2] text-[#5A635E] font-sans">
                Tidak ada pesanan yang ditemukan untuk nomor {phone}.
              </div>
            ) : (
              searchResults.map(order => (
                <div key={order.id} onClick={() => router.push(`/orders/${order.id}`)} className="bg-white border border-[#E8D9D2] p-6 hover:shadow-md transition-shadow cursor-pointer group flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-playfair text-lg font-bold text-[#2C302E]">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="font-sans text-sm text-[#5A635E]">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                    <p className="font-sans text-sm text-[#5A635E] mt-1">{order.items.length} item • {formatIdr(Number(order.totalAmount))}</p>
                  </div>
                  <div className="text-[#829E8D] group-hover:translate-x-2 transition-transform">
                    <ArrowRight size={24} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
