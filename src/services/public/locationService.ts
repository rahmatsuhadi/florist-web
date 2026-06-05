import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export interface PublicLocationNode {
  id: number;
  name: string;
  shippingCost: number | null;
  parentId: number | null;
  children: PublicLocationNode[];
}

export async function getPublicLocationTree(): Promise<PublicLocationNode[]> {
  try {
    const allLocations = await db.query.locations.findMany({
      where: eq(locations.isActive, true),
      orderBy: [asc(locations.id)],
    });

    const map = new Map<number, PublicLocationNode>();
    const tree: PublicLocationNode[] = [];

    // Initialize map
    allLocations.forEach((loc) => {
      map.set(loc.id, {
        id: loc.id,
        name: loc.name,
        shippingCost: loc.shippingCost,
        parentId: loc.parentId,
        children: [],
      });
    });

    // Build tree
    allLocations.forEach((loc) => {
      const node = map.get(loc.id)!;
      if (loc.parentId !== null) {
        const parent = map.get(loc.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          tree.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  } catch (error) {
    console.error("Failed to fetch public location tree:", error);
    return [];
  }
}
