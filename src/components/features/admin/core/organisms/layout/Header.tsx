"use client";

import React from "react";
import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/features/admin/core/molecules/layout/NotificationBell";
import { useSidebarStore } from "@/store/SidebarStore";

export const Header = () => {
  const { openSidebar } = useSidebarStore();

  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-brand/10">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 max-w-7xl mx-auto w-full">
        <button
          onClick={openSidebar}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="flex-1" />
        <NotificationBell />
      </div>
    </header>
  );
};
