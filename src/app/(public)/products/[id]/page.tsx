import ProductDetails from "@/components/organisms/product/ProductDetails";
import { getProductById } from "@/services/admin/productService";
import type { Metadata } from "next";

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

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return (
      <div className="pt-40 text-center font-sans text-lg text-[#2C302E]">
        Produk tidak ditemukan.
      </div>
    );
  }

  const product = await getProductById(numId);

  if (!product) {
    return (
      <div className="pt-40 text-center font-sans text-lg text-[#2C302E]">
        Produk tidak ditemukan.
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
