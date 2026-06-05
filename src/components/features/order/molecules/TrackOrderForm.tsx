"use client";

import React, { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const TrackOrderForm = ({ initialPhone = "", initialOrderId = "" }: { initialPhone?: string, initialOrderId?: string }) => {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone);
  const [orderId, setOrderId] = useState(initialOrderId);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !orderId.trim()) return;
    startTransition(() => {
      router.push(`/track-order?orderId=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-10 bg-white p-4 rounded-sm shadow-sm border border-[#E8D9D2]">
      <div className="flex-1 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="ID Transaksi (Contoh: ORD-12345)"
          className="flex-1 px-4 py-3 font-sans focus:outline-none bg-gray-50 border border-transparent focus:border-[#829E8D] rounded-lg w-full transition-colors"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Nomor WhatsApp (Contoh: 0812...)"
          className="flex-1 px-4 py-3 font-sans focus:outline-none bg-gray-50 border border-transparent focus:border-[#829E8D] rounded-lg w-full transition-colors"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full md:w-auto gap-2 px-8 py-3 bg-[#829E8D] text-white flex items-center justify-center rounded-lg hover:bg-[#6e8577]">
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Lacak</>}
      </Button>
    </form>
  );
};
