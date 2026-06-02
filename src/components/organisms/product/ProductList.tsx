"use client";

import { motion } from "framer-motion";
import type React from "react";
import { staggerContainer } from "../../../constants/animations";
import type { Product } from "../../../constants/mockData";
import { ProductCard } from "../../molecules/product/ProductCard";

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
};

export default ProductList;
