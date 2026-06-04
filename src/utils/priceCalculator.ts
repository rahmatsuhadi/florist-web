import { ProductVariantOption } from "@/services/admin/productService";

export const calculateFinalPrice = (
  basePrice: string | number,
  selectedVariants: Record<string, ProductVariantOption> | ProductVariantOption[]
): number => {
  const variantOptions = Array.isArray(selectedVariants)
    ? selectedVariants
    : Object.values(selectedVariants);

  let calculatedBase = Number(basePrice) || 0;

  // First pass: look for 'replace' price type. It overrides the base price.
  variantOptions.forEach((opt) => {
    if (opt.priceType === "replace") {
      calculatedBase = Number(opt.price) || 0;
    }
  });

  // Second pass: look for 'add' price type to add on top of the calculated base
  let finalPrice = calculatedBase;
  variantOptions.forEach((opt) => {
    if (opt.priceType === "add") {
      finalPrice += Number(opt.price) || 0;
    }
  });

  return finalPrice;
};
