"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";

interface ProductGalleryProps {
  productName: string;
  images: string[];
  activeImage: string;
  onImageSelect: (image: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  images,
  activeImage,
  onImageSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1"
    >
      <div className="w-full aspect-[4/5] overflow-hidden mb-4 shadow-lg bg-[#FAFAF7] relative">
        <Image
          src={activeImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          quality={80}
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img: string, idx: number) => {
            const thumbKey = `thumb-${idx}-${img.substring(28, 48)}`;
            return (
              <button
                type="button"
                key={thumbKey}
                onClick={() => onImageSelect(img)}
                className={`w-20 h-20 flex-shrink-0 border-2 transition-all duration-300 cursor-pointer relative ${
                  activeImage === img
                    ? "border-[#829E8D] opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
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
  );
};
