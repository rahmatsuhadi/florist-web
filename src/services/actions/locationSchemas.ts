import { z } from "zod";

export const LocationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama wilayah tidak boleh kosong").max(255, "Nama wilayah terlalu panjang"),
  shippingCost: z.string().optional().transform(val => {
    if (!val || val.trim() === "") return null;
    const parsed = parseInt(val.replace(/[^0-9]/g, ""), 10);
    return isNaN(parsed) ? null : parsed;
  }),
  parentId: z.string().optional().transform(val => {
    if (!val || val === "null" || val.trim() === "") return null;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  }),
});

export type LocationSchemaType = z.infer<typeof LocationSchema>;

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
