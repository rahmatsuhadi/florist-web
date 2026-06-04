"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { fadeInUp } from "@/constants/animations";
import { Product } from "@/services/admin/productService";
import { useAppContext } from "@/store/AppContext";
import { formatIdr } from "@/utils/format";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
  isBestSeller?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isBestSeller }) => {
  const router = useRouter();
  const { addToCart } = useAppContext();
  const hasVariants = product.variantGroups && product.variantGroups.length > 0;

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      router.push(`/products/${product.id}`);
    } else {
      addToCart({
        id: String(product.id),
        cartItemId: String(product.id),
        name: product.name,
        price: Number(product.basePrice),
        image: product.images[0] || "", // Ambil gambar pertama sebagai default
        variantsText: null,
      });
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="group flex flex-col bg-white h-full border border-gray-100"
    >
      <Link
        href={`/products/${product.id}`}
        className="block relative overflow-hidden aspect-square group/image"
      >
        {/* Gambar Utama */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority
          quality={80}
          className="object-cover transition-transform duration-700 group-hover/image:scale-105 z-0"
        />

        {/* Gambar Kedua (Efek Hover Slide dari Samping Kanan) */}
        {product.images.length > 1 && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate`}
            fill
            quality={80}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-in-out translate-x-full group-hover/image:translate-x-0 z-10"
          />
        )}

        {/* Lencana Best Seller agar tetap di atas gambar */}
        {isBestSeller && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="bg-[#E8D9D2] text-[#2C302E] text-xs font-sans px-3 py-1 uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 text-center flex flex-col flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-playfair text-xl text-[#2C302E] hover:text-[#829E8D] transition-colors mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-[#5A635E] mb-4">
          {hasVariants
            ? `Mulai dari ${formatIdr(Number(product.basePrice))}`
            : formatIdr(Number(product.basePrice))}
        </p>
        <div className="mt-auto">
          <Button
            variant="outline"
            className="w-full text-sm py-2"
            onClick={handleAction}
          >
            {hasVariants ? "Pilih Varian" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
