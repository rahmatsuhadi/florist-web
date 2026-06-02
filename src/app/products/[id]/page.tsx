import type { Metadata } from "next";
import { ProductDetails } from "../../../components/organisms/product/ProductDetails";
import { PRODUCTS } from "../../../constants/mockData";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Rangkaian Bunga Premium`,
      description: product.description,
      type: "article",
      images: [
        {
          url: product.images[0],
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
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="pt-40 text-center font-sans text-lg text-[#2C302E]">
        Produk tidak ditemukan.
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
