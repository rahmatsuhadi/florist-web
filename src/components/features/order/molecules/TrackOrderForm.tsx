"use client";

import React, { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const TrackOrderForm = ({ initialPhone = "" }: { initialPhone?: string }) => {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    startTransition(() => {
      router.push(`/track-order?phone=${encodeURIComponent(phone.trim())}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 bg-white p-3 sm:p-2 rounded-sm shadow-sm border border-[#E8D9D2]">
      <input
        type="tel"
        placeholder="Contoh: 08123456789"
        className="flex-1 px-3 sm:px-4 py-2 font-sans focus:outline-none bg-transparent w-full"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto gap-2 px-8 py-3 sm:py-2 bg-[#829E8D] text-white flex items-center justify-center">
        {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} /> Cari</>}
      </Button>
    </form>
  );
};
