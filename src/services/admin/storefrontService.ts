"use server";

import { db } from "@/db";
import { SHOP_INFO } from "@/constants/shopInfo";
import { unstable_cache } from "next/cache";

export interface StoreSettingsData {
  id?: number;
  name: string;
  subName: string;
  phone: string;
  phoneWa: string;
  instagram: string;
  address: string;
  openingHours: string;
  latitude: string;
  longitude: string;
}

export const getStoreSettings = unstable_cache(
  async (): Promise<StoreSettingsData> => {
    try {
      const settings = await db.query.storeSettings.findFirst();
      if (!settings) {
        // Return default from constants if nothing in DB yet
        return {
          name: SHOP_INFO.name,
          subName: SHOP_INFO.subName,
          phone: SHOP_INFO.phone,
          phoneWa: SHOP_INFO.phoneWa,
          instagram: SHOP_INFO.instagram,
          address: SHOP_INFO.address,
          openingHours: SHOP_INFO.openingHours,
          latitude: String(SHOP_INFO.latitude),
          longitude: String(SHOP_INFO.longitude),
        };
      }
      return settings;
    } catch (error) {
      console.error("Failed to fetch store settings:", error);
      throw new Error("Gagal mengambil data pengaturan toko.");
    }
  },
  ["store-settings"],
  { tags: ["store-settings"], revalidate: 3600 }
);
