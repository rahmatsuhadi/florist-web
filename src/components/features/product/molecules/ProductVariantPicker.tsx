"use client";

import type React from "react";
import { ProductVariantOption, ProductVariantGroup } from "@/services/admin/productService";

interface ProductVariantPickerProps {
  variantGroups: ProductVariantGroup[];
  selectedVariants: Record<string, ProductVariantOption>;
  onVariantSelect: (variantId: string, opt: ProductVariantOption) => void;
}

export const ProductVariantPicker: React.FC<ProductVariantPickerProps> = ({
  variantGroups,
  selectedVariants,
  onVariantSelect,
}) => {
  if (!variantGroups || variantGroups.length === 0) return null;

  return (
    <div className="mb-8 space-y-6">
      {variantGroups.map((variant: ProductVariantGroup) => (
        <div key={variant.id}>
          <h4 className="font-playfair text-lg text-[#2C302E] mb-3">
            {variant.name}
          </h4>
          <div className="flex flex-wrap gap-3">
            {variant.options.map((opt: ProductVariantOption) => {
              const isSelected = selectedVariants[variant.id]?.id === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => onVariantSelect(variant.id, opt)}
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
  );
};
