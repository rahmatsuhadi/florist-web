"use server";

import { db } from "@/db";
import { heroBanners, galleryItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  BannerSchema,
  GallerySchema,
  type ActionState,
} from "./contentSchemas";

// ============================================================
// BANNER ACTIONS
// ============================================================

export async function addBannerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    imageUrl: formData.get("imageUrl"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    position: formData.get("position"),
    isActive: formData.get("isActive") ?? "true",
  };

  const parsed = BannerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db.insert(heroBanners).values({
      imageUrl: parsed.data.imageUrl,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      position: parsed.data.position,
      isActive: parsed.data.isActive,
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Banner berhasil ditambahkan." };
  } catch (error) {
    console.error("Failed to add banner:", error);
    return { success: false, message: "Gagal menambahkan banner." };
  }
}

export async function updateBannerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return { success: false, message: "ID banner tidak valid." };

  const raw = {
    imageUrl: formData.get("imageUrl"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    position: formData.get("position"),
    isActive: formData.get("isActive") ?? "true",
  };

  const parsed = BannerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db
      .update(heroBanners)
      .set({
        imageUrl: parsed.data.imageUrl,
        title: parsed.data.title,
        subtitle: parsed.data.subtitle,
        position: parsed.data.position,
        isActive: parsed.data.isActive,
      })
      .where(eq(heroBanners.id, id));
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Banner berhasil diperbarui." };
  } catch (error) {
    console.error("Failed to update banner:", error);
    return { success: false, message: "Gagal memperbarui banner." };
  }
}

export async function deleteBannerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return { success: false, message: "ID banner tidak valid." };

  try {
    await db.delete(heroBanners).where(eq(heroBanners.id, id));
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Banner berhasil dihapus." };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { success: false, message: "Gagal menghapus banner." };
  }
}

export async function reorderBannersAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const itemsJson = formData.get("items") as string;
  if (!itemsJson) return { success: false, message: "Data reorder tidak valid." };

  try {
    const items: { id: number; position: number }[] = JSON.parse(itemsJson);
    await Promise.all(
      items.map((item) =>
        db
          .update(heroBanners)
          .set({ position: item.position })
          .where(eq(heroBanners.id, item.id))
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Urutan banner berhasil disimpan." };
  } catch (error) {
    console.error("Failed to reorder banners:", error);
    return { success: false, message: "Gagal menyimpan urutan banner." };
  }
}

// ============================================================
// GALLERY ACTIONS
// ============================================================

export async function addGalleryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    imageUrl: formData.get("imageUrl"),
    gridClass: formData.get("gridClass"),
    altText: formData.get("altText"),
    position: formData.get("position"),
    isActive: formData.get("isActive") ?? "true",
  };

  const parsed = GallerySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db.insert(galleryItems).values({
      imageUrl: parsed.data.imageUrl,
      gridClass: parsed.data.gridClass,
      altText: parsed.data.altText,
      position: parsed.data.position,
      isActive: parsed.data.isActive,
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Foto galeri berhasil ditambahkan." };
  } catch (error) {
    console.error("Failed to add gallery item:", error);
    return { success: false, message: "Gagal menambahkan foto galeri." };
  }
}

export async function updateGalleryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return { success: false, message: "ID galeri tidak valid." };

  const raw = {
    imageUrl: formData.get("imageUrl"),
    gridClass: formData.get("gridClass"),
    altText: formData.get("altText"),
    position: formData.get("position"),
    isActive: formData.get("isActive") ?? "true",
  };

  const parsed = GallerySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validasi gagal.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db
      .update(galleryItems)
      .set({
        imageUrl: parsed.data.imageUrl,
        gridClass: parsed.data.gridClass,
        altText: parsed.data.altText,
        position: parsed.data.position,
        isActive: parsed.data.isActive,
      })
      .where(eq(galleryItems.id, id));
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Foto galeri berhasil diperbarui." };
  } catch (error) {
    console.error("Failed to update gallery item:", error);
    return { success: false, message: "Gagal memperbarui foto galeri." };
  }
}

export async function deleteGalleryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = Number(formData.get("id"));
  if (!id) return { success: false, message: "ID galeri tidak valid." };

  try {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Foto galeri berhasil dihapus." };
  } catch (error) {
    console.error("Failed to delete gallery item:", error);
    return { success: false, message: "Gagal menghapus foto galeri." };
  }
}

export async function reorderGalleryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const itemsJson = formData.get("items") as string;
  if (!itemsJson) return { success: false, message: "Data reorder tidak valid." };

  try {
    const items: { id: number; position: number }[] = JSON.parse(itemsJson);
    await Promise.all(
      items.map((item) =>
        db
          .update(galleryItems)
          .set({ position: item.position })
          .where(eq(galleryItems.id, item.id))
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Urutan galeri berhasil disimpan." };
  } catch (error) {
    console.error("Failed to reorder gallery:", error);
    return { success: false, message: "Gagal menyimpan urutan galeri." };
  }
}
