"use client";

import { ProductForm } from "@/components/organisms/admin/product/ProductForm";
import { createProduct } from "@/services/admin/productService";

export default function AddProductPage() {
  return <ProductForm onSave={createProduct} />;
}
