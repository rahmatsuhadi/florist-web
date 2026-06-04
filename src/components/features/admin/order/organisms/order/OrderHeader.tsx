"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DatePickerModal } from "@/components/ui/DatePickerModal";

export const OrderHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentStatus = searchParams.get("status") || "Semua Status";
  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";

  const [query, setQuery] = useState(currentQ);

  const statuses = [
    "Semua Status",
    "Menunggu Pembayaran",
    "Sudah Dibayar",
    "Sedang Diproses",
    "Sedang Dikirim",
    "Siap Diambil",
    "Selesai",
    "Dibatalkan",
  ];

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always reset page to 1 when filters change
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQ) {
        updateUrl({ q: query });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, currentQ]);


  return (
    <div className="space-y-6 mb-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Manajemen Pesanan</h1>
          <p className="text-gray-500">
            Lihat rincian pesanan dari pelanggan, kelola status pesanan, dan jadwal pengiriman.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pesanan / nama / WA..."
              className="pl-10 pr-4 py-2.5 bg-white border border-brand/20 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Filter Status (Select) */}
        <div className="w-full sm:w-auto shrink-0">
          <select
            value={currentStatus}
            onChange={(e) => updateUrl({ status: e.target.value === "Semua Status" ? "" : e.target.value })}
            className="w-full sm:w-48 bg-white border border-brand/20 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm cursor-pointer transition-all hover:border-brand/40"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Jadwal (Rentang Tanggal) */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 scrollbar-hide shrink-0">
          <DatePickerModal
            initialStartDate={currentStartDate}
            initialEndDate={currentEndDate}
            onApply={(start, end) => updateUrl({ startDate: start, endDate: end })}
          />
        </div>
      </div>
    </div>
  );
};
