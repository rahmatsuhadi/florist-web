"use client";

import React, { useActionState, useRef, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ImageUploadSlot } from "../atoms/ImageUploadSlot";
import { DragHandle } from "../atoms/DragHandle";
import { SaveButton } from "../atoms/SaveButton";
import { ConfirmModal } from "@/components/features/admin/core/molecules/ConfirmModal";
import { updateGalleryAction, deleteGalleryAction } from "@/services/actions/contentActions";
import type { ActionState } from "@/services/actions/contentSchemas";
import type { GalleryItemData } from "@/services/admin/contentService";
import Draggable from "react-draggable";
import { toast } from "sonner";

interface GalleryEditorCardProps {
  item: GalleryItemData;
  index: number;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

const GRID_OPTIONS = [
  { value: "md:col-span-1 md:row-span-1", label: "Kecil (1×1)" },
  { value: "md:col-span-2 md:row-span-1", label: "Lebar (2×1)" },
  { value: "md:col-span-1 md:row-span-2", label: "Tinggi (1×2)" },
  { value: "md:col-span-2 md:row-span-2", label: "Besar (2×2)" },
  { value: "block md:hidden", label: "Sembunyi di Desktop" },
];

const initialState: ActionState = { success: false, message: "" };

export const GalleryEditorCard: React.FC<GalleryEditorCardProps> = ({
  item,
  index,
  onReorder,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);

  const [updateState, updateAction] = useActionState(updateGalleryAction, initialState);
  const [deleteState, deleteAction] = useActionState(deleteGalleryAction, initialState);

  useEffect(() => {
    if (updateState.message) {
      if (updateState.success) toast.success(updateState.message);
      else toast.error(updateState.message);
    }
  }, [updateState]);

  useEffect(() => {
    if (deleteState.message) {
      if (deleteState.success) toast.success(deleteState.message);
      else toast.error(deleteState.message);
    }
  }, [deleteState]);

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    const formData = new FormData();
    formData.append("id", String(item.id));
    deleteAction(formData);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="y"
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStop={(_e, data) => {
        const itemHeight = 200;
        const deltaIndex = Math.round(data.y / itemHeight);
        if (deltaIndex !== 0) {
          onReorder(index, index + deltaIndex);
        }
      }}
    >
      <div
        ref={nodeRef}
        className="bg-white rounded-xl border border-brand/20 shadow-sm transition-shadow hover:shadow-md overflow-hidden"
      >
        <form action={updateAction}>
          {/* Hidden fields */}
          <input type="hidden" name="id" value={item.id ?? ""} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <input type="hidden" name="position" value={item.position} />
          <input type="hidden" name="isActive" value={String(item.isActive)} />

          <div className="flex flex-col sm:flex-row">
            {/* Left: Square image preview */}
            <div className="relative w-full sm:w-44 aspect-square sm:aspect-auto sm:h-auto shrink-0 bg-gray-100">
              <ImageUploadSlot
                imageUrl={imageUrl}
                altText={item.altText}
                folder="gallery"
                sizeClass="w-full h-full"
                onImageChange={setImageUrl}
              />

              {/* Order badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm border border-gray-200">
                  {index + 1}
                </span>
              </div>

              {/* Drag handle */}
              <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                <DragHandle />
              </div>
            </div>

            {/* Right: Fields + actions */}
            <div className="flex-1 p-4 flex flex-col justify-between gap-3">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor={`gallery-alt-${item.id}`} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Alt Text (SEO)
                  </label>
                  <input
                    id={`gallery-alt-${item.id}`}
                    name="altText"
                    defaultValue={item.altText}
                    placeholder="Deskripsi gambar untuk SEO..."
                    className="w-full px-3 py-2 bg-gray-50 border border-brand/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all font-sans text-sm text-gray-900"
                  />
                  {updateState.errors?.altText && (
                    <span className="text-xs text-red-500">{updateState.errors.altText[0]}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor={`gallery-grid-${item.id}`} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Ukuran Grid
                  </label>
                  <select
                    id={`gallery-grid-${item.id}`}
                    name="gridClass"
                    defaultValue={item.gridClass}
                    className="w-full px-3 py-2 bg-gray-50 border border-brand/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all font-sans text-sm text-gray-900 cursor-pointer"
                  >
                    {GRID_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  Hapus
                </button>
                <SaveButton />
              </div>
            </div>
          </div>
        </form>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Hapus Foto Galeri"
          message="Apakah Anda yakin ingin menghapus foto ini dari galeri? Tindakan ini tidak dapat dibatalkan."
          confirmText="Hapus Foto"
        />
      </div>
    </Draggable>
  );
};
