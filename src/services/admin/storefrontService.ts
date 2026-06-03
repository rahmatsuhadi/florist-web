"use server";

import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SHOP_INFO } from "@/constants/shopInfo";

export interface StoreSettingsData {
  id?: number;
  name: string;
  fullName: string;
  phone: string;
  phoneWa: string;
  instagram: string;
  address: string;
  openingHours: string;
  latitude: string;
  longitude: string;
}

export async function getStoreSettings(): Promise<StoreSettingsData> {
  try {
    const settings = await db.query.storeSettings.findFirst();
    if (!settings) {
      // Return default from constants if nothing in DB yet
      return {
        name: SHOP_INFO.name,
        fullName: SHOP_INFO.fullName,
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
}

export async function updateStoreSettings(data: StoreSettingsData): Promise<{ success: boolean; message: string }> {
  try {
    const existingSettings = await db.query.storeSettings.findFirst();

    if (existingSettings) {
      // Update existing
      await db.update(storeSettings)
        .set({
          name: data.name,
          fullName: data.fullName,
          phone: data.phone,
          phoneWa: data.phoneWa,
          instagram: data.instagram,
          address: data.address,
          openingHours: data.openingHours,
          latitude: data.latitude,
          longitude: data.longitude,
          updatedAt: new Date(),
        })
        .where(eq(storeSettings.id, existingSettings.id));
    } else {
      // Insert new (first time)
      await db.insert(storeSettings).values({
        name: data.name,
        fullName: data.fullName,
        phone: data.phone,
        phoneWa: data.phoneWa,
        instagram: data.instagram,
        address: data.address,
        openingHours: data.openingHours,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    }

    return { success: true, message: "Pengaturan berhasil disimpan." };
  } catch (error) {
    console.error("Failed to save store settings:", error);
    return { success: false, message: "Gagal menyimpan pengaturan toko." };
  }
}
