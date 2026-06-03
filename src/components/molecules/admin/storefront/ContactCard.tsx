import React from "react";
import { Phone, MessageCircle, AtSign } from "lucide-react";

interface ContactCardProps {
  phone: string;
  phoneWa: string;
  instagram: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ phone, phoneWa, instagram, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
          <Phone size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Kontak & Sosial Media</h3>
          <p className="text-xs text-gray-500">Nomor telepon, WhatsApp, dan sosial media</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Nomor Telepon (Tampilan)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Phone size={16} />
            </div>
            <input 
              type="text" 
              name="phone"
              value={phone}
              onChange={onChange}
              placeholder="+62 8xx-xxxx-xxxx"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Nomor WhatsApp (Sistem)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <MessageCircle size={16} />
            </div>
            <input 
              type="text" 
              name="phoneWa"
              value={phoneWa}
              onChange={onChange}
              placeholder="628xxxxxxxxxx (Tanpa + atau 0)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
            />
          </div>
          <p className="text-[10px] text-gray-400">Gunakan format awalan 62 untuk integrasi URL WhatsApp.</p>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700">Username Instagram</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <AtSign size={16} />
            </div>
            <input 
              type="text" 
              name="instagram"
              value={instagram}
              onChange={onChange}
              placeholder="@username"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
