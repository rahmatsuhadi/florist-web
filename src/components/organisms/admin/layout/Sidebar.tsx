"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/services/admin/authService";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: "overview", path: "/admin", label: "Overview", icon: LayoutDashboard },
    { id: "products", path: "/admin/products", label: "Katalog Produk", icon: Package },
    { id: "storefront", path: "/admin/storefront", label: "Store Front", icon: ImageIcon },
    { id: "orders", path: "/admin/orders", label: "Transaksi WA", icon: Receipt },
    { id: "settings", path: "/admin/settings", label: "Pengaturan", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="w-64 h-screen bg-white/60 backdrop-blur-xl border-r border-[#4A5D4E]/10 fixed left-0 top-0 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
      <div className="p-8 pb-6">
        <h2 className="font-serif text-2xl font-bold text-[#4A5D4E] tracking-wide">
          Fleuriste.
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group ${
                isActive
                  ? "text-[#4A5D4E]"
                  : "text-gray-500 hover:text-[#4A5D4E] hover:bg-[#4A5D4E]/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#4A5D4E]/10 rounded-2xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} className="relative z-10" />
              <span className="font-medium font-sans relative z-10">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#4A5D4E]/10">
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
