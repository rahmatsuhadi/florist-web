import { db } from "@/db";
import { locations } from "@/db/schema";
import { desc, isNull, eq } from "drizzle-orm";

export interface LocationItemData {
  id: number;
  name: string;
  shippingCost: number | null;
  parentId: number | null;
  isActive: boolean;
  children?: LocationItemData[];
}

export async function getLocationsTree(): Promise<LocationItemData[]> {
  try {
    // Ambil semua lokasi, diurutkan descending agar yang baru di atas
    const allLocations = await db.query.locations.findMany({
      orderBy: [desc(locations.id)],
    });

    // Algoritma untuk membentuk Tree (Nested)
    const map = new Map<number, LocationItemData>();
    const tree: LocationItemData[] = [];

    // Inisialisasi map
    allLocations.forEach((loc) => {
      map.set(loc.id, {
        ...loc,
        children: [],
      });
    });

    // Bangun tree
    allLocations.forEach((loc) => {
      const node = map.get(loc.id)!;
      if (loc.parentId !== null) {
        // Punya parent, masukkan sebagai child
        const parent = map.get(loc.parentId);
        if (parent) {
          parent.children!.push(node);
        } else {
          // Jika parent tidak ditemukan (orphan), taruh di root
          tree.push(node);
        }
      } else {
        // Tidak punya parent, ini adalah root
        tree.push(node);
      }
    });

    return tree;
  } catch (error) {
    console.error("Failed to fetch location tree:", error);
    return [];
  }
}

export async function getFlatLocations(): Promise<LocationItemData[]> {
    try {
      const allLocations = await db.query.locations.findMany({
        orderBy: [desc(locations.id)],
      });
      return allLocations;
    } catch (error) {
        console.error("Failed to fetch locations:", error);
        return [];
    }
}
