import { db } from "@/db";
import { seoSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getStoreSettings } from "./storefrontService";
import { unstable_cache } from "next/cache";

export interface SeoSettingsData {
  pageName: string;
  title: string;
  description: string;
  keywords: string;
}

export const getSeoSettings = unstable_cache(
  async (pageName: string, resolveVariables: boolean = false): Promise<SeoSettingsData> => {
    try {
      const settings = await db.query.seoSettings.findFirst({
        where: eq(seoSettings.pageName, pageName)
      });

      const storeSettings = await getStoreSettings();
      const storeName = storeSettings.name || "Florist";
      const fullName = storeSettings.name || storeName;

      let result: SeoSettingsData;

    if (!settings) {
      // Dynamic Default SEO using variables
      const DEFAULT_SEO: Record<string, Omit<SeoSettingsData, "pageName">> = {
        home: {
          title: `{{nama_lengkap}} | Rangkaian Bunga Premium Yogyakarta`,
          description: `Toko Bunga Premium Yogyakarta - Menghadirkan keindahan alam ke dalam buket bunga wisuda, pernikahan, anniversary, dan ucapan belasungkawa di {{nama_toko}}. Proses cepat, gratis pengiriman, dan pelayanan ramah.`,
          keywords: `toko bunga yogyakarta, florist jogja, buket bunga wisuda, bunga pernikahan jogja, hand bouquet premium, florist bantul, {{nama_toko}}`,
        },
        products: {
          title: `Katalog Produk | {{nama_toko}}`,
          description: `Jelajahi koleksi rangkaian bunga premium kami di {{nama_toko}}. Tersedia buket bunga, bunga papan, standing flower, dan hadiah spesial lainnya.`,
          keywords: `katalog bunga jogja, harga buket bunga, pesan bunga online jogja, jual bunga segar, koleksi {{nama_toko}}`,
        },
        categories: {
          title: `Kategori Bunga | {{nama_toko}}`,
          description: `Pilih kategori rangkaian bunga yang sesuai dengan momen spesial Anda di {{nama_toko}}. Mulai dari wisuda, pernikahan, hingga duka cita.`,
          keywords: `kategori buket bunga, bunga wisuda, bunga pernikahan, bunga duka cita, bunga anniversary, {{nama_toko}}`,
        }
      };

      const defaults = DEFAULT_SEO[pageName] || {
        title: "{{nama_lengkap}}",
        description: "",
        keywords: ""
      };
      
      result = {
        pageName,
        ...defaults
      };
    } else {
      result = {
        pageName: settings.pageName,
        title: settings.title || "",
        description: settings.description || "",
        keywords: settings.keywords || "",
      };
    }

    // Replace variables if requested (e.g. for public pages)
    // If not requested (e.g. for admin panel), keep the {{...}} so admin can see/edit them
    if (resolveVariables) {
      const replaceVars = (str: string) => 
        str.replace(/\{\{nama_toko\}\}/gi, storeName)
           .replace(/\{\{nama_lengkap\}\}/gi, fullName);

      result.title = replaceVars(result.title);
      result.description = replaceVars(result.description);
      result.keywords = replaceVars(result.keywords);
    }

      return result;
    } catch (error) {
      console.error(`Failed to fetch SEO settings for ${pageName}:`, error);
      throw new Error("Gagal mengambil data SEO.");
    }
  },
  ["seo-settings"],
  { tags: ["seo-settings"], revalidate: 3600 }
);
