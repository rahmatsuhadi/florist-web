import { Metadata } from "next";
import { getStoreSettings } from "@/services/admin/storefrontService";
import { StorefrontConfig } from "@/components/features/admin/storefront/organisms/storefront/StorefrontConfig";

export const metadata: Metadata = {
  title: "Pengaturan Toko | Admin Fleuriste Bouquet",
  description: "Manajemen identitas, kontak, dan alamat toko.",
};


export default async function AdminStorefrontPage() {
  const initialData = await getStoreSettings();

  return <StorefrontConfig initialData={initialData} />;
}
