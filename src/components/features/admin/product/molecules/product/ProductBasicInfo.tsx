"use client";

import React from "react";
import { Product } from "@/services/admin/productService";
import { CATEGORIES } from "@/constants/mockData";
import { CurrencyInput } from "@/components/ui/CurrencyInput";

interface ProductBasicInfoProps {
  initialData?: Product | null;
  errors?: Record<string, string[]>;
  submittedData?: {
    name?: string;
    basePrice?: string;
    category?: string;
    description?: string;
  };
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  initialData,
  errors,
  submittedData,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5 mt-6">
      <h2 className="font-serif text-lg font-semibold text-gray-900 border-b pb-3">
        Informasi Dasar
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nama Produk
        </label>
        <input
          key={`name-${submittedData?.name ?? initialData?.name ?? ""}`}
          type="text"
          name="name"
          defaultValue={submittedData?.name ?? initialData?.name ?? ""}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50"
          placeholder="Contoh: Classic Red Rose"
        />
        {errors?.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Kategori
        </label>
        <select
          key={`category-${submittedData?.category ?? initialData?.category ?? ""}`}
          name="category"
          defaultValue={submittedData?.category ?? initialData?.category ?? ""}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50 appearance-none"
        >
          <option value="">Pilih Kategori</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors?.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Harga Dasar (Rp)
        </label>
        <CurrencyInput
          key={`price-${submittedData?.basePrice ?? initialData?.basePrice ?? ""}`}
          name="basePrice"
          defaultValue={submittedData?.basePrice ?? initialData?.basePrice ?? ""}
          placeholder="0"
        />
        {errors?.basePrice && (
          <p className="text-red-500 text-xs mt-1">{errors.basePrice[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Deskripsi
        </label>
        <textarea
          key={`desc-${submittedData?.description ?? initialData?.description ?? ""}`}
          rows={4}
          name="description"
          defaultValue={submittedData?.description ?? initialData?.description ?? ""}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50 resize-none"
          placeholder="Tuliskan deskripsi produk..."
        ></textarea>
        {errors?.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
        )}
      </div>
    </div>
  );
};
