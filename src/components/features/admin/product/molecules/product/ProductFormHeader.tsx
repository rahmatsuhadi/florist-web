"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductFormHeaderProps {
  isEditMode: boolean;
  isPending: boolean;
  onDeleteClick: () => void;
}

export const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEditMode,
  isPending,
  onDeleteClick,
}) => {
  const router = useRouter();

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/products")}
          type="button"
          className="p-2.5 bg-white border border-brand/20 hover:bg-brand/5 rounded-xl transition-all text-gray-600 shadow-sm"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">
            {isEditMode ? "Edit Produk" : "Buat Produk Baru"}
          </h1>
          <p className="text-gray-500">
            Atur detail produk, foto utama, dan variasi.
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        {isEditMode && (
          <button
            onClick={onDeleteClick}
            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition shadow-sm"
            type="button"
          >
            Hapus
          </button>
        )}
        <button
          onClick={() => router.push("/admin/products")}
          type="button"
          className="px-5 py-2.5 bg-white border border-brand/20 text-gray-600 rounded-xl font-medium hover:bg-brand/5 transition shadow-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover transition shadow-sm disabled:opacity-70 flex items-center gap-2"
        >
          {isPending ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>
    </header>
  );
};
