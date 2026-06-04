import { z } from "zod";

export const BannerSchema = z.object({
  id: z.coerce.number().optional(),
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
  title: z.string().min(1, "Judul wajib diisi"),
  subtitle: z.string().min(1, "Subjudul wajib diisi"),
  position: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const GallerySchema = z.object({
  id: z.coerce.number().optional(),
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
  gridClass: z.string().min(1, "Grid class wajib diisi"),
  altText: z.string().min(1, "Alt text wajib diisi"),
  position: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const ReorderSchema = z.object({
  items: z.string().min(1, "Data reorder wajib diisi"), // JSON string of {id, position}[]
});

export type BannerFormData = z.infer<typeof BannerSchema>;
export type GalleryFormData = z.infer<typeof GallerySchema>;

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
