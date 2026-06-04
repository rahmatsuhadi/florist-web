"use client";

import React, { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { uploadImageAction, removeImageAction } from "@/services/admin/storageService";

interface ProductGalleryUploadProps {
  initialImages?: string[];
}

export const ProductGalleryUpload: React.FC<ProductGalleryUploadProps> = ({
  initialImages = [],
}) => {
  const [images, setImages] = useState(initialImages);
  const [uploadingFiles, setUploadingFiles] = useState<{ localUrl: string }[]>([]);

  const handleMainImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const tempFiles = files.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    setUploadingFiles((prev) => [...prev, ...tempFiles.map((t) => ({ localUrl: t.localUrl }))]);

    try {
      const uploadPromises = tempFiles.map(async (temp) => {
        const formData = new FormData();
        formData.append("file", temp.file);
        try {
          const url = await uploadImageAction(formData, "products");
          setImages((prev) => [...prev, url]);
        } finally {
          setUploadingFiles((prev) => prev.filter((p) => p.localUrl !== temp.localUrl));
          URL.revokeObjectURL(temp.localUrl);
        }
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunggah foto produk.");
    } finally {
      setUploadingFiles([]);
    }
  };

  const handleRemoveMainImage = async (indexToRemove: number) => {
    const imageUrl = images[indexToRemove];

    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));

    if (imageUrl.startsWith("http")) {
      try {
        await removeImageAction(imageUrl);
      } catch (error) {
        console.error("Failed to delete remote image:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Galeri Produk
          </label>
          <span className="text-xs text-gray-500">{images.length} Foto</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200"
            >
              <img
                src={img}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover"
              />
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 bg-brand text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  UTAMA
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveMainImage(idx);
                  }}
                  className="p-1.5 bg-white text-red-500 rounded-lg hover:bg-red-50 shadow-sm transition-colors"
                  title="Hapus Foto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {uploadingFiles.map((temp, idx) => (
            <div
              key={`uploading-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200"
            >
              <img
                src={temp.localUrl}
                alt="uploading"
                className="w-full h-full object-cover blur-sm opacity-60 grayscale"
              />
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100/50 backdrop-blur-sm overflow-hidden">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: "0%", x: "-100%" }}
                  animate={{ width: "40%", x: "300%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ))}

          <label className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-brand/50 hover:bg-gray-50/80 transition-colors cursor-pointer">
            <Camera size={20} className="mb-1" />
            <span className="text-[10px] font-medium text-gray-500">
              Tambah Foto
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleMainImagesUpload}
            />
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Foto pertama akan menjadi cover/thumbnail produk.
        </p>
      </div>
    </div>
  );
};
