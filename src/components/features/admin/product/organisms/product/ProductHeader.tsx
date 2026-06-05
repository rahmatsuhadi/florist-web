"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES } from "@/constants/mockData";

export const ProductHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentQuery = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "Semua";

  const [query, setQuery] = useState(currentQuery);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      
      const newQueryParam = params.get("q") || "";
      const oldQueryParam = searchParams.get("q") || "";
      
      if (newQueryParam !== oldQueryParam) {
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, pathname, router, searchParams]);

  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId && categoryId !== "Semua") {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">
            Katalog Produk
          </h1>
          <p className="text-gray-500">
            Kelola inventory, harga, dan variasi rangkaian bunga.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="pl-10 pr-4 py-2.5 bg-white border border-brand/20 rounded-xl outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl hover:bg-brand-hover transition shadow-sm font-medium whitespace-nowrap"
          >
            <Plus size={18} /> Tambah Baru
          </Link>
        </div>
      </header>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[{ id: "Semua", name: "Semua Kategori" }, ...CATEGORIES].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              currentCategory === category.id
                ? "bg-brand text-white shadow-sm"
                : "bg-white border border-brand/20 text-gray-600 hover:bg-brand/5"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </>
  );
};
