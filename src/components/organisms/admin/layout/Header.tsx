"use client";

import React from "react";
import { NotificationBell } from "@/components/molecules/admin/layout/NotificationBell";

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-brand/10">
      <div className="flex items-center justify-end px-8 py-3 max-w-7xl mx-auto w-full">
        <NotificationBell />
      </div>
    </header>
  );
};
