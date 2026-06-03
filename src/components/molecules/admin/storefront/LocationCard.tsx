import React from "react";
import { MapPin, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const StorefrontMapPicker = dynamic(
  () => import("@/components/molecules/admin/map/StorefrontMapPicker"),
  { ssr: false, loading: () => <div className="w-full h-[350px] bg-brand/5 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 font-semibold text-sm">Memuat Peta...</div> }
);

interface LocationCardProps {
  openingHours: string;
  address: string;
  latitude: number;
  longitude: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLocationChange: (lat: number, lng: number) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  openingHours,
  address,
  latitude,
  longitude,
  onChange,
  onLocationChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Lokasi & Operasional</h3>
          <p className="text-xs text-gray-500">Alamat fisik dan peta</p>
        </div>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Jam Operasional</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Clock size={16} />
            </div>
            <input 
              type="text" 
              name="openingHours"
              value={openingHours}
              onChange={onChange}
              placeholder="Cth: 09:00 - 18:00"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Alamat Lengkap</label>
          <textarea 
            name="address"
            value={address}
            onChange={onChange}
            rows={3}
            placeholder="Masukkan alamat lengkap toko..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Latitude</label>
            <input 
              type="number" 
              step="any"
              name="latitude"
              value={latitude}
              placeholder="-7.xxxxx"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 transition-all text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Longitude</label>
            <input 
              type="number" 
              step="any"
              name="longitude"
              value={longitude}
              placeholder="110.xxxxx"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 transition-all text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
        </div>
        
        <StorefrontMapPicker 
          latitude={latitude}
          longitude={longitude}
          onChange={onLocationChange}
        />
      </div>
    </div>
  );
};
