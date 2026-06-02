import { ProductDetails } from "../../../components/organisms/product/ProductDetails";
import { PRODUCTS } from "../../../constants/mockData";

interface ProductPageProps {
  params: Promise<{ id: string }>;
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
