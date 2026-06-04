"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc, ilike, and, SQL } from "drizzle-orm";

export interface ProductVariantOption {
  id: string;
  name: string;
  priceType: "add" | "replace";
  price: string;
  image: string | null;
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  options: ProductVariantOption[];
}

export interface Product {
  id: number;
  name: string;
  basePrice: string;
  category: string;
  description: string;
  images: string[];
  variantGroups: ProductVariantGroup[];
}

export const getProducts = async (params?: { query?: string; category?: string }): Promise<Product[]> => {
  if (!db) {
    return []; // Return empty during build, real data at runtime
  }

  const conditions: SQL[] = [];
  
  if (params?.category && params.category !== "Semua") {
    conditions.push(eq(products.category, params.category));
  }
  
  if (params?.query) {
    conditions.push(ilike(products.name, `%${params.query}%`));
  }

  const allProducts = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt));

  return allProducts.map(p => ({
    ...p,
    description: p.description || "",
    images: p.images as string[],
    variantGroups: p.variantGroups as ProductVariantGroup[],
  }));
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product) return null;

  return {
    ...product,
    description: product.description || "",
    images: product.images as string[],
    variantGroups: product.variantGroups as ProductVariantGroup[],
  };
};

export const createProduct = async (
  data: Omit<Product, "id">
): Promise<Product> => {
  const [newProduct] = await db
    .insert(products)
    .values({
      name: data.name,
      basePrice: data.basePrice,
      category: data.category,
      description: data.description,
      images: data.images,
      variantGroups: data.variantGroups,
    })
    .returning();

  return {
    ...newProduct,
    description: newProduct.description || "",
    images: newProduct.images as string[],
    variantGroups: newProduct.variantGroups as ProductVariantGroup[],
  };
};

export const updateProduct = async (
  id: number,
  data: Omit<Product, "id">
): Promise<Product> => {
  const [updatedProduct] = await db
    .update(products)
    .set({
      name: data.name,
      basePrice: data.basePrice,
      category: data.category,
      description: data.description,
      images: data.images,
      variantGroups: data.variantGroups,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  if (!updatedProduct) throw new Error("Product not found");

  return {
    ...updatedProduct,
    description: updatedProduct.description || "",
    images: updatedProduct.images as string[],
    variantGroups: updatedProduct.variantGroups as ProductVariantGroup[],
  };
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  return !!deletedProduct;
};
