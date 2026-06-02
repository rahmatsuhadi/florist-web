"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import {
  CATEGORIES,
  type Product,
  type VariantOption,
} from "../../../constants/mockData";
import { useAppContext } from "../../../store/AppContext";
import { formatIdr } from "../../../utils/format";
import { Button } from "../../atoms/Button";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToCart } = useAppContext();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, VariantOption>
  >({});
  const [activeImage, setActiveImage] = useState(product.images[0]);

  useEffect(() => {
    setActiveImage(product.images[0]);
    if (product.variants && product.variants.length > 0) {
      const initialVars: Record<string, VariantOption> = {};
      product.variants.forEach((v) => {
        initialVars[v.id] = v.options[0];
      });
      setSelectedVariants(initialVars);
    } else {
      setSelectedVariants({});
    }
  }, [product]);

  const category = CATEGORIES.find((c) => c.id === product.categoryId);
  const finalPrice =
    product.price +
    Object.values(selectedVariants).reduce(
      (sum, opt) => sum + (opt?.priceModifier || 0),
      0,
    );

  const handleVariantSelect = (variantId: string, opt: VariantOption) => {
    setSelectedVariants((prev) => ({ ...prev, [variantId]: opt }));
    if (opt.imageUrl) {
      setActiveImage(opt.imageUrl);
    }
  };

  const handleAddToCart = () => {
    const variantsTextArray: string[] = [];
    const variantIdsArray: string[] = [];

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        const selectedOpt = selectedVariants[v.id];
        if (selectedOpt) {
          variantsTextArray.push(
            `${v.name}: ${selectedOpt.name.split(" (+")[0]}`,
          );
          variantIdsArray.push(selectedOpt.id);
        }
      });
    }

    const cartItem = {
      id: product.id,
      cartItemId:
        product.variants && product.variants.length > 0
          ? `${product.id}-${variantIdsArray.join("-")}`
          : product.id,
      name: product.name,
      price: finalPrice,
      image: activeImage,
      variantsText:
        variantsTextArray.length > 0 ? variantsTextArray.join(", ") : null,
    };

    addToCart(cartItem);
  };

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6">
        <Link
          href={`/collections/${product.categoryId}`}
          className="inline-flex items-center gap-2 text-[#5A635E] hover:text-[#829E8D] mb-8 font-sans transition-colors"
        >
          <ChevronLeft size={20} /> Kembali ke {category?.name || "Koleksi"}
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {/* Active Image */}
            <div className="w-full aspect-[4/5] overflow-hidden mb-4 shadow-lg bg-[#FAFAF7] relative">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                quality={80}
                className="object-cover transition-opacity duration-300"
              />
            </div>

            {/* Gallery Selector Buttons */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => {
                  const thumbKey = `thumb-${idx}-${img.substring(28, 48)}`;
                  return (
                    <button
                      type="button"
                      key={thumbKey}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 flex-shrink-0 border-2 transition-all duration-300 cursor-pointer relative ${
                        activeImage === img
                          ? "border-[#829E8D] opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        quality={80}
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col justify-center"
          >
            {product.bestSeller && (
              <div className="mb-4 inline-block bg-[#E8D9D2] text-[#2C302E] text-xs font-sans px-3 py-1 uppercase tracking-wider w-fit shadow-sm">
                Best Seller
              </div>
            )}
            <h1 className="font-playfair text-4xl lg:text-5xl text-[#2C302E] mb-4">
              {product.name}
            </h1>
            <p className="font-sans text-2xl text-[#829E8D] font-medium mb-8">
              {formatIdr(finalPrice)}
            </p>

            {/* Dynamic Variant Picker */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 space-y-6">
                {product.variants.map((variant) => (
                  <div key={variant.id}>
                    <h4 className="font-playfair text-lg text-[#2C302E] mb-3">
                      {variant.name}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {variant.options.map((opt) => {
                        const isSelected =
                          selectedVariants[variant.id]?.id === opt.id;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => handleVariantSelect(variant.id, opt)}
                            className={`font-sans text-sm px-4 py-2 border transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "border-[#829E8D] bg-[#829E8D] text-white shadow-md"
                                : "border-[#E8D9D2] text-[#5A635E] hover:border-[#829E8D] bg-transparent"
                            }`}
                          >
                            {opt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-10">
              <h3 className="font-playfair text-xl text-[#2C302E] mb-3">
                Deskripsi
              </h3>
              <p className="font-sans text-[#5A635E] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full text-lg py-4 border-0"
              >
                Tambah ke Keranjang
              </Button>
              <p className="text-center text-xs text-[#5A635E] font-sans mt-4 flex items-center justify-center gap-2">
                <Star size={14} /> Rangkaian eksklusif, dibuat berdasarkan
                pesanan.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
