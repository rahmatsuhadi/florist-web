import React from "react";
import { Sparkles } from "lucide-react";

interface DashboardWelcomeBannerProps {
  storeName?: string;
}

export const DashboardWelcomeBanner: React.FC<DashboardWelcomeBannerProps> = ({ storeName = "Florist" }) => {
  return (
    <div className="bg-brand p-8 rounded-3xl text-white relative overflow-hidden shadow-lg">
      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center">
        <Sparkles size={200} />
      </div>
      <div className="max-w-xl space-y-2 relative z-10">
        <span className="text-xs font-bold tracking-widest uppercase text-rose-200">Kinerja Hari Ini</span>
        <h1 className="font-serif text-3xl font-bold leading-tight">Selamat Datang Kembali, Admin {storeName}!</h1>
        <p className="text-gray-200 text-sm">Semua sistem florist Anda aktif. Kelola pesanan baru, perbarui katalog bunga segar Anda, atau sesuaikan pengaturan website langsung melalui panel kendali.</p>
      </div>
    </div>
  );
};
