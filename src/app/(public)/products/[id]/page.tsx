import ProductDetails from "@/components/features/product/organisms/ProductDetails";
import { getProductById } from "@/services/admin/productService";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, Category } from "@/constants/mockData";
import { EmptyState } from "@/components/ui/EmptyState";
import { db } from "@/db";
import { products } from "@/db/schema";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  const product = await getProductById(numId);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description || "",
    openGraph: {
      title: `${product.name} | Rangkaian Bunga Premium`,
      description: product.description || "",
      type: "article",
      images: [
        {
          url: product.images[0] || "",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}
export const revalidate = 3600;

export async function generateStaticParams() {
  const allProductIds = await db.select({ id: products.id }).from(products);
  return allProductIds.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return (
      <EmptyState
        title="Produk Tidak Ditemukan"
        message="ID Produk tidak valid."
        fullPage={true}
        action={
          <Link href="/collections" className="text-[#829E8D] hover:underline font-sans">
            Lihat Semua Koleksi
          </Link>
        }
      />
    );
  }

  const product = await getProductById(numId);

  if (!product) {
    return (
      <EmptyState
        title="Produk Tidak Ditemukan"
        message="Maaf, produk yang Anda cari tidak tersedia atau mungkin telah dihapus."
        fullPage={true}
        action={
          <Link href="/collections" className="text-[#829E8D] hover:underline font-sans">
            Lihat Semua Koleksi
          </Link>
        }
      />
    );
  }

  const normalizedCategory = product.category?.toLowerCase() || "";
  const category = CATEGORIES.find((c: Category) => c.id === normalizedCategory);

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <Link
          href={`/collections/${normalizedCategory}`}
          className="inline-flex items-center gap-2 text-[#5A635E] hover:text-[#829E8D] mb-8 font-sans transition-colors"
        >
          <ChevronLeft size={20} /> Kembali ke {category?.name || "Koleksi"}
        </Link>
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
