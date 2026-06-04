import type React from "react";
import type { Product } from "@/services/admin/productService";
import { ProductCard } from "@/components/features/product/molecules/ProductCard";
import { StaggerWrapper } from "@/components/ui/MotionWrappers";

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </StaggerWrapper>
  );
};

export default ProductList;
