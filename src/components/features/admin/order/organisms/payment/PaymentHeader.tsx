"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const METHODS = ["Semua", "Transfer Bank", "E-Wallet", "Lainnya"];

export const PaymentHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentMethod = searchParams.get("method") || "Semua";

  const [query, setQuery] = useState(currentQ);

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQ) {
        updateUrl({ q: query });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, currentQ]);

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">
            Riwayat Pelunasan Kas
          </h1>
          <p className="text-gray-500">
            Rekam mutasi kas masuk, verifikasi transfer bank, e-wallet, dan status settlement Midtrans.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari Order ID / Pelanggan..."
              className="pl-10 pr-4 py-2.5 bg-white border border-brand/20 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Filter Metode Pembayaran */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {METHODS.map((type) => (
          <button
            key={type}
            onClick={() => updateUrl({ method: type === "Semua" ? "" : type })}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              currentMethod === type
                ? "bg-brand text-white shadow-sm"
                : "bg-white border border-brand/20 text-gray-600 hover:bg-brand/5"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </>
  );
};
