import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/components/organisms/product/ProductList";
import { CATEGORIES } from "@/constants/mockData";
import { getProducts } from "@/services/admin/productService";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const normalizedId = id.toLowerCase();
  const category = CATEGORIES.find((c) => c.id === normalizedId);

  if (!category) {
    return {
      title: "Kategori Tidak Ditemukan",
    };
  }

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} | Rangkaian Bunga Premium`,
      description: category.description,
      type: "website",
      images: [
        {
          url: category.image,
          width: 800,
          height: 1000,
          alt: category.name,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const normalizedId = id.toLowerCase();
  const category = CATEGORIES.find((c) => c.id === normalizedId);
  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter((p) => p.category?.toLowerCase() === normalizedId);

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
