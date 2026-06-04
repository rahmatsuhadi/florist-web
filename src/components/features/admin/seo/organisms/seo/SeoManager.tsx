"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SeoTabBar } from "../../molecules/SeoTabBar";
import { SeoFormCard } from "../../molecules/SeoFormCard";
import type { SeoSettingsData } from "@/services/admin/seoService";

interface SeoManagerProps {
  initialData: {
    home: SeoSettingsData;
    products: SeoSettingsData;
    categories: SeoSettingsData;
  };
}

export const SeoManager: React.FC<SeoManagerProps> = ({ initialData }) => {
  const getLabel = (tab: string) => {
    switch (tab) {
      case "home": return "Halaman Utama";
      case "products": return "Katalog Produk";
      case "categories": return "Kategori Bunga";
      default: return "";
    }
  };

  return (
    <SeoTabBar>
      {(activeTab: "home" | "products" | "categories") => (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SeoFormCard 
              initialData={initialData[activeTab]} 
              label={getLabel(activeTab)} 
            />
          </motion.div>
        </AnimatePresence>
      )}
    </SeoTabBar>
  );
};

