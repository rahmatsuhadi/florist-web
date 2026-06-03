import React from "react";
import { Sidebar } from "@/components/organisms/admin/layout/Sidebar";
import { Header } from "@/components/organisms/admin/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-inter text-[#2D3748]">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="pl-64 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
