"use client";

import React, { useActionState, useRef, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ImageUploadSlot } from "../atoms/ImageUploadSlot";
import { DragHandle } from "../atoms/DragHandle";
import { SaveButton } from "../atoms/SaveButton";
import { ConfirmModal } from "@/components/features/admin/core/molecules/ConfirmModal";
import { updateBannerAction, deleteBannerAction } from "@/services/actions/contentActions";
import type { ActionState } from "@/services/actions/contentSchemas";
import type { HeroBannerData } from "@/services/admin/contentService";
import Draggable from "react-draggable";
import { toast } from "sonner";

interface BannerEditorCardProps {
  banner: HeroBannerData;
  index: number;
  onReorder: (oldIndex: number, newIndex: number) => void;
}

const initialState: ActionState = { success: false, message: "" };

export const BannerEditorCard: React.FC<BannerEditorCardProps> = ({
  banner,
  index,
  onReorder,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState(banner.imageUrl);

  const [updateState, updateAction] = useActionState(updateBannerAction, initialState);
  const [deleteState, deleteAction] = useActionState(deleteBannerAction, initialState);

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
    formData.append("id", String(banner.id));
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
          {/* Hidden fields for form submission */}
          <input type="hidden" name="id" value={banner.id ?? ""} />
          <input type="hidden" name="imageUrl" value={imageUrl} />
          <input type="hidden" name="position" value={banner.position} />
          <input type="hidden" name="isActive" value={String(banner.isActive)} />

          {/* Top: Image preview + order badge */}
          <div className="relative aspect-[21/9] bg-gray-100">
            <ImageUploadSlot
              imageUrl={imageUrl}
              altText={banner.title}
              folder="banners"
              sizeClass="w-full h-full"
              onImageChange={setImageUrl}
            />

            {/* Order badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 shadow-sm border border-gray-200">
                {index + 1}
              </span>
            </div>

            {/* Drag handle overlay */}
            <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
              <DragHandle />
            </div>
          </div>

          {/* Bottom: Fields + actions */}
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <label htmlFor={`banner-title-${banner.id}`} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Judul
              </label>
              <input
                id={`banner-title-${banner.id}`}
                name="title"
                defaultValue={banner.title}
                placeholder="Masukkan judul banner..."
                className="w-full px-3 py-2 bg-gray-50 border border-brand/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all font-sans text-sm text-gray-900"
              />
              {updateState.errors?.title && (
                <span className="text-xs text-red-500">{updateState.errors.title[0]}</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor={`banner-subtitle-${banner.id}`} className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Subjudul
              </label>
              <textarea
                id={`banner-subtitle-${banner.id}`}
                name="subtitle"
                defaultValue={banner.subtitle}
                placeholder="Masukkan subjudul banner..."
                rows={2}
                className="w-full px-3 py-2 bg-gray-50 border border-brand/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand focus:bg-white transition-all font-sans text-sm text-gray-900 resize-none"
              />
              {updateState.errors?.subtitle && (
                <span className="text-xs text-red-500">{updateState.errors.subtitle[0]}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
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
        </form>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Hapus Banner"
          message="Apakah Anda yakin ingin menghapus banner ini? Tindakan ini tidak dapat dibatalkan."
          confirmText="Hapus Banner"
        />
      </div>
    </Draggable>
  );
};
