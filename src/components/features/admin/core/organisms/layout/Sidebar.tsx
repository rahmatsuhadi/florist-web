"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Receipt,
  Settings,
  LogOut,
  CreditCard,
  Store,
  Globe,
  ChevronDown,
  MonitorSmartphone,
} from "lucide-react";
import { logout } from "@/services/admin/authService";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedWebsite, setExpandedWebsite] = useState(true);

  const mainItems = [
    { id: "overview", path: "/admin", label: "Overview", icon: LayoutDashboard },
    { id: "orders", path: "/admin/orders", label: "Transaksi", icon: Receipt },
    { id: "products", path: "/admin/products", label: "Katalog Produk", icon: Package },
    { id: "payments", path: "/admin/payments", label: "Riwayat Bayar", icon: CreditCard },
  ];

  const websiteItems = [
    { id: "storefront", path: "/admin/storefront", label: "Store Front", icon: Store },
    { id: "seo", path: "/admin/seo", label: "SEO Manager", icon: Globe },
    { id: "content", path: "/admin/content", label: "Manajemen Konten", icon: ImageIcon },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const renderItem = (item: any, isSubItem = false) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;
    return (
      <button
        key={item.id}
        onClick={() => router.push(item.path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group ${
          isActive ? "text-brand" : "text-gray-500 hover:text-brand hover:bg-brand/5"
        } ${isSubItem ? "pl-11 py-2.5 text-sm" : ""}`}
      >
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-brand/10 rounded-2xl"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <Icon size={isSubItem ? 18 : 20} className="relative z-10" />
        <span className={`font-sans relative z-10 ${isSubItem ? "font-medium" : "font-medium"}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="w-64 h-screen bg-white/60 backdrop-blur-xl border-r border-brand/10 fixed left-0 top-0 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
      <div className="p-8 pb-6">
        <h2 className="font-serif text-2xl font-bold text-brand tracking-wide">
          Fleuriste.
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto hide-scrollbar">
        {mainItems.map((item) => renderItem(item))}

        <div className="pt-2">
          <button
            onClick={() => setExpandedWebsite(!expandedWebsite)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-gray-500 hover:text-brand hover:bg-brand/5"
          >
            <div className="flex items-center gap-3">
              <MonitorSmartphone size={20} />
              <span className="font-medium font-sans">Website Settings</span>
            </div>
            <motion.div
              animate={{ rotate: expandedWebsite ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>
          
          <AnimatePresence initial={false}>
            {expandedWebsite && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden mt-1 space-y-1"
              >
                {websiteItems.map((item) => renderItem(item, true))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="p-4 border-t border-brand/10">
        <button className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left">
          <div className="w-10 h-10 rounded-full bg-[#B76E79]/20 flex items-center justify-center text-[#B76E79] font-serif font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Admin Utama</p>
            <p className="text-xs text-gray-500">Superadmin</p>
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-3 mt-2 text-sm text-gray-500 hover:text-red-500 transition-colors rounded-xl"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </div>
  );
};
