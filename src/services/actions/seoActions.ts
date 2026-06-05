"use server";

import { revalidatePath } from "next/cache";
import { SeoSchema, type ActionState } from "./seoSchemas";
import { db } from "@/db";
import { seoSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateSeoAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    pageName: formData.get("pageName") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    keywords: formData.get("keywords") as string,
  };

  const validated = SeoSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Terdapat kesalahan pada isian SEO Anda.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const data = validated.data;

  try {
    const existingSettings = await db.query.seoSettings.findFirst({
      where: eq(seoSettings.pageName, data.pageName),
    });

    if (existingSettings) {
      await db.update(seoSettings)
        .set({
          title: data.title,
          description: data.description,
          keywords: data.keywords,
          updatedAt: new Date(),
        })
        .where(eq(seoSettings.id, existingSettings.id));
    } else {
      await db.insert(seoSettings).values({
        pageName: data.pageName,
        title: data.title,
        description: data.description,
        keywords: data.keywords,
      });
    }

    revalidatePath("/admin/seo");
    
    return {
      success: true,
      message: "Pengaturan SEO berhasil disimpan.",
    };
  } catch (error) {
    console.error("Failed to save SEO settings:", error);
    return {
      success: false,
      message: "Gagal menyimpan pengaturan SEO.",
    };
  }
}
