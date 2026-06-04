"use server";

import { z } from "zod";
import { createProduct, updateProduct } from "@/services/admin/productService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const optionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nama opsi tidak boleh kosong"),
  priceType: z.enum(["add", "replace"]),
  price: z.string(),
  image: z.string().nullable(),
});

const variantGroupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nama grup varian tidak boleh kosong"),
  options: z.array(optionSchema),
});

const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  basePrice: z.string().min(1, "Harga dasar tidak boleh kosong"),
  category: z.string().min(1, "Kategori harus dipilih"),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  variantGroups: z.array(variantGroupSchema).default([]),
});

export type SaveProductState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  submittedData?: {
    name: string;
    basePrice: string;
    category: string;
    description: string;
  };
};

export async function saveProductAction(prevState: SaveProductState, formData: FormData): Promise<SaveProductState> {
  let isSuccess = false;
  
  try {
    const rawImages = formData.get("images") as string;
    const rawVariantGroups = formData.get("variantGroups") as string;

    const data = {
      name: formData.get("name") as string,
      basePrice: formData.get("basePrice") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      images: rawImages ? JSON.parse(rawImages) : [],
      variantGroups: rawVariantGroups ? JSON.parse(rawVariantGroups) : [],
    };

    const validatedData = productSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validasi gagal. Periksa kembali form Anda.",
        submittedData: {
          name: data.name,
          basePrice: data.basePrice,
          category: data.category,
          description: data.description,
        },
      };
    }

    const id = formData.get("id") as string;

    if (id) {
      await updateProduct(Number(id), validatedData.data);
    } else {
      await createProduct(validatedData.data);
    }
    
    isSuccess = true;
  } catch (error) {
    console.error("Save product action failed:", error);
    return {
      success: false,
      message: "Terjadi kesalahan pada server saat menyimpan produk.",
      submittedData: {
        name: formData.get("name") as string,
        basePrice: formData.get("basePrice") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
      },
    };
  }

  // Next.js redirect must be called outside try-catch
  if (isSuccess) {
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }
  
  return { success: false };
}
