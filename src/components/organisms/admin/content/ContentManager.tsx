"use client";

import React, { useState, useRef } from "react";
import { useContent } from "@/hooks/admin/useContent";
import { Plus, Trash2, GripVertical, Image as ImageIcon, Save } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { HeroBannerData, GalleryItemData } from "@/services/admin/contentService";
import { uploadImageAction, removeImageAction } from "@/services/admin/storageService";
import { ConfirmModal } from "@/components/molecules/admin/ConfirmModal";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import { LoadingSpinner } from "@/components/atoms/admin/LoadingSpinner";

export const ContentManager = () => {
  const {
    banners,
    gallery,
    isLoading,
    handleAddBanner,
    handleUpdateBanner,
    handleDeleteBanner,
    handleReorderBanners,
    handleAddGallery,
    handleUpdateGallery,
    handleDeleteGallery,
    handleReorderGallery,
  } = useContent();

  const [activeTab, setActiveTab] = useState<"hero" | "gallery">("hero");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8D9D2] overflow-hidden">
      <div className="flex border-b border-[#E8D9D2]">
        <button
          onClick={() => setActiveTab("hero")}
          className={`px-6 py-4 font-sans font-medium transition-colors ${
            activeTab === "hero" ? "border-b-2 border-[#829E8D] text-[#829E8D]" : "text-[#5A635E] hover:text-[#2C302E]"
          }`}
        >
          Banner Hero
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-6 py-4 font-sans font-medium transition-colors ${
            activeTab === "gallery" ? "border-b-2 border-[#829E8D] text-[#829E8D]" : "text-[#5A635E] hover:text-[#2C302E]"
          }`}
        >
          Galeri Foto
        </button>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner text="Memuat data konten..." className="py-20" />
          </motion.div>
        ) : activeTab === "hero" ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-playfair text-xl text-[#2C302E]">Pengaturan Banner</h3>
                <p className="text-sm text-[#5A635E]">Atur banner yang muncul di halaman utama paling atas.</p>
              </div>
              <Button onClick={handleAddBanner} className="flex items-center gap-2">
                <Plus size={18} /> Tambah Banner
              </Button>
            </div>

            <div className="grid gap-4">
              {banners.map((banner, index) => (
                <BannerEditor 
                  key={banner.id || `b-${index}`} 
                  banner={banner} 
                  index={index}
                  onUpdate={(data) => handleUpdateBanner(banner.id, data)}
                  onDelete={() => handleDeleteBanner(banner.id)}
                  onReorder={handleReorderBanners}
                />
              ))}
              {banners.length === 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                  Belum ada banner. Klik "Tambah Banner" untuk memulai.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-playfair text-xl text-[#2C302E]">Pengaturan Galeri</h3>
                <p className="text-sm text-[#5A635E]">Atur foto-foto yang tampil di section galeri.</p>
              </div>
              <Button onClick={handleAddGallery} className="flex items-center gap-2">
                <Plus size={18} /> Tambah Foto
              </Button>
            </div>

            <div className="grid gap-4">
              {gallery.map((item, index) => (
                <GalleryEditor 
                  key={item.id || `g-${index}`} 
                  item={item} 
                  index={index}
                  onUpdate={(data) => handleUpdateGallery(item.id, data)}
                  onDelete={() => handleDeleteGallery(item.id)}
                  onReorder={handleReorderGallery}
                />
              ))}
              {gallery.length === 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-xl text-gray-500">
                  Belum ada foto galeri. Klik "Tambah Foto" untuk memulai.
                </div>
              )}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const BannerEditor = ({ 
  banner, 
  index,
  onUpdate, 
  onDelete,
  onReorder
}: { 
  banner: HeroBannerData; 
  index: number;
  onUpdate: (data: HeroBannerData) => void;
  onDelete: () => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}) => {
  const [data, setData] = useState(banner);
  const [isChanged, setIsChanged] = useState(false);
  const [uploadingUrl, setUploadingUrl] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setIsChanged(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setUploadingUrl(localUrl);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadImageAction(formData, "banners");
      setData((prev) => ({ ...prev, imageUrl: url }));
      setIsChanged(true);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah gambar");
    } finally {
      setUploadingUrl(null);
      URL.revokeObjectURL(localUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (data.imageUrl && data.imageUrl.startsWith("http")) {
      try {
        await removeImageAction(data.imageUrl);
      } catch (error) {
        console.error("Gagal menghapus gambar di storage", error);
      }
    }
    setData((prev) => ({ ...prev, imageUrl: "" }));
    setIsChanged(true);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="y"
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStop={(e, data) => {
        const itemHeight = 160; 
        const deltaIndex = Math.round(data.y / itemHeight);
        if (deltaIndex !== 0) {
          onReorder(index, index + deltaIndex);
        }
      }}
    >
      <div ref={nodeRef} className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 relative group transition-shadow hover:shadow-md">
        <div className="drag-handle cursor-grab active:cursor-grabbing pt-2 text-gray-400 hover:text-brand hidden md:block">
          <GripVertical size={20} />
        </div>
        <div className="relative w-32 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group/img">
        {uploadingUrl ? (
          <>
            <img src={uploadingUrl} alt="uploading" className="w-full h-full object-cover blur-sm opacity-60 grayscale" />
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100/50 backdrop-blur-sm overflow-hidden">
              <motion.div
                className="h-full bg-[#829E8D]"
                initial={{ width: "0%", x: "-100%" }}
                animate={{ width: "40%", x: "300%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </>
        ) : data.imageUrl ? (
          <>
            <Image src={data.imageUrl} alt={data.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/40">Ganti</button>
              <button onClick={handleRemoveImage} className="text-white text-xs bg-red-500/80 px-2 py-1 rounded hover:bg-red-500">Hapus</button>
            </div>
          </>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center text-gray-400 hover:text-gray-600">
            <ImageIcon size={24} />
            <span className="text-[10px] mt-1">Pilih Foto</span>
          </button>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
      </div>
      <div className="flex-1 grid gap-3">
        <div className="grid grid-cols-1 gap-3">
          <Input 
            label="Image URL" 
            name="imageUrl" 
            value={data.imageUrl} 
            onChange={handleChange} 
            disabled={!!uploadingUrl}
          />
        </div>
        <Input 
          label="Judul (Title)" 
          name="title" 
          value={data.title} 
          onChange={handleChange} 
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-sans font-medium text-[#2C302E]">Subjudul (Subtitle)</label>
          <textarea
            name="subtitle"
            value={data.subtitle}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-[#E8D9D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#829E8D]/20 focus:border-[#829E8D] transition-all duration-300 font-sans text-sm text-[#2C302E] resize-none h-20"
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          {isChanged && (
            <Button 
              variant="outline" 
              onClick={() => { onUpdate(data); setIsChanged(false); }}
              className="py-1 px-3 h-8 text-xs flex items-center gap-1"
            >
              <Save size={14} /> Simpan
            </Button>
          )}
          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Banner"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onDelete}
        title="Hapus Banner"
        message="Apakah Anda yakin ingin menghapus banner ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Banner"
      />
      </div>
    </Draggable>
  );
};

const GalleryEditor = ({ 
  item, 
  index,
  onUpdate, 
  onDelete,
  onReorder
}: { 
  item: GalleryItemData; 
  index: number;
  onUpdate: (data: GalleryItemData) => void;
  onDelete: () => void;
  onReorder: (oldIndex: number, newIndex: number) => void;
}) => {
  const [data, setData] = useState(item);
  const [isChanged, setIsChanged] = useState(false);
  const [uploadingUrl, setUploadingUrl] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setIsChanged(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setUploadingUrl(localUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadImageAction(formData, "gallery");
      setData((prev) => ({ ...prev, imageUrl: url }));
      setIsChanged(true);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah gambar");
    } finally {
      setUploadingUrl(null);
      URL.revokeObjectURL(localUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (data.imageUrl && data.imageUrl.startsWith("http")) {
      try {
        await removeImageAction(data.imageUrl);
      } catch (error) {
        console.error("Gagal menghapus gambar di storage", error);
      }
    }
    setData((prev) => ({ ...prev, imageUrl: "" }));
    setIsChanged(true);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      axis="y"
      handle=".drag-handle"
      position={{ x: 0, y: 0 }}
      onStop={(e, data) => {
        const itemHeight = 160; 
        const deltaIndex = Math.round(data.y / itemHeight);
        if (deltaIndex !== 0) {
          onReorder(index, index + deltaIndex);
        }
      }}
    >
      <div ref={nodeRef} className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 relative group transition-shadow hover:shadow-md">
        <div className="drag-handle cursor-grab active:cursor-grabbing pt-2 text-gray-400 hover:text-brand hidden md:block">
          <GripVertical size={20} />
        </div>
        <div className="relative w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group/img">
        {uploadingUrl ? (
          <>
            <img src={uploadingUrl} alt="uploading" className="w-full h-full object-cover blur-sm opacity-60 grayscale" />
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100/50 backdrop-blur-sm overflow-hidden">
              <motion.div
                className="h-full bg-[#829E8D]"
                initial={{ width: "0%", x: "-100%" }}
                animate={{ width: "40%", x: "300%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </>
        ) : data.imageUrl ? (
          <>
            <Image src={data.imageUrl} alt={data.altText} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/40">Ganti</button>
              <button onClick={handleRemoveImage} className="text-white text-xs bg-red-500/80 px-2 py-1 rounded hover:bg-red-500">Hapus</button>
            </div>
          </>
        ) : (
          <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center text-gray-400 hover:text-gray-600">
            <ImageIcon size={24} />
            <span className="text-[10px] mt-1">Pilih Foto</span>
          </button>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
      </div>
      <div className="flex-1 grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input 
            label="Image URL" 
            name="imageUrl" 
            value={data.imageUrl} 
            onChange={handleChange} 
            disabled={!!uploadingUrl}
          />
          <Input 
            label="Alt Text (SEO)" 
            name="altText" 
            value={data.altText} 
            onChange={handleChange} 
          />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-sans font-medium text-[#2C302E]">Grid Class (Ukuran)</label>
            <select
              name="gridClass"
              value={data.gridClass}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[#E8D9D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#829E8D]/20 focus:border-[#829E8D] transition-all duration-300 font-sans text-sm text-[#2C302E]"
            >
              <option value="md:col-span-1 md:row-span-1">Kecil (1x1)</option>
              <option value="md:col-span-2 md:row-span-1">Lebar (2x1)</option>
              <option value="md:col-span-1 md:row-span-2">Tinggi (1x2)</option>
              <option value="md:col-span-2 md:row-span-2">Besar (2x2)</option>
              <option value="block md:hidden">Sembunyi di Desktop</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          {isChanged && (
            <Button 
              variant="outline" 
              onClick={() => { onUpdate(data); setIsChanged(false); }}
              className="py-1 px-3 h-8 text-xs flex items-center gap-1"
            >
              <Save size={14} /> Simpan
            </Button>
          )}
          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Foto"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onDelete}
        title="Hapus Foto Galeri"
        message="Apakah Anda yakin ingin menghapus foto ini dari galeri? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Foto"
      />
      </div>
    </Draggable>
  );
};
