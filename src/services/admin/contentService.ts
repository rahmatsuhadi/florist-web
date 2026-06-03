"use server";

import { db } from "@/db";
import { heroBanners, galleryItems } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { HERO_BANNERS, GALLERY_ITEMS } from "@/constants/mockData";
import { revalidatePath } from "next/cache";

export interface HeroBannerData {
  id?: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  position: number;
  isActive: boolean;
}

export interface GalleryItemData {
  id?: number;
  imageUrl: string;
  gridClass: string;
  altText: string;
  position: number;
  isActive: boolean;
}

// === HERO BANNERS ===

export async function getHeroBanners(): Promise<HeroBannerData[]> {
  try {
    const banners = await db.query.heroBanners.findMany({
      orderBy: [asc(heroBanners.position)],
    });

    if (banners.length === 0) {
      // Seed the database with mock data
      const initialBanners = HERO_BANNERS.map((b, i) => ({
        imageUrl: b.image,
        title: b.title,
        subtitle: b.subtitle,
        position: i,
        isActive: true,
      }));
      
      await db.insert(heroBanners).values(initialBanners);
      
      return await db.query.heroBanners.findMany({
        orderBy: [asc(heroBanners.position)],
      });
    }

    return banners;
  } catch (error) {
    console.error("Failed to fetch hero banners:", error);
    return [];
  }
}

export async function addHeroBanner(data: HeroBannerData): Promise<{ success: boolean; message: string }> {
  try {
    await db.insert(heroBanners).values({
      imageUrl: data.imageUrl,
      title: data.title,
      subtitle: data.subtitle,
      position: data.position,
      isActive: data.isActive,
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Banner berhasil ditambahkan." };
  } catch (error) {
    console.error("Failed to add hero banner:", error);
    return { success: false, message: "Gagal menambahkan banner." };
  }
}

export async function updateHeroBanner(id: number, data: HeroBannerData): Promise<{ success: boolean; message: string }> {
  try {
    await db.update(heroBanners)
      .set({
        imageUrl: data.imageUrl,
        title: data.title,
        subtitle: data.subtitle,
        position: data.position,
        isActive: data.isActive,
      })
      .where(eq(heroBanners.id, id));
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Banner berhasil diperbarui." };
  } catch (error) {
    console.error("Failed to update hero banner:", error);
    return { success: false, message: "Gagal memperbarui banner." };
  }
}

export async function deleteHeroBanner(id: number): Promise<{ success: boolean; message: string }> {
  try {
    await db.delete(heroBanners).where(eq(heroBanners.id, id));
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Banner berhasil dihapus." };
  } catch (error) {
    console.error("Failed to delete hero banner:", error);
    return { success: false, message: "Gagal menghapus banner." };
  }
}

// === GALLERY ITEMS ===

export async function getGalleryItems(): Promise<GalleryItemData[]> {
  try {
    const gallery = await db.query.galleryItems.findMany({
      orderBy: [asc(galleryItems.position)],
    });

    if (gallery.length === 0) {
      const initialGallery = GALLERY_ITEMS.map((g, i) => ({
        imageUrl: g.image,
        gridClass: g.gridClass,
        altText: g.alt,
        position: i,
        isActive: true,
      }));

      await db.insert(galleryItems).values(initialGallery);

      return await db.query.galleryItems.findMany({
        orderBy: [asc(galleryItems.position)],
      });
    }

    return gallery;
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return [];
  }
}

export async function addGalleryItem(data: GalleryItemData): Promise<{ success: boolean; message: string }> {
  try {
    await db.insert(galleryItems).values({
      imageUrl: data.imageUrl,
      gridClass: data.gridClass,
      altText: data.altText,
      position: data.position,
      isActive: data.isActive,
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    return { success: true, message: "Foto galeri berhasil ditambahkan." };
  } catch (error) {
    console.error("Failed to add gallery item:", error);
    return { success: false, message: "Gagal menambahkan foto galeri." };
  }
}

export async function updateGalleryItem(id: number, data: GalleryItemData): Promise<{ success: boolean; message: string }> {
  try {
    await db.update(galleryItems)
      .set({
        imageUrl: data.imageUrl,
        gridClass: data.gridClass,
        altText: data.altText,
        position: data.position,
        isActive: data.isActive,
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

export async function deleteGalleryItem(id: number): Promise<{ success: boolean; message: string }> {
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
