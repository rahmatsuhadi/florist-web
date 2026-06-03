import { Metadata } from "next";
import { StorefrontConfig } from "@/components/organisms/admin/storefront/StorefrontConfig";

export const metadata: Metadata = {
  title: "Pengaturan Toko | Admin Fleuriste Bouquet",
  description: "Manajemen identitas, kontak, dan alamat toko.",
};

export default function AdminStorefrontPage() {
  return <StorefrontConfig />;
}
