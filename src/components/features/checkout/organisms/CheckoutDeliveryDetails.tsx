"use client";

import React from "react";
import { Calendar, Clock, MapPin, Store } from "lucide-react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

const LocationPicker = dynamic(() => import("@/components/features/checkout/molecules/LocationPicker"), { ssr: false });

interface CheckoutData {
  address: string;
  latitude: string;
  longitude: string;
  scheduledDate: string;
  scheduledTime: string;
}

interface Props {
  deliveryMethod: "delivery" | "pickup";
  checkoutData: CheckoutData;
  setCheckoutData: (data: CheckoutData) => void;
  errors: Record<string, string>;
  setErrors: (errors: any) => void;
}

const timeSlotOptions = [
  { label: "Pagi (09:00 - 12:00)", value: "Pagi (09:00 - 12:00)" },
  { label: "Siang (12:00 - 15:00)", value: "Siang (12:00 - 15:00)" },
  { label: "Sore (15:00 - 18:00)", value: "Sore (15:00 - 18:00)" },
  { label: "Malam (18:00 - 20:00)", value: "Malam (18:00 - 20:00)" },
];

const pickupTimeOptions = Array.from({ length: 23 }).map((_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? "00" : "30";
  const timeString = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { label: timeString, value: timeString };
});

export const CheckoutDeliveryDetails: React.FC<Props> = ({
  deliveryMethod,
  checkoutData,
  setCheckoutData,
  errors,
  setErrors,
}) => {
  return (
    <div className="bg-white p-6 rounded-none shadow-sm border border-[#E8D9D2]">
      <h2 className="font-playfair text-xl text-[#2C302E] mb-4">Detail Waktu & Lokasi</h2>
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label={deliveryMethod === "delivery" ? "Tanggal Bunga Tiba" : "Tanggal Ambil"}
              variant="outline"
              icon={<Calendar size={18} />}
              value={checkoutData.scheduledDate}
              onChange={(e) => {
                setCheckoutData({ ...checkoutData, scheduledDate: e.target.value });
                if (errors.scheduledDate) setErrors({ ...errors, scheduledDate: "" });
              }}
              min={new Date().toISOString().split('T')[0]}
              error={errors.scheduledDate}
            />
            <p className="text-[11px] text-gray-500 mt-1">
              {deliveryMethod === "delivery"
                ? "*Pilih tanggal kapan bunga ini harus sampai ke penerima."
                : "*Pilih tanggal kapan Anda akan mengambil bunga di toko."}
            </p>
          </div>
          <div>
            {deliveryMethod === "delivery" ? (
              <>
                <Select
                  label="Slot Waktu Pengiriman"
                  variant="outline"
                  icon={<Clock size={18} />}
                  options={timeSlotOptions}
                  value={checkoutData.scheduledTime}
                  onChange={(e) => {
                    setCheckoutData({ ...checkoutData, scheduledTime: e.target.value });
                    if (errors.scheduledTime) setErrors({ ...errors, scheduledTime: "" });
                  }}
                  error={errors.scheduledTime}
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  *Pilih perkiraan rentang waktu kurir tiba di lokasi.
                </p>
              </>
            ) : (
              <>
                <Select
                  label="Jam Ambil"
                  variant="outline"
                  icon={<Clock size={18} />}
                  options={pickupTimeOptions}
                  value={checkoutData.scheduledTime}
                  onChange={(e) => {
                    setCheckoutData({ ...checkoutData, scheduledTime: e.target.value });
                    if (errors.scheduledTime) setErrors({ ...errors, scheduledTime: "" });
                  }}
                  error={errors.scheduledTime}
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  *Tentukan perkiraan jam Anda akan datang ke toko.
                </p>
              </>
            )}
          </div>
        </div>

        {deliveryMethod === "delivery" && (
          <div className="space-y-4 pt-4 border-t border-[#E8D9D2]">
            <Textarea
              label="Alamat Lengkap"
              icon={<MapPin size={16} />}
              variant="outline"
              rows={3}
              placeholder="Contoh: Jl. Mawar No. 123, Patokan sebelah warung makan."
              value={checkoutData.address}
              onChange={(e) => {
                setCheckoutData({ ...checkoutData, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: "" });
              }}
              error={errors.address}
            />

            <LocationPicker
              label="Titik Koordinat Peta"
              helperText="*Klik peta atau geser penanda (marker) untuk menentukan titik akurat pengiriman bunga Anda."
              position={checkoutData.latitude && checkoutData.longitude ? { lat: Number(checkoutData.latitude), lng: Number(checkoutData.longitude) } : null}
              setPosition={(pos) => {
                setCheckoutData({ ...checkoutData, latitude: pos ? pos.lat.toString() : "", longitude: pos ? pos.lng.toString() : "" });
                if (errors.location) setErrors({ ...errors, location: "" });
              }}
              error={errors.location}
            />
          </div>
        )}

        {deliveryMethod === "pickup" && (
          <div className="space-y-4 pt-4 border-t border-[#E8D9D2]">
            <div className="bg-[#FDFBF7] p-4 border border-[#E8D9D2] flex flex-col gap-3">
              <div>
                <h4 className="font-semibold text-sm text-[#2C302E] flex items-center gap-2">
                  <Store size={16} className="text-[#829E8D]" />
                  Lokasi Pengambilan (Petals & Bloom)
                </h4>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Jl. Mawar No. 123, Kelurahan Bunga, Kecamatan Mekar, Yogyakarta, 55281
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=-7.7956,110.3695"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E8D9D2] hover:bg-gray-50 text-xs font-semibold text-[#2C302E] transition-colors self-start"
              >
                <MapPin size={14} className="text-[#829E8D]" /> Buka di Google Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
