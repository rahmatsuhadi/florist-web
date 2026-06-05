"use server";

import { revalidatePath } from "next/cache";
import { LocationSchema, type ActionState } from "./locationSchemas";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveLocationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    shippingCost: formData.get("shippingCost") as string,
    parentId: formData.get("parentId") as string,
  };

  const validated = LocationSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Terdapat kesalahan pada input Anda.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const data = validated.data;

  try {
    if (data.id) {
      // Update
      await db.update(locations)
        .set({
          name: data.name,
          shippingCost: data.shippingCost,
          parentId: data.parentId,
          updatedAt: new Date(),
        })
        .where(eq(locations.id, parseInt(data.id, 10)));
    } else {
      // Insert
      await db.insert(locations).values({
        name: data.name,
        shippingCost: data.shippingCost,
        parentId: data.parentId,
      });
    }

    revalidatePath("/admin/locations");
    
    return {
      success: true,
      message: data.id ? "Wilayah berhasil diperbarui." : "Wilayah baru berhasil ditambahkan.",
    };
  } catch (error) {
    console.error("Failed to save location:", error);
    return {
      success: false,
      message: "Gagal menyimpan data wilayah.",
    };
  }
}

export async function deleteLocationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const idStr = formData.get("id") as string;
  if (!idStr) {
    return { success: false, message: "ID wilayah tidak valid." };
  }

  const id = parseInt(idStr, 10);

  try {
    await db.delete(locations).where(eq(locations.id, id));
    revalidatePath("/admin/locations");
    return {
      success: true,
      message: "Wilayah berhasil dihapus.",
    };
  } catch (error) {
    console.error("Failed to delete location:", error);
    return {
      success: false,
      message: "Gagal menghapus data wilayah.",
    };
  }
}
