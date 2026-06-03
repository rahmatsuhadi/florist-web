import React from "react";
import { Store } from "lucide-react";

interface BasicInfoCardProps {
  name: string;
  fullName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ name, fullName, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center">
          <Store size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Informasi Dasar</h3>
          <p className="text-xs text-gray-500">Nama merek dan identitas utama toko</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Nama Toko Singkat</label>
          <input 
            type="text" 
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Cth: L'Bunga Kita"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Nama Lengkap Toko</label>
          <input 
            type="text" 
            name="fullName"
            value={fullName}
            onChange={onChange}
            placeholder="Cth: L'Bunga Kita Florist"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
};
