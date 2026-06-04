"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

const storefrontSchema = z.object({
  name: z.string().min(2, "Nama toko minimal 2 karakter"),
  subName: z.string().min(3, "Nama lengkap toko minimal 3 karakter"),
  phone: z.string().min(5, "Nomor telepon tidak valid"),
  phoneWa: z.string().min(10, "Nomor WhatsApp minimal 10 digit").regex(/^62/, "Nomor WA harus diawali 62"),
  instagram: z.string().min(1, "Username Instagram tidak boleh kosong"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  openingHours: z.string().min(3, "Jam operasional tidak boleh kosong"),
  latitude: z.string().min(1, "Latitude tidak boleh kosong"),
  longitude: z.string().min(1, "Longitude tidak boleh kosong"),
});

export type SaveStorefrontState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function saveStorefrontAction(
  prevState: SaveStorefrontState,
  formData: FormData
): Promise<SaveStorefrontState> {
  const data = {
    name: formData.get("name") as string,
    subName: formData.get("subName") as string,
    phone: formData.get("phone") as string,
    phoneWa: formData.get("phoneWa") as string,
    instagram: formData.get("instagram") as string,
    address: formData.get("address") as string,
    openingHours: formData.get("openingHours") as string,
    latitude: formData.get("latitude") as string,
    longitude: formData.get("longitude") as string,
  };

  const validatedData = storefrontSchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
      message: "Validasi gagal. Periksa kembali form Anda.",
    };
  }

  try {
    const existingSettings = await db.query.storeSettings.findFirst();

    if (existingSettings) {
      await db
        .update(storeSettings)
        .set({
          ...validatedData.data,
          updatedAt: new Date(),
        })
        .where(eq(storeSettings.id, existingSettings.id));
    } else {
      await db.insert(storeSettings).values(validatedData.data);
    }

    revalidateTag("store-settings", 'max');
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Pengaturan toko berhasil disimpan.",
    };
  } catch (error) {
    console.error("Save storefront action failed:", error);
    return {
      success: false,
      message: "Terjadi kesalahan pada server saat menyimpan pengaturan.",
    };
  }
}
