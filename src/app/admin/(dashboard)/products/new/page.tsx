import { ProductForm } from "@/components/features/admin/product/organisms/product/ProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk Baru",
};

export default function AddProductPage() {
  return <ProductForm />;
}
