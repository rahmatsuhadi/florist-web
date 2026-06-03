"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ProductForm } from "@/components/organisms/admin/product/ProductForm";
import {
  getProductById,
  updateProduct,
  Product,
} from "@/services/admin/productService";

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isNaN(id)) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-brand/10">
        <h3 className="font-serif text-lg font-medium text-gray-900 mb-1">
          Produk tidak ditemukan
        </h3>
        <p className="text-gray-500 text-sm">
          Produk dengan ID {id} tidak ada atau telah dihapus.
        </p>
      </div>
    );
  }

  const handleSave = async (data: Omit<Product, "id">) => {
    await updateProduct(id, data);
  };

  return <ProductForm initialData={product} onSave={handleSave} />;
}
