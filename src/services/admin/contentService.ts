import { db } from "@/db";
import { heroBanners, galleryItems } from "@/db/schema";
import { asc } from "drizzle-orm";
import { HERO_BANNERS, GALLERY_ITEMS } from "@/constants/mockData";

// Types shared across server and client boundaries
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

// === READ-ONLY QUERIES ===
// Called from Async Server Components (page.tsx).
// Mutations are handled by Server Actions in services/actions/contentActions.ts.

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
