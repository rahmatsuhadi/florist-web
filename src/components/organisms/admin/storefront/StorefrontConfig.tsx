"use client";

import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useStorefront } from "@/hooks/admin/useStorefront";
import { BasicInfoCard } from "@/components/molecules/admin/storefront/BasicInfoCard";
import { ContactCard } from "@/components/molecules/admin/storefront/ContactCard";
import { LocationCard } from "@/components/molecules/admin/storefront/LocationCard";

export const StorefrontConfig = () => {
  const {
    formData,
    isLoading,
    isSaving,
    handleChange,
    handleLocationChange,
    handleSave,
  } = useStorefront();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Memuat Pengaturan...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 pb-20"
    >
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Pengaturan Toko</h1>
          <p className="text-gray-500">Kelola identitas merek, kontak, dan alamat toko Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri - Informasi & Kontak */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoCard 
            name={formData.name} 
            fullName={formData.fullName} 
            onChange={handleChange} 
          />
          
          <ContactCard 
            phone={formData.phone}
            phoneWa={formData.phoneWa}
            instagram={formData.instagram}
            onChange={handleChange}
          />
        </div>

        {/* Kolom Kanan - Lokasi & Operasional */}
        <div className="space-y-6">
          <LocationCard 
            openingHours={formData.openingHours}
            address={formData.address}
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={handleChange}
            onLocationChange={handleLocationChange}
          />
        </div>
      </form>
    </motion.div>
  );
};
