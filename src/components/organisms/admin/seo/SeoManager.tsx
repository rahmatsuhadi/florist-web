"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Search, LayoutTemplate, Box, Type, AlignLeft, Hash, Globe } from "lucide-react";
import { useSeo } from "@/hooks/admin/useSeo";
import { LoadingSpinner } from "@/components/atoms/admin/LoadingSpinner";

export const SeoManager = () => {
  const {
    activeTab,
    setActiveTab,
    formData,
    isLoading,
    isSaving,
    handleChange,
    handleSave,
  } = useSeo();

  const tabs = [
    { id: "home", label: "Halaman Utama", icon: LayoutTemplate },
    { id: "products", label: "Katalog Produk", icon: Box },
    { id: "categories", label: "Kategori Bunga", icon: Search },
  ];

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">SEO Manager</h1>
          <p className="text-gray-500">Optimasi meta tag untuk meningkatkan visibilitas pencarian Google.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-white border border-gray-100 rounded-2xl w-max max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-brand/10 text-brand" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner text="Memuat Data SEO..." className="py-20" />
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Konfigurasi Meta Tags - {tabs.find(t => t.id === activeTab)?.label}
                  </h3>
                  <p className="text-xs text-gray-500">Data ini dibaca oleh mesin pencari seperti Google dan media sosial.</p>
                </div>
              </div>

              <form id="seo-form" onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type size={16} className="text-brand/70" />
                    Meta Title (Judul Halaman)
                  </label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Contoh: Toko Bunga Premium Jakarta | Florist XYZ"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
                  />
                  <p className="text-[11px] text-gray-400">Disarankan 50-60 karakter. Harus relevan dengan isi halaman.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <AlignLeft size={16} className="text-brand/70" />
                    Meta Description
                  </label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Contoh: Menyediakan berbagai pilihan buket bunga segar untuk wisuda, pernikahan, dan ulang tahun..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-gray-400">Disarankan 150-160 karakter agar tidak terpotong di hasil pencarian.</p>
                    <span className={`text-[11px] font-semibold ${formData.description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                      {formData.description.length} karakter
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Hash size={16} className="text-brand/70" />
                    Meta Keywords
                  </label>
                  <input 
                    type="text" 
                    value={formData.keywords}
                    onChange={(e) => handleChange("keywords", e.target.value)}
                    placeholder="Contoh: toko bunga, buket wisuda, bunga pernikahan, florist jogja"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
                  />
                  <p className="text-[11px] text-gray-400">Pisahkan tiap kata kunci dengan koma (,). Walau tidak sepenting dulu, tetap membantu klasifikasi.</p>
                </div>
              </form>

              <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl mt-2">
                <h3 className="text-sm font-bold text-brand mb-1">💡 Tips Pintar (Variabel Dinamis)</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Anda dapat menyisipkan kode <code className="bg-white px-1.5 py-0.5 rounded text-brand border border-brand/20 font-mono">{"{{nama_toko}}"}</code> atau <code className="bg-white px-1.5 py-0.5 rounded text-brand border border-brand/20 font-mono">{"{{nama_lengkap}}"}</code> di dalam teks SEO Anda. 
                  Sistem akan otomatis menggantinya dengan nama toko yang Anda atur di halaman Storefront Settings. 
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
