import React from "react";
import { Package } from "lucide-react";
import { getProducts } from "@/services/admin/productService";
import { ProductCard } from "@/components/features/admin/product/molecules/product/ProductCard";
import { FadeInUpWrapper } from "@/components/ui/MotionWrappers";

interface ProductGridProps {
  searchParams: { q?: string; category?: string };
}

export const ProductGrid = async ({ searchParams }: ProductGridProps) => {
  const products = await getProducts({
    query: searchParams.q,
    category: searchParams.category,
  });

  if (products.length === 0) {
    return (
      <FadeInUpWrapper className="text-center py-16 bg-white rounded-2xl border border-brand/10 shadow-sm flex flex-col items-center justify-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <h3 className="font-serif text-lg font-medium text-gray-900 mb-1">
          Produk tidak ditemukan
        </h3>
        <p className="text-gray-500 text-sm font-sans">
          Coba ubah kata kunci pencarian atau filter kategori Anda.
        </p>
      </FadeInUpWrapper>
    );
  }

  return (
    <FadeInUpWrapper className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </FadeInUpWrapper>
  );
};
