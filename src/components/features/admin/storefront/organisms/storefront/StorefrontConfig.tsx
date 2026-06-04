"use client";

import React, { useActionState, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { StoreSettingsData } from "@/services/admin/storefrontService";
import { saveStorefrontAction } from "@/services/actions/storefrontActions";

import { BasicInfoCard } from "@/components/features/admin/storefront/molecules/storefront/BasicInfoCard";
import { ContactCard } from "@/components/features/admin/storefront/molecules/storefront/ContactCard";
import { LocationCard } from "@/components/features/admin/storefront/molecules/storefront/LocationCard";
import { FadeInUpWrapper } from "@/components/ui/MotionWrappers";

interface StorefrontConfigProps {
  initialData: StoreSettingsData;
}

export const StorefrontConfig = ({ initialData }: StorefrontConfigProps) => {
  const [state, formAction, isPending] = useActionState(saveStorefrontAction, {
    success: false,
    message: "",
    errors: {},
  });

  // Local state only for map coordinates (Leaflet requires it)
  const [latitude, setLatitude] = useState(Number(initialData.latitude));
  const [longitude, setLongitude] = useState(Number(initialData.longitude));

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  // Show toast feedback from server action
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 pb-20">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-gray-900 mb-1">Pengaturan Toko</h1>
          <p className="text-gray-500">Kelola identitas merek, kontak, dan alamat toko Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
          >
            <Save size={18} />
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </header>

      <FadeInUpWrapper>
        {/* Hidden inputs for lat/lng managed by Leaflet */}
        <input type="hidden" name="latitude" value={String(latitude)} />
        <input type="hidden" name="longitude" value={String(longitude)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri - Informasi & Kontak */}
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoCard
              initialData={initialData}
              errors={state.errors}
            />

            <ContactCard
              initialData={initialData}
              errors={state.errors}
            />
          </div>

          {/* Kolom Kanan - Lokasi & Operasional */}
          <div className="space-y-6">
            <LocationCard
              initialData={initialData}
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleLocationChange}
              errors={state.errors}
            />
          </div>
        </div>
      </FadeInUpWrapper>
    </form>
  );
};
