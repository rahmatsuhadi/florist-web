"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { uploadImageAction, removeImageAction } from "@/services/admin/storageService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageUploadSlotProps {
  imageUrl: string;
  altText: string;
  folder: string;
  /** Aspect ratio class, e.g. "w-32 h-24" or "w-32 h-32" */
  sizeClass?: string;
  onImageChange: (newUrl: string) => void;
}

export const ImageUploadSlot: React.FC<ImageUploadSlotProps> = ({
  imageUrl,
  altText,
  folder,
  sizeClass = "w-32 h-24",
  onImageChange,
}) => {
  const [uploadingUrl, setUploadingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setUploadingUrl(localUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadImageAction(formData, folder);
      onImageChange(url);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah gambar");
    } finally {
      setUploadingUrl(null);
      URL.revokeObjectURL(localUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl && imageUrl.startsWith("http")) {
      try {
        await removeImageAction(imageUrl);
      } catch (error) {
        console.error("Gagal menghapus gambar di storage", error);
      }
    }
    onImageChange("");
  };

  return (
    <div
      className={`relative ${sizeClass} bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group/img`}
    >
      {uploadingUrl ? (
        <>
          <img
            src={uploadingUrl}
            alt="uploading"
            className="w-full h-full object-cover blur-sm opacity-60 grayscale"
          />
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100/50 backdrop-blur-sm overflow-hidden">
            <motion.div
              className="h-full bg-brand"
              initial={{ width: "0%", x: "-100%" }}
              animate={{ width: "40%", x: "300%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </>
      ) : imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/40"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-white text-xs bg-red-500/80 px-2 py-1 rounded hover:bg-red-500"
            >
              Hapus
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center text-gray-400 hover:text-gray-600"
        >
          <ImageIcon size={24} />
          <span className="text-[10px] mt-1">Pilih Foto</span>
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
      />
    </div>
  );
};
