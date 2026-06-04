import React from "react";
import { Sidebar } from "@/components/features/admin/core/organisms/layout/Sidebar";
import { Header } from "@/components/features/admin/core/organisms/layout/Header";
import { Metadata } from "next";
import { getStoreSettings } from "@/services/admin/storefrontService";

export async function generateMetadata(): Promise<Metadata> {
  const storeSettings = await getStoreSettings();
  const storeName = storeSettings.name || "Fleuriste";
  return {
    title: {
      template: `%s | Admin ${storeName}`,
      default: `Admin Dashboard | ${storeName}`,
    },
    description: `Workspace admin untuk ${storeName}`,
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeSettings = await getStoreSettings();

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-inter text-[#2D3748] ">
      {/* Sidebar Component */}
      <Sidebar shopInfo={storeSettings} />

      {/* Main Content Area */}
      <main className="pl-64 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
