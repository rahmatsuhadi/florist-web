"use client";

import { motion } from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
import { Product, ProductVariantOption, ProductVariantGroup } from "@/services/admin/productService";
import { useAppContext, VariantDetail } from "@/store/AppContext";
import { formatIdr } from "@/utils/format";
import { calculateFinalPrice } from "@/utils/priceCalculator";
import { ProductGallery } from "../molecules/ProductGallery";
import { ProductVariantPicker } from "../molecules/ProductVariantPicker";
import { ProductOrderForm } from "../molecules/ProductOrderForm";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToCart } = useAppContext();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, ProductVariantOption>
  >({});
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [itemNotes, setItemNotes] = useState("");

  useEffect(() => {
    setActiveImage(product.images[0]);
    if (product.variantGroups && product.variantGroups.length > 0) {
      const initialVars: Record<string, ProductVariantOption> = {};
      product.variantGroups.forEach((v: ProductVariantGroup) => {
        initialVars[v.id] = v.options[0];
      });
      setSelectedVariants(initialVars);
    } else {
      setSelectedVariants({});
    }
  }, [product]);

  const finalPrice = calculateFinalPrice(product.basePrice, selectedVariants);

  const handleVariantSelect = (variantId: string, opt: ProductVariantOption) => {
    setSelectedVariants((prev) => ({ ...prev, [variantId]: opt }));
    if (opt.image) {
      setActiveImage(opt.image);
    }
  };

  const handleAddToCart = () => {
    const variantsTextArray: string[] = [];
    const variantIdsArray: string[] = [];
    const variantDetails: VariantDetail[] = []

    if (product.variantGroups && product.variantGroups.length > 0) {
      product.variantGroups.forEach((v: ProductVariantGroup) => {
        const selectedOpt = selectedVariants[v.id];
        if (selectedOpt) {
          variantsTextArray.push(`${v.name}: ${selectedOpt.name}`);
          variantIdsArray.push(selectedOpt.id);
          variantDetails.push({
            name: selectedOpt.name,
            groupName: v.name,
            price: Number(selectedOpt.price)
          })
        }
      });
    }

    let generatedCartItemId = product.variantGroups && product.variantGroups.length > 0
      ? `${product.id}-${variantIdsArray.join("-")}`
      : String(product.id);

    if (itemNotes.trim()) {
      generatedCartItemId += `-note-${encodeURIComponent(itemNotes.trim()).slice(0, 30)}`;
    }

    const cartItem = {
      id: String(product.id),
      cartItemId: generatedCartItemId,
      name: product.name,
      price: finalPrice,
      image: activeImage || "",
      variantsText:
        variantsTextArray.length > 0 ? variantsTextArray.join(", ") : null,
      category: product.category,
      variantDetails: variantDetails,
      notes: itemNotes.trim() || undefined,
    };

    addToCart(cartItem);
    // Reset notes
    setItemNotes("");
  };

  const allImages = product.images;
  Object.values(selectedVariants).forEach((opt) => {
    if (opt.image && !allImages.includes(opt.image)) {
      allImages.push(opt.image);
    }
  });


  return (
    <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
      <ProductGallery
        productName={product.name}
        images={allImages}
        activeImage={activeImage}
        onImageSelect={setActiveImage}
      />

      {/* Details & Actions */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col justify-center"
      >
        <h1 className="font-playfair text-4xl lg:text-5xl text-[#2C302E] mb-4">
          {product.name}
        </h1>
        <p className="font-sans text-2xl text-[#829E8D] font-medium mb-8">
          {formatIdr(finalPrice)}
        </p>

        <ProductVariantPicker
          variantGroups={product.variantGroups || []}
          selectedVariants={selectedVariants}
          onVariantSelect={handleVariantSelect}
        />

        <div className="mb-10">
          <h3 className="font-playfair text-xl text-[#2C302E] mb-3">
            Deskripsi
          </h3>
          <p className="font-sans text-[#5A635E] leading-relaxed">
            {product.description}
          </p>
        </div>

        <ProductOrderForm
          notes={itemNotes}
          onNotesChange={setItemNotes}
          onAddToCart={handleAddToCart}
        />
      </motion.div>
    </div>
  );
};

export default ProductDetails;
