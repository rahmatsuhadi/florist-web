import { Metadata } from "next";
import { ProductList } from "@/components/organisms/admin/product/ProductList";

export const metadata: Metadata = {
  title: "Katalog Produk | Admin Fleuriste Bouquet",
  description: "Manajemen katalog produk toko bunga.",
};

export default function AdminProductsPage() {
  return <ProductList />;
}
