"use client";

import React, { useActionState, useEffect, useState } from "react";
import { Globe, Type, AlignLeft, Hash } from "lucide-react";
import { toast } from "sonner";
import { updateSeoAction } from "@/services/actions/seoActions";
import type { ActionState } from "@/services/actions/seoSchemas";
import type { SeoSettingsData } from "@/services/admin/seoService";
import { SeoSaveButton } from "../atoms/SeoSaveButton";

interface SeoFormCardProps {
  initialData: SeoSettingsData;
  label: string;
}

const initialState: ActionState = { success: false, message: "" };

export const SeoFormCard: React.FC<SeoFormCardProps> = ({ initialData, label }) => {
  const [state, formAction] = useActionState(updateSeoAction, initialState);
  const [description, setDescription] = useState(initialData.description || "");

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div className="bg-white p-6 rounded-xl border border-brand/20 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
          <Globe size={20} />
        </div>
        <div>
          <h3 className="font-serif text-xl text-gray-900">
            Konfigurasi Meta Tags - {label}
          </h3>
          <p className="text-sm text-gray-500">
            Data ini dibaca oleh mesin pencari seperti Google dan media sosial.
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="pageName" value={initialData.pageName} />

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Type size={16} className="text-brand/70" />
            Meta Title (Judul Halaman)
          </label>
          <input
            type="text"
            name="title"
            defaultValue={initialData.title}
            placeholder="Contoh: Toko Bunga Premium Jakarta | Florist XYZ"
            className="w-full px-4 py-2.5 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm text-gray-900"
          />
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-gray-500">Disarankan 50-60 karakter. Harus relevan dengan isi halaman.</p>
            {state.errors?.title && (
              <span className="text-[11px] font-semibold text-red-500">{state.errors.title[0]}</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <AlignLeft size={16} className="text-brand/70" />
            Meta Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Menyediakan berbagai pilihan buket bunga segar untuk wisuda, pernikahan, dan ulang tahun..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm resize-none text-gray-900"
          />
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-gray-500">Disarankan 150-160 karakter agar tidak terpotong di hasil pencarian.</p>
            <div className="flex items-center gap-3">
              {state.errors?.description && (
                <span className="text-[11px] font-semibold text-red-500">{state.errors.description[0]}</span>
              )}
              <span className={`text-[11px] font-semibold ${description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {description.length} karakter
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Hash size={16} className="text-brand/70" />
            Meta Keywords
          </label>
          <input
            type="text"
            name="keywords"
            defaultValue={initialData.keywords}
            placeholder="Contoh: toko bunga, buket wisuda, bunga pernikahan, florist jogja"
            className="w-full px-4 py-2.5 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm text-gray-900"
          />
          <div className="flex justify-between items-center">
             <p className="text-[11px] text-gray-500">Pisahkan tiap kata kunci dengan koma (,). Walau tidak sepenting dulu, tetap membantu klasifikasi.</p>
             {state.errors?.keywords && (
                <span className="text-[11px] font-semibold text-red-500">{state.errors.keywords[0]}</span>
              )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <SeoSaveButton />
        </div>
      </form>

      <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl mt-4">
        <h3 className="text-sm font-bold text-brand mb-1">💡 Tips Pintar (Variabel Dinamis)</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Anda dapat menyisipkan kode <code className="bg-white px-1.5 py-0.5 rounded text-brand border border-brand/20 font-mono">{"{{nama_toko}}"}</code> atau <code className="bg-white px-1.5 py-0.5 rounded text-brand border border-brand/20 font-mono">{"{{nama_lengkap}}"}</code> di dalam teks SEO Anda. 
          Sistem akan otomatis menggantinya dengan nama toko yang Anda atur di halaman Storefront Settings. 
        </p>
      </div>
    </div>
  );
};
