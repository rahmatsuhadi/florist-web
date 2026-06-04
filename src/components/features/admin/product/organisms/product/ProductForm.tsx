"use client";

import React, { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/services/admin/productService";
import { saveProductAction } from "@/services/actions/productActions";

import { ProductFormHeader } from "@/components/features/admin/product/molecules/product/ProductFormHeader";
import { ProductDeleteModal } from "@/components/features/admin/product/molecules/product/ProductDeleteModal";
import { ProductBasicInfo } from "@/components/features/admin/product/molecules/product/ProductBasicInfo";
import { ProductGalleryUpload } from "@/components/features/admin/product/molecules/product/ProductGalleryUpload";
import { ProductVariantBuilder } from "@/components/features/admin/product/organisms/product/ProductVariantBuilder";
import { FadeInUpWrapper } from "@/components/ui/MotionWrappers";

interface ProductFormProps {
  initialData?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const [state, formAction, isPending] = useActionState(saveProductAction, {
    success: false,
    message: "",
    errors: {},
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <form action={formAction} className="space-y-6 pb-20">
        <ProductFormHeader
          isEditMode={!!initialData}
          isPending={isPending}
          onDeleteClick={() => setShowDeleteModal(true)}
        />

        <FadeInUpWrapper>
          {initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <ProductGalleryUpload initialImages={initialData?.images} />
              <ProductBasicInfo 
                initialData={initialData} 
                errors={state.errors} 
                submittedData={state.submittedData}
              />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <ProductVariantBuilder initialVariants={initialData?.variantGroups} />
            </div>
          </div>
        </FadeInUpWrapper>
      </form>

      <ProductDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        productId={initialData?.id}
        productName={initialData?.name}
      />
    </>
  );
};
