import { StaggerWrapper } from "@/components/ui/MotionWrappers";
import { Product } from "@/services/admin/productService";
import ProductCard from "@/components/features/product/molecules/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const BestSellerSection = ({ products }: { products: Product[] }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Favorit Pelanggan"
          subtitle="Karya masterpiece yang paling dicintai oleh pelanggan kami."
        />
        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} isBestSeller />
          ))}
        </StaggerWrapper>
      </div>
    </section>
  );
};
