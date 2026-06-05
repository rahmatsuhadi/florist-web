import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/components/features/product/organisms/ProductList";
import { CATEGORIES } from "@/constants/mockData";
import { getProducts } from "@/services/admin/productService";
import { EmptyState } from "@/components/ui/EmptyState";

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

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    id: category.id,
  }));
}
    

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const normalizedId = id.toLowerCase();
  const category = CATEGORIES.find((c) => c.id === normalizedId);
  const allProducts = await getProducts();
  const categoryProducts = allProducts.filter((p) => p.category?.toLowerCase() === normalizedId);

  if (!category) {
    return (
      <EmptyState
        title="Kategori Tidak Ditemukan"
        message="Maaf, kategori yang Anda cari tidak tersedia atau mungkin telah dihapus."
        fullPage={true}
        action={
          <Link href="/collections" className="text-[#829E8D] hover:underline font-sans">
            Lihat Semua Kategori
          </Link>
        }
      />
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
          <EmptyState
            title="Belum Ada Produk"
            message="Saat ini belum ada produk yang tersedia untuk kategori ini. Silakan periksa kembali nanti."
          />
        )}
      </div>
    </div>
  );
}
