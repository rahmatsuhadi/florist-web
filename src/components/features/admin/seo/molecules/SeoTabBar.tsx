"use client";

import { LayoutTemplate, Box, Search } from "lucide-react";
import { useState } from "react";

interface SeoTabBarProps {
  children: (activeTab: "home" | "products" | "categories") => React.ReactNode;
}

export const SeoTabBar: React.FC<SeoTabBarProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<"home" | "products" | "categories">("home");

  const tabs = [
    { id: "home", label: "Halaman Utama", icon: LayoutTemplate },
    { id: "products", label: "Katalog Produk", icon: Box },
    { id: "categories", label: "Kategori Bunga", icon: Search },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-white border border-brand/20 shadow-sm rounded-2xl w-max max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>{children(activeTab)}</div>
    </div>
  );
};
