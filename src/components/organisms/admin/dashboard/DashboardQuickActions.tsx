import React from "react";
import { Plus, Globe, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export const DashboardQuickActions: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <h3 className="font-serif text-lg font-semibold text-gray-900 border-b pb-3">Tindakan Cepat</h3>
      <div className="space-y-3">
        <button
          onClick={() => router.push('/admin/products/new')}
          className="w-full flex items-center justify-between p-4 border border-brand/10 rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <Plus size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Tambah Produk Baru</h4>
              <p className="text-xs text-gray-400">Desain rangkaian bunga segar baru</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/admin/content')}
          className="w-full flex items-center justify-between p-4 border border-brand/10 rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-[#B88B8C] group-hover:bg-[#B88B8C] group-hover:text-white transition-colors">
              <Globe size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Edit Banner Promo</h4>
              <p className="text-xs text-gray-400">Kelola visual utama beranda toko</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push('/admin/seo')}
          className="w-full flex items-center justify-between p-4 border border-brand/10 rounded-xl hover:border-brand/30 hover:bg-brand/5 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Optimasi SEO</h4>
              <p className="text-xs text-gray-400">Tingkatkan visibilitas di Google</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
