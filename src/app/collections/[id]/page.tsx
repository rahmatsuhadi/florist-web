import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductList } from "../../../components/organisms/product/ProductList";
import { CATEGORIES, PRODUCTS } from "../../../constants/mockData";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = CATEGORIES.find((c) => c.id === id);
  const categoryProducts = PRODUCTS.filter((p) => p.categoryId === id);

  if (!category) {
    return (
      <div className="pt-40 text-center font-sans text-lg text-[#2C302E]">
        Kategori tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-[#FAFAF7] min-h-screen">
      <div className="container mx-auto px-6">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-[#5A635E] hover:text-[#829E8D] mb-8 font-sans transition-colors"
        >
          <ChevronLeft size={20} /> Kembali ke Kategori
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#2C302E] mb-4">
            {category.name}
          </h1>
          <p className="font-sans text-[#5A635E] max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <ProductList products={categoryProducts} />
        ) : (
          <div className="text-center py-20 text-[#5A635E] font-sans">
            Belum ada produk untuk kategori ini.
          </div>
        )}
      </div>
    </div>
  );
}
