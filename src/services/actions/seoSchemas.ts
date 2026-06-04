import { z } from "zod";

export const SeoSchema = z.object({
  pageName: z.enum(["home", "products", "categories"]),
  title: z
    .string()
    .max(100, "Judul SEO maksimal 100 karakter")
    .optional(),
  description: z
    .string()
    .max(300, "Deskripsi SEO maksimal 300 karakter")
    .optional(),
  keywords: z
    .string()
    .max(300, "Keywords maksimal 300 karakter")
    .optional(),
});

export type SeoSchemaType = z.infer<typeof SeoSchema>;

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
