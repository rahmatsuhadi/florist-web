"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export const StoreLocationLink = () => {
  const { shopInfo } = useAppContext();

  if (!shopInfo?.latitude || !shopInfo?.longitude) return null;

  return (
    <a
      href={`https://www.google.com/maps?q=${shopInfo.latitude},${shopInfo.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 text-[#829E8D] hover:text-[#5A635E] transition-colors font-sans text-sm font-semibold border border-[#829E8D]/30 bg-[#829E8D]/5 px-4 py-2 rounded-none"
    >
      <MapPin size={16} /> Buka Google Maps Toko
    </a>
  );
};
